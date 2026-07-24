import { db } from '../db/index.js';
import { callHistory } from '../db/schema.js';
import { eq, ne, and, sql } from 'drizzle-orm';
import { isConfigured, config, getBaseUrl, getAuthHeaders } from '../config/exotel.js';
import axios from 'axios';
import querystring from 'querystring';

/**
 * Endpoint: POST /api/sos/trigger
 * Description: Tapped when a member triggers SOS. Creates an active call record,
 *              initiates the call bridge, and registers the emergency.
 */
export const triggerSOS = async (req, res) => {
  const { customerName = 'SOS Caller', customerNumber = '+919555500000', agentName = 'Emergency Dispatcher' } = req.body;

  const callSid = `sos_sid_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const dateStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Default Agent Number for emergency routing
  const agentNumber = '+919999999991'; 

  if (!isConfigured) {
    // Sandbox / Mock SOS call
    console.log(`🚨 [SOS Emergency Trigger] Mock call initiated for ${customerName} (${customerNumber})`);

    try {
      await db.insert(callHistory).values({
        sid: callSid,
        date: dateStr,
        customer: customerName,
        customerNumber,
        agent: agentName,
        agentNumber,
        duration: '00:00',
        status: 'ringing-agent',
        recordingUrl: null,
        callType: 'sos'
      });

      // Start mock flow progression
      simulateMockSOSFlow(callSid);

      const [newSOSCall] = await db.select().from(callHistory).where(eq(callHistory.sid, callSid));
      return res.status(200).json({
        success: true,
        message: 'SOS Call triggered successfully (Sandbox/Mock mode)',
        data: newSOSCall
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Database insert failed', error: error.message });
    }
  }

  // Live Mode (Trigger actual Exotel SOS call)
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/Calls/connect.json`;
    const headers = getAuthHeaders();

    const host = req.get('host');
    const protocol = req.protocol;
    const serverUrl = `${protocol}://${host}`;

    const data = {
      From: agentNumber, // Ring agent first
      To: customerNumber, // Then dial customer in distress
      CallerId: config.virtualNumber,
      Url: `${serverUrl}/api/calls/webhooks/connect-customer?to=${encodeURIComponent(customerNumber)}`,
      StatusCallback: `${serverUrl}/api/calls/webhooks/status`,
      StatusCallbackEvents: 'terminal'
    };

    console.log(`🚨 [SOS Emergency Trigger] Sending Live Exotel outbound trigger:`, data);
    const response = await axios.post(url, querystring.stringify(data), { headers });
    const callDetails = response.data.Call;

    await db.insert(callHistory).values({
      sid: callDetails.Sid,
      date: dateStr,
      customer: customerName,
      customerNumber,
      agent: agentName,
      agentNumber,
      duration: '00:00',
      status: callDetails.Status || 'ringing-agent',
      recordingUrl: null,
      callType: 'sos'
    });

    const [newSOSCall] = await db.select().from(callHistory).where(eq(callHistory.sid, callDetails.Sid));
    return res.status(200).json({
      success: true,
      message: 'SOS Live Exotel call triggered successfully',
      data: newSOSCall
    });
  } catch (error) {
    console.error('SOS Exotel trigger error:', error.response ? error.response.data : error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to trigger SOS call via Exotel API.',
      error: error.response ? error.response.data : error.message
    });
  }
};

/**
 * Endpoint: GET /api/sos/active-count
 * Description: Get count of all SOS members currently active in calls (not completed)
 */
export const getActiveSOSCount = async (req, res) => {
  try {
    // Query count where call_type = 'sos' and status != 'completed'
    const result = await db.select({
      count: sql`count(*)::int`
    })
    .from(callHistory)
    .where(
      and(
        eq(callHistory.callType, 'sos'),
        ne(callHistory.status, 'completed')
      )
    );

    const activeCount = result[0]?.count || 0;

    // Also get the raw list of active calls for display
    const activeCalls = await db.select()
      .from(callHistory)
      .where(
        and(
          eq(callHistory.callType, 'sos'),
          ne(callHistory.status, 'completed')
        )
      );

    return res.status(200).json({
      success: true,
      activeCount,
      activeCalls
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch active count', error: error.message });
  }
};

/**
 * Endpoint: POST /api/sos/simulate-bulk
 * Description: Simulates bulk SOS triggers (e.g. 100 members tapping SOS).
 *              Pushes mock database records which resolve asynchronously over time.
 * Body Params:
 *   - count: Number of simulated triggers (default: 100)
 */
export const simulateBulkSOS = async (req, res) => {
  const count = parseInt(req.body.count || '100', 10);
  const dateStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  console.log(`🚨 [SOS Simulation] Bulk simulating ${count} SOS triggers...`);

  const mockFirstNames = ['Rajesh', 'Amit', 'Sunil', 'Vijay', 'Karan', 'Pooja', 'Neha', 'Suresh', 'Vikram', 'Anil', 'Deepa', 'Sanjay'];
  const mockLastNames = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Reddy', 'Patel', 'Joshi', 'Nair', 'Rao', 'Gupta', 'Das', 'Choudhury'];
  const mockAgents = ['Rahul', 'Anjali', 'Priya', 'Ravi'];

  try {
    const bulkInserts = [];
    const createdSids = [];

    for (let i = 0; i < count; i++) {
      const callSid = `sos_bulk_sid_${Date.now()}_${i}_${Math.floor(Math.random() * 10000)}`;
      const randomCustPhone = `+919${Math.floor(500000000 + Math.random() * 499999999)}`;
      const custName = `${mockFirstNames[i % mockFirstNames.length]} ${mockLastNames[Math.floor(Math.random() * mockLastNames.length)]}`;
      const agentName = mockAgents[Math.floor(Math.random() * mockAgents.length)];
      
      // Randomize initial status to make dashboard look realistic
      const initialStatuses = ['ringing-agent', 'ringing-customer', 'in-progress'];
      const status = initialStatuses[Math.floor(Math.random() * initialStatuses.length)];

      bulkInserts.push({
        sid: callSid,
        date: dateStr,
        customer: custName,
        customerNumber: randomCustPhone,
        agent: agentName,
        agentNumber: '+919999999991',
        duration: '00:00',
        status,
        recordingUrl: null,
        callType: 'sos'
      });

      createdSids.push(callSid);
    }

    // Bulk insert into PostgreSQL
    await db.insert(callHistory).values(bulkInserts);

    // Asynchronously resolve each simulated call with staggered hangups
    createdSids.forEach((sid) => {
      // Stagger completion between 15 seconds to 120 seconds
      const staggerDelay = Math.floor(15000 + Math.random() * 105000);
      
      setTimeout(async () => {
        const durationSec = Math.floor(10 + Math.random() * 90);
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
          console.log(`[SOS Simulation] Bulk Call ${sid} resolved to completed.`);
        } catch (err) {
          console.error(`Error resolving simulated SOS call ${sid}:`, err.message);
        }
      }, staggerDelay);
    });

    return res.status(200).json({
      success: true,
      message: `Bulk SOS simulation active. Simulated ${count} emergency calls.`,
      activeCount: count
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to trigger bulk simulation', error: error.message });
  }
};

/**
 * Progress single call flow in Sandbox mode
 */
function simulateMockSOSFlow(sid) {
  // Ringing Agent -> 2s -> Ringing Customer
  setTimeout(async () => {
    try {
      await db.update(callHistory).set({ status: 'ringing-customer' }).where(eq(callHistory.sid, sid));
      
      // Ringing Customer -> 3s -> In-Progress
      setTimeout(async () => {
        try {
          await db.update(callHistory).set({ status: 'in-progress' }).where(eq(callHistory.sid, sid));
          
          // In-Progress -> 15s -> Completed
          setTimeout(async () => {
            const durationSec = Math.floor(20 + Math.random() * 40);
            const minutes = Math.floor(durationSec / 60).toString().padStart(2, '0');
            const seconds = (durationSec % 60).toString().padStart(2, '0');
            const durationStr = `${minutes}:${seconds}`;

            try {
              await db.update(callHistory)
                .set({
                  status: 'completed',
                  duration: durationStr,
                  recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
                })
                .where(eq(callHistory.sid, sid));
              console.log(`[SOS Mock] Single SOS Call ${sid} completed.`);
            } catch (err) {
              console.error(err);
            }
          }, 15000);

        } catch (err) {
          console.error(err);
        }
      }, 3000);

    } catch (err) {
      console.error(err);
    }
  }, 2000);
}
