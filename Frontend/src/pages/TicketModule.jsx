import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Save, AlertCircle, CheckCircle, Clock, Trash, Plus } from "lucide-react";

export default function TicketModule() {
  const { tickets, createTicket, updateTicketStatus, agents } = useContext(AppContext);

  // Active ticket loaded in form. If null, we are in "Create Ticket" mode
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  
  // Form fields states
  const [ticketId, setTicketId] = useState("SH-2026-00233");
  const [customer, setCustomer] = useState("");
  const [complaint, setComplaint] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [assignAgent, setAssignAgent] = useState("Rahul");
  const [status, setStatus] = useState("Open");

  const loadTicketIntoForm = (t) => {
    setSelectedTicketId(t.id);
    setTicketId(t.id);
    setCustomer(t.customer);
    setComplaint(t.complaint);
    setPriority(t.priority);
    setDescription(t.description);
    setAssignAgent(t.agent);
    setStatus(t.status);
  };

  const handleResetForm = () => {
    setSelectedTicketId(null);
    setTicketId(`SH-2026-${Math.floor(10000 + Math.random() * 90000)}`);
    setCustomer("");
    setComplaint("");
    setPriority("Medium");
    setDescription("");
    setAssignAgent("Rahul");
    setStatus("Open");
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedTicketId) {
      // Update status/priority
      updateTicketStatus(selectedTicketId, status);
      // Let's also simulate updating other details in the list
      alert(`Ticket ${selectedTicketId} status updated to ${status}!`);
    } else {
      createTicket({
        customer,
        complaint,
        priority,
        description,
        agent: assignAgent,
        status
      });
      alert("New support ticket created!");
      handleResetForm();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner actions */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">Ticket Registry</h3>
          <p className="text-xs text-slate-400">Dispatch support and resolve complaint tickets.</p>
        </div>
        <button
          onClick={handleResetForm}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form (Screen 8 Design) */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3 gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {selectedTicketId ? "Edit Ticket details" : "Create Complaint Ticket"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Ticket ID:</span>
              <span className="text-xs font-mono font-extrabold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 border border-indigo-100/50 dark:border-indigo-900/30 rounded-lg">
                {ticketId}
              </span>
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</label>
            <input
              type="text"
              placeholder="Enter customer or builder name..."
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
              disabled={!!selectedTicketId}
              className="w-full bg-slate-50 dark:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Complaint summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Complaint</label>
            <input
              type="text"
              placeholder="e.g. Workers did not arrive on scheduled date..."
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              required
              disabled={!!selectedTicketId}
              className="w-full bg-slate-50 dark:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Priority</label>
            <div className="flex flex-wrap gap-2">
              {["Low", "Medium", "High", "Critical"].map((p) => {
                const active = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    disabled={!!selectedTicketId}
                    onClick={() => setPriority(p)}
                    className={`px-4.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      active
                        ? p === "Critical" ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10" :
                          p === "High" ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/10" :
                          p === "Medium" ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10" :
                          "bg-slate-700 border-slate-700 text-white shadow-md"
                        : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
            <textarea
              placeholder="Elaborate support issue notes, timeline details and logs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              disabled={!!selectedTicketId}
              className="w-full bg-slate-50 dark:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Assign agent representative */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assign Agent</label>
            <select
              value={assignAgent}
              onChange={(e) => setAssignAgent(e.target.value)}
              disabled={!!selectedTicketId}
              className="w-full bg-slate-50 dark:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
            >
              {agents.map((a, idx) => (
                <option key={idx} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status buttons */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-900 pt-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</label>
            <div className="flex flex-wrap gap-2">
              {["Open", "In Progress", "Resolved", "Closed"].map((s) => {
                const active = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-4.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      active
                        ? s === "Resolved" ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10" :
                          s === "In Progress" ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10" :
                          s === "Open" ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10" :
                          "bg-slate-600 border-slate-600 text-white shadow-md"
                        : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA actions */}
          <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-900 pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Ticket</span>
            </button>
          </div>
        </form>

        {/* Right Column: Ticket List */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 flex flex-col space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-900 pb-3 flex justify-between items-center">
            <span className="px-3 py-1 bg-violet-50 text-violet-700 dark:bg-violet-950/20 dark:text-violet-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Active Tickets ({tickets.length})
            </span>
          </div>

          {/* Tickets List */}
          <div className="flex-1 space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => loadTicketIntoForm(t)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left space-y-2 group ${
                  selectedTicketId === t.id
                    ? "border-indigo-600 bg-indigo-50/25 dark:bg-indigo-950/10"
                    : "border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-50 hover:border-slate-200 dark:hover:border-slate-800"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-extrabold text-indigo-600">{t.id}</span>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white mt-0.5">{t.customer}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    t.priority === "Critical" ? "bg-rose-100 text-rose-800 border border-rose-200" :
                    t.priority === "High" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                    "bg-indigo-100 text-indigo-800 border border-indigo-200"
                  }`}>
                    {t.priority}
                  </span>
                </div>
                
                <p className="text-xs text-slate-500 truncate">{t.complaint}</p>
                
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900/50 pt-2 text-[10px] text-slate-400 font-semibold">
                  <span>Agent: {t.agent}</span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    t.status === "Resolved" ? "bg-emerald-50 border border-emerald-100 text-emerald-600" :
                    t.status === "In Progress" ? "bg-blue-50 border border-blue-100 text-blue-600 animate-pulse" :
                    "bg-slate-100 border border-slate-200 text-slate-600"
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
