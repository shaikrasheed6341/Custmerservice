import React, { useState, useEffect } from "react";
import { Phone, AlertTriangle, Shield, CheckCircle2, User, PhoneCall, Wifi, BatteryMedium, Signal } from "lucide-react";

const API_BASE_URL = 'http://localhost:5000/api';

export default function CustomerSOS() {
  const [customerName, setCustomerName] = useState("Shaik Rasheed");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
  const [isCalling, setIsCalling] = useState(false);
  const [callSid, setCallSid] = useState(null);
  const [callStatus, setCallStatus] = useState(null);
  const [callTimer, setCallTimer] = useState(0);

  // Status progression tracking
  useEffect(() => {
    if (!callSid) return;

    let intervalId;

    const checkCallStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/calls/${callSid}`);
        if (response.ok) {
          const res = await response.json();
          if (res.success && res.data) {
            setCallStatus(res.data.status);
            
            // If call completed, stop checking status
            if (res.data.status === 'completed') {
              setIsCalling(false);
              clearInterval(intervalId);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching call status:", err.message);
      }
    };

    // Initial check
    checkCallStatus();

    // Poll status every 1.5 seconds
    intervalId = setInterval(checkCallStatus, 1500);

    return () => clearInterval(intervalId);
  }, [callSid]);

  // Call timer effect
  useEffect(() => {
    let timerId;
    if (isCalling && callStatus === 'in-progress') {
      timerId = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(timerId);
  }, [isCalling, callStatus]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleTriggerSOS = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsCalling(true);
    setCallStatus('connecting');

    try {
      const response = await fetch(`${API_BASE_URL}/sos/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerNumber: customerPhone,
          agentName: 'Rahul' // Routing automatically
        })
      });

      if (response.ok) {
        const res = await response.json();
        if (res.success && res.data) {
          setCallSid(res.data.sid);
          setCallStatus(res.data.status);
        } else {
          setCallStatus('failed');
        }
      } else {
        setCallStatus('failed');
      }
    } catch (err) {
      console.error(err);
      setCallStatus('failed');
    }
  };

  const resetSOS = () => {
    setIsCalling(false);
    setCallSid(null);
    setCallStatus(null);
    setCallTimer(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900">Customer SOS Sandbox Portal</h2>
        <p className="text-xs text-slate-500 font-semibold max-w-md">
          Use this device simulator to test the end-to-end distress caller flow in real time. Watch how the dispatcher dashboard reacts to your emergency call.
        </p>
      </div>

      {/* Phone container */}
      <div className="relative w-80 h-[580px] bg-slate-950 rounded-[40px] border-[10px] border-slate-900 shadow-2xl overflow-hidden flex flex-col ring-4 ring-slate-800/40">
        
        {/* Notch / Speaker */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center gap-1.5 px-3">
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
          <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
        </div>

        {/* Status bar */}
        <div className="px-6 pt-7 pb-2 text-[10px] text-white flex justify-between items-center font-bold z-40 select-none bg-slate-950">
          <span>9:41 AM</span>
          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Dynamic screen views */}
        <div className="flex-1 bg-slate-900 p-5 flex flex-col justify-between overflow-y-auto text-white select-none">
          
          {/* VIEW 1: Ready to Call Form */}
          {!isCalling && callStatus !== 'completed' && (
            <div className="flex-1 flex flex-col justify-between pt-4">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-red-950/40 text-red-500 border border-red-900/50 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-300">SuperHeroo Safety</h3>
                  <p className="text-[10px] text-slate-400">Emergency support service active 24/7</p>
                </div>

                <form className="space-y-3.5 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-950/70 border border-slate-800 hover:border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl py-2.5 px-3 pl-9 text-xs text-white transition-all outline-none font-medium"
                        placeholder="Enter your name"
                      />
                      <User className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-slate-950/70 border border-slate-800 hover:border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl py-2.5 px-3 pl-9 text-xs text-white transition-all outline-none font-medium"
                        placeholder="Enter phone number"
                      />
                      <Phone className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                </form>
              </div>

              {/* Massive SOS Button */}
              <div className="flex flex-col items-center pb-4">
                <button
                  onClick={handleTriggerSOS}
                  className="w-28 h-28 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-650/40 border-[6px] border-slate-800 hover:border-slate-700 transition-all cursor-pointer select-none active:scale-95 group relative"
                >
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25 group-hover:opacity-40" />
                  <AlertTriangle className="w-10 h-10 animate-pulse" />
                </button>
                <span className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest mt-3.5 animate-pulse">
                  Press for Emergency Assistance
                </span>
              </div>
            </div>
          )}

          {/* VIEW 2: Active SOS Call Screen */}
          {isCalling && (
            <div className="flex-1 flex flex-col justify-between pt-6 text-center">
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-950/40 text-red-500 border border-red-900/50 flex items-center justify-center animate-pulse">
                    <PhoneCall className="w-7 h-7" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-extrabold text-red-500 uppercase tracking-widest">
                    SOS CALL ACTIVE
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">{customerName} ({customerPhone})</p>
                </div>

                {/* Simulated Waveform */}
                <div className="flex justify-center items-end gap-1 h-12 py-3 overflow-hidden">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-red-500 rounded-full animate-voice-wave"
                      style={{ 
                        animationDelay: `${i * 0.1}s`,
                        height: `${Math.floor(Math.random() * 24) + 12}px`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Status details based on active state */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl mx-1 text-center space-y-1.5 shadow-md">
                <span className="text-[9px] font-extrabold bg-slate-900 border border-slate-800 text-slate-400 py-0.5 px-2 rounded-full uppercase tracking-wider">
                  Call Status
                </span>
                
                {callStatus === 'connecting' && (
                  <p className="text-xs text-slate-300 font-bold">Initiating distress line...</p>
                )}
                {callStatus === 'ringing-agent' && (
                  <p className="text-xs text-amber-500 font-bold animate-pulse">Dialing Superhero Dispatcher...</p>
                )}
                {callStatus === 'ringing-customer' && (
                  <p className="text-xs text-orange-500 font-bold animate-pulse">Calling Your Phone Number...</p>
                )}
                {callStatus === 'in-progress' && (
                  <div className="space-y-1">
                    <p className="text-xs text-emerald-500 font-extrabold">Connected to Dispatch Agent</p>
                    <p className="text-[10px] text-slate-400">Distress Location Tagged. Help is on the way!</p>
                  </div>
                )}
                {callStatus === 'failed' && (
                  <p className="text-xs text-red-500 font-bold">API Connection Timeout</p>
                )}

                {callStatus === 'in-progress' && (
                  <div className="text-lg font-mono font-bold text-slate-200 mt-1">
                    {formatTimer(callTimer)}
                  </div>
                )}
              </div>

              <div className="pb-4">
                <button
                  onClick={resetSOS}
                  className="w-full bg-red-650 hover:bg-red-750 text-white rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer uppercase tracking-wider shadow-md"
                >
                  Cancel / End Call
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: Seeding / Complete Call Report */}
          {!isCalling && callStatus === 'completed' && (
            <div className="flex-1 flex flex-col justify-between pt-6 text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/40 text-emerald-500 border border-emerald-900/50 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-emerald-500 uppercase tracking-widest">
                    EMERGENCY RESOLVED
                  </h3>
                  <p className="text-xs text-slate-400">Your call has ended and dispatch log created.</p>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-left text-xs text-slate-400 space-y-2">
                  <p><strong>Name:</strong> {customerName}</p>
                  <p><strong>Target:</strong> Emergency Dispatcher</p>
                  <p><strong>Status:</strong> Dispatched Log Registered</p>
                  <p className="text-[10px] text-slate-500 font-medium">Recording is archived on the supervisor dashboard feed.</p>
                </div>
              </div>

              <div className="pb-4">
                <button
                  onClick={resetSOS}
                  className="w-full bg-slate-950 border border-slate-800 hover:bg-slate-900 text-white rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer uppercase tracking-wider"
                >
                  Back to SOS Screen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Home swipe indicator */}
        <div className="pb-2 bg-slate-900 flex justify-center w-full">
          <div className="w-28 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
