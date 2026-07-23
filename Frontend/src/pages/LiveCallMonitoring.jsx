import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Radio, Headphones, Mic, Volume2, UserCheck, X } from "lucide-react";

export default function LiveCallMonitoring() {
  const { liveCalls, activeCall: incomingCall, setCurrentView } = useContext(AppContext);

  // Active channel status
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [monitorMode, setMonitorMode] = useState(null); // 'Listen', 'Whisper', 'Join'

  const activeCall = liveCalls.find((c) => c.id === activeChannelId);

  const startMonitoring = (callId, mode) => {
    setActiveChannelId(callId);
    setMonitorMode(mode);
  };

  const stopMonitoring = () => {
    setActiveChannelId(null);
    setMonitorMode(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Active Monitoring HUD Bridge Overlay */}
      {activeCall && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 flex items-center justify-center animate-pulse">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold tracking-wide uppercase text-sm text-indigo-400">
                Supervisor Live Bridge Connected
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {monitorMode === "Listen" && `Silently listening to Agent ${activeCall.agent} <-> Customer ${activeCall.customer}`}
                {monitorMode === "Whisper" && `Whispering instructions exclusively to Agent ${activeCall.agent}`}
                {monitorMode === "Join" && `Three-way conference call: Joined with Agent ${activeCall.agent} & Customer ${activeCall.customer}`}
              </p>
            </div>
          </div>

          {/* Animated voice wave visualizer */}
          <div className="flex items-center gap-3">
            <div className="flex items-end justify-center gap-1.5 h-10 w-24 overflow-hidden border-r border-slate-800 pr-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-indigo-400 rounded-t-full animate-voice-wave"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>

            <button
              onClick={stopMonitoring}
              className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}

      {/* Monitoring Logs Table Container (Screen 9 design) */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="font-bold text-slate-950">
              Active Dispatcher Channels ({liveCalls.length + (incomingCall ? 1 : 0)} Going On)
            </h3>
          </div>
          <span className="text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 py-1 px-3 border border-rose-100 dark:border-rose-950 rounded-full uppercase tracking-wider animate-pulse">
            Live Feed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-900 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Agent</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6 text-right">Monitoring Mode Bridge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900/60 font-medium">
              {incomingCall && (
                <tr className="bg-rose-50/40 animate-pulse text-rose-950 font-bold border-l-4 border-rose-500">
                  <td className="py-4 px-6 text-rose-600 font-extrabold flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span>Incoming Pop</span>
                  </td>
                  <td className="py-4 px-6 text-rose-900">{incomingCall.customerName}</td>
                  <td className="py-4 px-6 text-rose-500">Ringing...</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setCurrentView("incoming-calls")}
                      className="px-4.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-rose-500/10"
                    >
                      Answer / Screen Pop
                    </button>
                  </td>
                </tr>
              )}
              {liveCalls.map((call) => {
                const isActive = activeChannelId === call.id;
                return (
                  <tr
                    key={call.id}
                    className={`transition-colors duration-200 ${
                      isActive ? "bg-slate-50 dark:bg-slate-900/35" : "hover:bg-slate-50/50 dark:hover:bg-slate-900/20"
                    }`}
                  >
                    {/* Agent details */}
                    <td className="py-4 px-6 text-slate-900 dark:text-white font-bold flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full bg-emerald-500 ${isActive ? "animate-ping" : ""}`} />
                      <span>{call.agent}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                      {call.customer}
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-6 text-slate-500 font-mono font-bold">
                      {call.duration}
                    </td>

                    {/* Bridge Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex gap-2 justify-end">
                        {/* Listen */}
                        <button
                          onClick={() => startMonitoring(call.id, "Listen")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            isActive && monitorMode === "Listen"
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <Headphones className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>

                        {/* Whisper */}
                        <button
                          onClick={() => startMonitoring(call.id, "Whisper")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            isActive && monitorMode === "Whisper"
                              ? "bg-blue-600 border-blue-600 text-white shadow-md"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span>Whisper</span>
                        </button>

                        {/* Join */}
                        <button
                          onClick={() => startMonitoring(call.id, "Join")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            isActive && monitorMode === "Join"
                              ? "bg-violet-600 border-violet-600 text-white shadow-md"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Join</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
