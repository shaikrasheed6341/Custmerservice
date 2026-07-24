import axios from 'axios';
import querystring from 'querystring';
import { db } from '../db/index.js';
import { callHistory } from '../db/schema.js';
import { eq, ne, desc } from 'drizzle-orm';
import { config, isConfigured, getBaseUrl, getAuthHeaders } from '../config/exotel.js';

/**
 * Trigger outbound call (Connect Agent and Customer)
 */
export const connectCall = async (req, res) => {
  const { from, to, agentName = 'Agent', customerName = 'Customer' } = req.body;

  if (!from || !to) {
    return res.status(400).json({ 
      success: false, 
      message: 'Both "from" (agent phone) and "to" (customer phone) are required.' 
    });
  }

  const callSid = `sid_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const dateStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // 1. If Exotel is not configured, run sandbox simulation
  if (!isConfigured) {
    console.log(`[Exotel Mock] Connecting ${agentName} (${from}) <-> ${customerName} (${to})`);

    try {
      // Insert initial record in db
      await db.insert(callHistory).values({
        sid: callSid,
        date: dateStr,
        customer: customerName,
        customerNumber: to,
        agent: agentName,
        agentNumber: from,
        duration: '00:00',
        status: 'ringing-agent',
        recordingUrl: null
      });

      // Start mock flow simulation (updates DB asynchronously)
      simulateMockCallFlow(callSid);

      const [newCall] = await db.select().from(callHistory).where(eq(callHistory.sid, callSid));
      return res.status(200).json({
        success: true,
        message: 'Call initiated (Sandbox/Mock mode)',
        data: newCall
      });
    } catch (dbErr) {
      console.error('Database write error:', dbErr.message);
      return res.status(500).json({ success: false, message: 'Database save failed', error: dbErr.message });
    }
  }

  // 2. If Exotel is configured, call Exotel REST API
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/Calls/connect.json`;
    const headers = getAuthHeaders();

    const host = req.get('host');
    const protocol = req.protocol;
    const serverUrl = `${protocol}://${host}`;

    const data = {
      From: from,
      To: to,
      CallerId: config.virtualNumber,
      Url: `${serverUrl}/api/webhooks/connect-customer?to=${encodeURIComponent(to)}`,
      StatusCallback: `${serverUrl}/api/webhooks/status`,
      StatusCallbackEvents: 'terminal'
    };

    console.log('[Exotel Live] Making API request with:', data);
    const response = await axios.post(url, querystring.stringify(data), { headers });
    const callDetails = response.data.Call;

    // Save initial record in DB
    await db.insert(callHistory).values({
      sid: callDetails.Sid,
      date: dateStr,
      customer: customerName,
      customerNumber: callDetails.To,
      agent: agentName,
      agentNumber: callDetails.From,
      duration: '00:00',
      status: callDetails.Status || 'ringing-agent',
      recordingUrl: null
    });

    const [newCall] = await db.select().from(callHistory).where(eq(callHistory.sid, callDetails.Sid));
    return res.status(200).json({
      success: true,
      message: 'Call successfully triggered on Exotel',
      data: newCall
    });
  } catch (error) {
    console.error('Exotel Live trigger error:', error.response ? error.response.data : error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate call via Exotel API.',
      error: error.response ? error.response.data : error.message
    });
  }
};

/**
 * Get call history logs
 */
export const getCallHistory = async (req, res) => {
  try {
    const logs = await db.select().from(callHistory).orderBy(desc(callHistory.timestamp));
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Database fetch failed', error: error.message });
  }
};

/**
 * Get active/live calls
 */
export const getActiveCalls = async (req, res) => {
  try {
    const active = await db.select()
      .from(callHistory)
      .where(ne(callHistory.status, 'completed'))
      .orderBy(desc(callHistory.timestamp));
    return res.status(200).json({ success: true, data: active });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Database fetch failed', error: error.message });
  }
};

/**
 * Get call details
 */
export const getCallDetails = async (req, res) => {
  const { sid } = req.params;
  try {
    const [call] = await db.select().from(callHistory).where(eq(callHistory.sid, sid));
    if (!call) {
      return res.status(404).json({ success: false, message: 'Call details not found' });
    }
    return res.status(200).json({ success: true, data: call });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Database fetch failed', error: error.message });
  }
};

/**
 * Webhook: Exotel calls this after Agent picks up to dial the Customer
 */
export const connectCustomerWebhook = (req, res) => {
  const to = req.query.to || req.body.to;
  console.log(`[Exotel Webhook] connect-customer triggered. Dialing customer: ${to}`);

  res.set('Content-Type', 'text/xml');
  if (!to) {
    return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Hangup /></Response>`);
  }
  return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Dial>${to}</Dial></Response>`);
};

/**
 * Webhook: Exotel calls this when someone dials the Exotel virtual number
 */
export const incomingCallWebhook = async (req, res) => {
  const callerNumber = req.query.From || req.body.From || 'Unknown';
  const callSid = req.query.CallSid || req.body.CallSid || `inc_sid_${Date.now()}`;
  const dateStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  console.log(`[Exotel Webhook] Incoming call from: ${callerNumber} (Sid: ${callSid})`);

  try {
    await db.insert(callHistory).values({
      sid: callSid,
      date: dateStr,
      customer: 'Incoming Caller',
      customerNumber: callerNumber,
      agent: 'Unassigned Agent',
      agentNumber: config.virtualNumber,
      duration: '00:00',
      status: 'in-progress',
      recordingUrl: null
    });
  } catch (dbErr) {
    console.error('Failed to log incoming call in DB:', dbErr.message);
  }

  // Dial agent extension
  const defaultAgentNumber = '+919999999991'; // Rahul
  res.set('Content-Type', 'text/xml');
  return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Dial>${defaultAgentNumber}</Dial></Response>`);
};

/**
 * Webhook: Exotel calls this when call completes
 */
export const statusWebhook = async (req, res) => {
  const data = req.body;
  const callSid = data.CallSid || data.Sid;

  console.log(`[Exotel Webhook] Call Completed callback. Sid: ${callSid}`);

  if (callSid) {
    const durationSec = parseInt(data.ConversationDuration || data.DurationInSeconds || '0', 10);
    const minutes = Math.floor(durationSec / 60).toString().padStart(2, '0');
    const seconds = (durationSec % 60).toString().padStart(2, '0');
    const durationStr = `${minutes}:${seconds}`;

    try {
      await db.update(callHistory)
        .set({
          status: 'completed',
          duration: durationStr,
          recordingUrl: data.RecordingUrl || null
        })
        .where(eq(callHistory.sid, callSid));
    } catch (dbErr) {
      console.error('Database update on statusWebhook failed:', dbErr.message);
    }
  }

  return res.status(200).send('OK');
};

/**
 * Asynchronously simulates the stages of a mock call flow in Sandbox mode
 */
function simulateMockCallFlow(sid) {
  // 1. Ringing agent -> 3s -> Ringing customer
  setTimeout(async () => {
    try {
      await db.update(callHistory).set({ status: 'ringing-customer' }).where(eq(callHistory.sid, sid));
      console.log(`[Exotel Mock] Call ${sid} status: ringing-customer`);
      
      // 2. Ringing customer -> 3s -> In progress
      setTimeout(async () => {
        try {
          await db.update(callHistory).set({ status: 'in-progress' }).where(eq(callHistory.sid, sid));
          console.log(`[Exotel Mock] Call ${sid} status: in-progress`);

          // 3. In progress -> 12s -> Completed
          setTimeout(async () => {
            const durationSec = Math.floor(Math.random() * 90) + 15;
            const minutes = Math.floor(durationSec / 60).toString().padStart(2, '0');
            const seconds = (durationSec % 60).toString().padStart(2, '0');
            const durationStr = `${minutes}:${seconds}`;
            const mockRecord = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${Math.floor(Math.random() * 5) + 1}.mp3`;

            try {
              await db.update(callHistory)
                .set({
                  status: 'completed',
                  duration: durationStr,
                  recordingUrl: mockRecord
                })
                .where(eq(callHistory.sid, sid));
              console.log(`[Exotel Mock] Call ${sid} status: completed (duration: ${durationStr})`);
            } catch (err) {
              console.error(err);
            }
          }, 12000);

        } catch (err) {
          console.error(err);
        }
      }, 3000);

    } catch (err) {
      console.error(err);
    }
  }, 3000);
}
