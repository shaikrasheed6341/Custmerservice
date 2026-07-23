import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Search, Play, Volume2, Calendar, Phone } from "lucide-react";

export default function CallHistory() {
  const { callHistory, setPlayingAudio, playingAudio } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = callHistory.filter((log) => {
    const query = searchQuery.toLowerCase();
    return (
      log.customer.toLowerCase().includes(query) ||
      log.agent.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Search Header Bar (Screen 4 Search layout) */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 flex items-center shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer or agent representative..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        {searchQuery && (
          <span className="text-xs text-slate-400 font-bold ml-4">
            Found {filteredHistory.length} logs
          </span>
        )}
      </div>

      {/* History Table Container */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 border-b border-slate-100 dark:border-slate-900 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Date / Time</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Agent</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6 text-center">Recording</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900/60 font-medium">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((log) => {
                  const isActiveAudio = playingAudio && playingAudio.id === log.id;
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/25 transition-colors"
                    >
                      {/* Time */}
                      <td className="py-4 px-6 text-slate-900 dark:text-white font-bold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span>{log.date}</span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                        {log.customer}
                      </td>

                      {/* Agent */}
                      <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                        {log.agent}
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-6 text-slate-500 font-mono font-bold">
                        {log.duration}
                      </td>

                      {/* Audio Play Trigger */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setPlayingAudio(log)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isActiveAudio
                              ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                              : "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white"
                          }`}
                        >
                          {isActiveAudio ? (
                            <Volume2 className="w-4.5 h-4.5 animate-pulse" />
                          ) : (
                            <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Phone className="w-8 h-8 text-slate-300" />
                      <span>No call history match found.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
