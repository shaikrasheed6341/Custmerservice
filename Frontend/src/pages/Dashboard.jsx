import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  Phone,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  CircleDollarSign,
  Play,
  User,
  Radio,
  ExternalLink
} from "lucide-react";

export default function Dashboard() {
  const {
    stats,
    bookings,
    agents,
    liveCalls,
    activeCall,
    setCurrentView,
    setPendingBookingId,
    triggerIncomingCall
  } = useContext(AppContext);

  const statCards = [
    { 
      label: "CALLS", 
      value: stats.calls, 
      icon: Phone, 
      iconBg: "bg-indigo-100/60 text-indigo-600 border border-indigo-200/20", 
      cardBg: "bg-white border border-slate-100" 
    },
    { 
      label: "WAITING", 
      value: stats.waiting, 
      icon: Clock, 
      iconBg: "bg-rose-100/60 text-rose-500 border border-rose-200/20", 
      cardBg: "bg-white border border-slate-100" 
    },
    { 
      label: "ANSWERED", 
      value: stats.answered, 
      icon: CheckCircle, 
      iconBg: "bg-emerald-100/60 text-emerald-600 border border-emerald-200/20", 
      cardBg: "bg-white border border-slate-100" 
    },
    { 
      label: "MISSED", 
      value: stats.missed, 
      icon: AlertTriangle, 
      iconBg: "bg-amber-100/60 text-amber-500 border border-amber-200/20", 
      cardBg: "bg-white border border-slate-100" 
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-[24px] bg-white border border-slate-100/80 shadow-sm flex flex-col justify-between h-36 group transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-xs font-extrabold text-slate-500 tracking-wider uppercase">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-black text-slate-950 tracking-tight leading-none">
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle section with Live Calls and Agent Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Live Calls (Screen 2 Left Panel) */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <h3 className="font-bold text-base text-slate-950">
                Live Calls ({liveCalls.length + (activeCall ? 1 : 0)})
              </h3>
            </div>
            <button
              onClick={() => setCurrentView("live-calls")}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Supervisor Monitor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 space-y-3.5">
            {/* Show incoming call dynamically if ringing */}
            {activeCall && (
              <div
                onClick={() => setCurrentView("incoming-calls")}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 animate-pulse cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                    In
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-rose-950">
                      Ringing <span className="text-xs text-rose-400 font-medium font-sans">→</span> {activeCall.customerName}
                    </h4>
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Incoming Call Pop Active</p>
                  </div>
                </div>
                
                <span className="text-xs font-mono font-bold text-rose-600 bg-rose-100 py-1 px-2.5 rounded-lg border border-rose-200/50">
                  Ringing...
                </span>
              </div>
            )}

            {liveCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => setCurrentView("live-calls")}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-900/10 dark:hover:bg-slate-900/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                    {call.agent[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                      {call.agent} <span className="text-xs text-slate-400 font-medium font-sans">→</span> {call.customer}
                    </h4>
                    <p className="text-xs text-slate-400">Ongoing line connection</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-900 py-1 px-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                    {call.duration}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom section: Today's Bookings */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-4 mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Today's Bookings</h3>
            <p className="text-xs text-slate-400">Track and dispatch jobs requested by developers and homeowners</p>
          </div>
          <button
            onClick={() => setCurrentView("bookings")}
            className="px-4 py-2 border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-900 text-xs uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Workers Required</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Assigned Mediator</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900/60">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {booking.customer}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                    {booking.location}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 font-mono">
                    {booking.workers}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      booking.status === "Assigned"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                        : "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400 animate-pulse"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {booking.mediator ? (
                      <span className="text-slate-950 font-bold">
                        {booking.mediator} (Mediator)
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold animate-pulse bg-rose-50 border border-rose-100 py-1 px-2.5 rounded-lg text-xs">
                        Awaiting Agent / No Agent Present
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {booking.status === "Pending" ? (
                      <button
                        onClick={() => {
                          setPendingBookingId(booking.id);
                          setCurrentView("mediators"); // Jump directly to Mediator Assignment View
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Assign Mediator
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentView("bookings")}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
