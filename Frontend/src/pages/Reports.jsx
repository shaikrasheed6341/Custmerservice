import React, { useState } from "react";
import { BarChart3, TrendingUp, Calendar, ArrowUpRight, Volume2, Award, Clock } from "lucide-react";

export default function Reports() {
  const [dateRange, setDateRange] = useState("This Week");
  const [activeMetricTab, setActiveMetricTab] = useState("Calls");

  const metricTabs = [
    { name: "Calls", count: "158", rate: "+12%" },
    { name: "Answered", count: "132", rate: "+8%" },
    { name: "Missed", count: "14", rate: "-3%" },
    { name: "Avg Duration", count: "04:12", rate: "+4s" },
    { name: "Bookings", count: "25", rate: "+15%" },
    { name: "Revenue", count: "₹2.3L", rate: "+22%" },
    { name: "Rating", count: "4.8", rate: "+0.1" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Date Range selectors (Screen 10 layout) */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-bold text-slate-800 dark:text-white">Reporting Interval</span>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none"
        >
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="Custom Range">Custom Range...</option>
        </select>
      </div>

      {/* Stats Category tabs (Screen 10 metric buttons row) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {metricTabs.map((tab) => {
          const isActive = activeMetricTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveMetricTab(tab.name)}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/15 scale-[1.03]"
                  : "bg-white dark:bg-slate-950 border-slate-200/50 dark:border-slate-800/40 text-slate-600 hover:border-slate-300"
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-indigo-100" : "text-slate-400"}`}>
                {tab.name}
              </span>
              <div className="mt-2.5 flex items-baseline justify-between w-full">
                <span className={`text-base font-extrabold font-sans leading-none ${isActive ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  {tab.count}
                </span>
                <span className={`text-[9px] font-bold py-0.5 px-1.5 rounded ${
                  isActive ? "bg-indigo-500/50 text-indigo-50" : 
                  tab.rate.startsWith("+") ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                }`}>
                  {tab.rate}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SVG Charts section layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Calls SVG area chart */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Daily Calls Volume</h4>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/20 py-0.5 px-2 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>12% Growth</span>
            </span>
          </div>
          
          {/* SVG Area Chart */}
          <div className="relative h-48 w-full flex items-center justify-center pt-2">
            <svg className="w-full h-full" viewBox="0 0 400 150">
              <defs>
                <linearGradient id="calls-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
              
              {/* Path Area */}
              <path
                d="M 0 140 Q 50 80 100 110 T 200 40 T 300 90 T 400 30 L 400 150 L 0 150 Z"
                fill="url(#calls-grad)"
              />
              {/* Path Line */}
              <path
                d="M 0 140 Q 50 80 100 110 T 200 40 T 300 90 T 400 30"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Dots */}
              <circle cx="200" cy="40" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
              <circle cx="400" cy="30" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-slate-400 font-bold uppercase">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Bookings SVG bar chart */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Bookings & Dispatches</h4>
            <span className="text-[10px] text-slate-400 font-semibold">Weekly aggregate</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="relative h-48 w-full flex items-center justify-center pt-2">
            <svg className="w-full h-full" viewBox="0 0 400 150">
              {/* Bar grids */}
              {/* Mon */}
              <rect x="30" y="60" width="18" height="90" rx="4" fill="#a855f7" opacity="0.85" />
              {/* Tue */}
              <rect x="90" y="85" width="18" height="65" rx="4" fill="#6366f1" opacity="0.85" />
              {/* Wed */}
              <rect x="150" y="40" width="18" height="110" rx="4" fill="#a855f7" opacity="0.85" />
              {/* Thu */}
              <rect x="210" y="100" width="18" height="50" rx="4" fill="#6366f1" opacity="0.85" />
              {/* Fri */}
              <rect x="270" y="30" width="18" height="120" rx="4" fill="#a855f7" opacity="0.85" />
              {/* Sat */}
              <rect x="330" y="115" width="18" height="35" rx="4" fill="#6366f1" opacity="0.85" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4 text-[10px] text-slate-400 font-bold uppercase">
              <span>ABC Bldrs</span>
              <span>XYZ Infra</span>
              <span>Gachibowli</span>
              <span>Kondapur</span>
              <span>Madhapur</span>
              <span>Others</span>
            </div>
          </div>
        </div>

        {/* Call Status donut chart */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Call Status Ratios</h4>
            <span className="text-[10px] text-slate-400 font-semibold">Today's logs</span>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-4">
            {/* SVG Donut */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                {/* Segment 1: Answered (80%) */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="80 20" strokeDashoffset="0" />
                {/* Segment 2: Missed (15%) */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="-80" strokeLinecap="round" />
                {/* Segment 3: Abandoned (5%) */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#eab308" strokeWidth="3" strokeDasharray="5 95" strokeDashoffset="-95" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold text-slate-950 dark:text-white leading-none">158</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Calls</span>
              </div>
            </div>
            {/* Legend details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Answered Calls (80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Missed Calls (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Abandoned Calls (5%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Performance line chart */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Agent Dispatch Productivity</h4>
            <span className="text-[10px] text-slate-400 font-semibold">Average rating: 4.8</span>
          </div>

          <div className="relative h-48 w-full flex items-center justify-center pt-2">
            <svg className="w-full h-full" viewBox="0 0 400 150">
              {/* Radar Grid circle placeholders */}
              <circle cx="200" cy="75" r="60" fill="none" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <circle cx="200" cy="75" r="40" fill="none" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <circle cx="200" cy="75" r="20" fill="none" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              
              {/* Radar Web polygon */}
              <polygon
                points="200,25 250,55 240,110 160,110 150,55"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
              />
              <polygon
                points="200,25 250,55 240,110 160,110 150,55"
                fill="#6366f1"
                fillOpacity="0.15"
              />
            </svg>
            <div className="absolute inset-0 flex justify-between items-between p-4 pointer-events-none text-[9px] text-slate-400 font-extrabold uppercase">
              <span className="absolute top-2 left-1/2 -translate-x-1/2">Speed</span>
              <span className="absolute bottom-2 left-6">Dispatch Rate</span>
              <span className="absolute bottom-2 right-6">Accuracy</span>
              <span className="absolute top-1/2 right-2 -translate-y-1/2">CSAT</span>
              <span className="absolute top-1/2 left-2 -translate-y-1/2">Tone</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
