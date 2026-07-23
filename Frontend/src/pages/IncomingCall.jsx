import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { PhoneOff, Save, Calendar, ShieldAlert, PhoneCall } from "lucide-react";

export default function IncomingCall() {
  const {
    activeCall,
    saveCallNotes,
    createBooking,
    createTicket,
    endCall,
    setCurrentView
  } = useContext(AppContext);

  const [notes, setNotes] = useState("");
  const [workersRequired, setWorkersRequired] = useState("");
  const [workType, setWorkType] = useState("Mason");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const [seconds, setSeconds] = useState(3); // Start timer from 3s as shown in wireframe

  useEffect(() => {
    if (!activeCall) return;
    
    // Fill values if call details contain details
    setNotes(activeCall.notes || "");
    setLocation(activeCall.bookingDetails?.location || "");

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCall]);

  if (!activeCall) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400">
          <PhoneCall className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-lg">No Active Incoming Call</h3>
          <p className="text-sm text-slate-400 max-w-sm mt-1">
            Simulate a call using the top right button, or wait for automatic incoming queries.
          </p>
        </div>
      </div>
    );
  }

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSaveNotes = () => {
    saveCallNotes(notes);
    alert("Call notes saved successfully!");
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();
    createBooking({
      customerName: activeCall.customerName,
      location: location || activeCall.location,
      workersRequired,
      workType,
      date,
      time
    });
  };

  const handleCreateTicket = () => {
    // Generate prefilled ticket
    createTicket({
      customer: activeCall.customerName,
      complaint: `Issue reported during call: ${notes || "No details provided"}`,
      priority: "Medium",
      description: `Caller from ${activeCall.location} reported general query. Outstanding balance is ${activeCall.outstandingAmount}.`
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Call Header Indicator (Red style matching wireframe) */}
      <div className="p-4 rounded-xl bg-rose-500 text-white flex justify-between items-center shadow-lg shadow-rose-500/10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          <span className="text-sm font-extrabold tracking-wide uppercase">Incoming Call Screen (Screen Pop)</span>
        </div>
        <span className="text-xl font-mono font-bold tracking-wider">{formatTimer(seconds)}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Customer Card & Notes */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-100 dark:border-slate-900">
              <h3 className="font-bold text-slate-800 dark:text-white">Caller Information</h3>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-900/60 text-sm">
              <div className="grid grid-cols-2 p-4">
                <span className="text-slate-400 font-medium">Customer Name</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeCall.customerName}</span>
              </div>
              <div className="grid grid-cols-2 p-4">
                <span className="text-slate-400 font-medium">Phone Number</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{activeCall.phoneNumber}</span>
              </div>
              <div className="grid grid-cols-2 p-4">
                <span className="text-slate-400 font-medium">Location</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{activeCall.location}</span>
              </div>
              <div className="grid grid-cols-2 p-4">
                <span className="text-slate-400 font-medium">Customer Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{activeCall.type}</span>
              </div>
              <div className="grid grid-cols-2 p-4">
                <span className="text-slate-400 font-medium">Previous Calls</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{activeCall.previousCalls}</span>
              </div>
              <div className="grid grid-cols-2 p-4">
                <span className="text-slate-400 font-medium text-rose-500 dark:text-rose-400">Outstanding</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400 font-mono">₹{activeCall.outstandingAmount.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 p-4">
                <span className="text-slate-400 font-medium">Assigned Mediator</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{activeCall.assignedMediator || "None"}</span>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Call Notes & Summary</label>
            <textarea
              placeholder="Type customer request, preferences or follow up notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Right Column: Booking Details Form */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <form onSubmit={handleCreateBooking} className="space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Booking Details
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Workers Required</label>
              <input
                type="number"
                placeholder="Number of workers required..."
                value={workersRequired}
                onChange={(e) => setWorkersRequired(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Work Type</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Electrician">Electrician</option>
                <option value="Painter">Painter</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Helper">Helper</option>
                <option value="Mason">Mason</option>
                <option value="Driver">Driver</option>
                <option value="Plumber">Plumber</option>
                <option value="Security">Security</option>
                <option value="Cleaner">Cleaner</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</label>
              <input
                type="text"
                placeholder="Dispatch location details..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Hidden Submit for Form trigger */}
            <input type="submit" id="booking-submit-btn" className="hidden" />
          </form>

          {/* Prompt notice */}
          <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 text-xs text-indigo-600 dark:text-indigo-400">
            <strong>Pro Tip:</strong> Click "Create Booking" below to automatically submit this form, assign mediators, and update customer history records.
          </div>
        </div>

      </div>

      {/* Action Buttons Panel */}
      <div className="flex flex-wrap gap-4 items-center justify-end p-4 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl">
        <button
          onClick={handleSaveNotes}
          className="px-5 py-3 border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Notes</span>
        </button>

        <button
          onClick={() => {
            // Trigger booking submit
            document.getElementById("booking-submit-btn").click();
          }}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10"
        >
          <Calendar className="w-4 h-4" />
          <span>Create Booking</span>
        </button>

        <button
          onClick={handleCreateTicket}
          className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Create Ticket</span>
        </button>

        <button
          onClick={endCall}
          className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-rose-600/10 ml-auto"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Call</span>
        </button>
      </div>

    </div>
  );
}
