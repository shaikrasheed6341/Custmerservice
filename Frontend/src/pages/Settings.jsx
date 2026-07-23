import React, { useState } from "react";
import {
  Building2,
  Clock,
  PhoneCall,
  Calendar,
  MessageSquareCode,
  MessageSquareShare,
  Mail,
  Users,
  Key,
  Network,
  ChevronDown,
  ChevronUp,
  Save
} from "lucide-react";

export default function Settings() {
  // Expanded item index tracking
  const [expandedIndex, setExpandedIndex] = useState(1); // Default expand Business Hours

  // Mock settings values
  const [businessStart, setBusinessStart] = useState("09:00 AM");
  const [businessEnd, setBusinessEnd] = useState("06:00 PM");
  const [apiKey, setApiKey] = useState("sh_token_live_2563_dialer_representative_sec");
  const [showApiKey, setShowApiKey] = useState(false);

  const settingsList = [
    { id: 0, label: "Company Settings", icon: Building2, desc: "Manage corporate details, brand name, and support phone numbers." },
    { id: 1, label: "Business Hours", icon: Clock, desc: "Configure dispatch hours, timezone offsets, and agent check-in times." },
    { id: 2, label: "IVR Menu", icon: PhoneCall, desc: "Record automated voicemail greetings and configure customer keypress routes." },
    { id: 3, label: "Working Days", icon: Calendar, desc: "Set national holidays, mediator weekends, and operational schedules." },
    { id: 4, label: "SMS Templates", icon: MessageSquareCode, desc: "Pre-write client text messages for dispatch updates and dispatcher status notifications." },
    { id: 5, label: "WhatsApp Templates", icon: MessageSquareShare, desc: "Configure verified templates to send invoice reminders and ratings links." },
    { id: 6, label: "Email Templates", icon: Mail, desc: "Compose default emails for mediator assignment details and payment logs." },
    { id: 7, label: "Roles & Permissions", icon: Users, desc: "Assign administrative levels, supervisor dial privileges, and agent access controls." },
    { id: 8, label: "API Keys", icon: Key, desc: "Generate developer authentication headers to sync external contractor logs." },
    { id: 9, label: "Integrations", icon: Network, desc: "Connect Slack channels, Salesforce pipelines, or HubSpot databases." }
  ];

  const handleToggle = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const handleSaveSettings = (section) => {
    alert(`Settings for ${section} successfully updated and synchronized!`);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {settingsList.map((item) => {
        const Icon = item.icon;
        const isExpanded = expandedIndex === item.id;
        return (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
          >
            {/* Header Accordion clickable (Screen 11 Settings List) */}
            <button
              onClick={() => handleToggle(item.id)}
              className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/10 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/50 dark:border-indigo-950">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-950 dark:text-white">{item.label}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
              
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Expanded panel details */}
            {isExpanded && (
              <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-900/60 pt-4 bg-slate-50/20 dark:bg-slate-900/5 animate-in slide-in-from-top-2 duration-200">
                
                {/* Specific form designs based on item label */}
                {item.label === "Business Hours" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Opening Time</label>
                        <input
                          type="text"
                          value={businessStart}
                          onChange={(e) => setBusinessStart(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Closing Time</label>
                        <input
                          type="text"
                          value={businessEnd}
                          onChange={(e) => setBusinessEnd(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Operating Days</span>
                      <div className="flex gap-2">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                          <div
                            key={idx}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${
                              idx < 5 
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900" 
                                : "bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800"
                            }`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {item.label === "API Keys" && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Secret Token</label>
                    <div className="flex gap-2">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs font-mono focus:outline-none"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                      >
                        {showApiKey ? "Hide" : "Reveal"}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400">WARNING: Do not share secret headers on public logs.</span>
                  </div>
                )}

                {item.label !== "Business Hours" && item.label !== "API Keys" && (
                  <div className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 space-y-2">
                    <p>Configure details for <strong>{item.label}</strong> by filling out the integrated dispatch templates. Fields are auto-synchronized with the superhero central server.</p>
                    <input
                      type="text"
                      placeholder={`Enter default value for ${item.label}...`}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none"
                    />
                  </div>
                )}

                {/* Shared action save button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleSaveSettings(item.label)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save {item.label}</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        );
      })}

    </div>
  );
}
