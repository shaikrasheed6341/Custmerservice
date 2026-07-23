import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Award, CheckCircle, MapPin, Users, HelpCircle } from "lucide-react";

export default function MediatorAssignment() {
  const {
    bookings,
    pendingBookingId,
    setPendingBookingId,
    assignMediator,
    mediators,
    setCurrentView
  } = useContext(AppContext);

  // Selected mediator name
  const [selectedMediator, setSelectedMediator] = useState("");

  // Determine which booking we are assigning for.
  // If there's a pendingBookingId in context, use that. Otherwise, check if there's any pending booking in the list.
  const activePendingBooking = bookings.find(b => b.id === pendingBookingId) || 
                               bookings.find(b => b.status === "Pending");

  useEffect(() => {
    // Select first available mediator by default
    if (mediators.length > 0) {
      setSelectedMediator(mediators[0].name);
    }
    // Update pendingBookingId in context if we auto-picked one from list
    if (activePendingBooking && !pendingBookingId) {
      setPendingBookingId(activePendingBooking.id);
    }
  }, [activePendingBooking, pendingBookingId]);

  if (!activePendingBooking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-lg">No Pending Mediator Assignments</h3>
          <p className="text-sm text-slate-400 max-w-sm mt-1">
            All bookings currently have assigned mediators. You can create a new booking to test this dispatcher flow!
          </p>
        </div>
      </div>
    );
  }

  const handleAssign = () => {
    if (!selectedMediator) {
      alert("Please select a mediator first.");
      return;
    }
    assignMediator(selectedMediator);
    alert(`Mediator ${selectedMediator} assigned to Booking ${activePendingBooking.id} successfully!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Overview booking grid */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-100 dark:border-slate-900">
          <h3 className="font-bold text-slate-800 dark:text-white">Active Dispatch Requirement</h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-900/60 text-sm">
          <div className="grid grid-cols-2 p-4">
            <span className="text-slate-400 font-medium">Booking #</span>
            <span className="font-mono font-extrabold text-indigo-600">{activePendingBooking.id}</span>
          </div>
          <div className="grid grid-cols-2 p-4">
            <span className="text-slate-400 font-medium">Workers Required</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{activePendingBooking.workers} Workers</span>
            </span>
          </div>
          <div className="grid grid-cols-2 p-4">
            <span className="text-slate-400 font-medium">Location</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{activePendingBooking.location}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Available mediators checklist panel */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-900 pb-3 flex justify-between items-center">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Available Mediators
          </span>
          <span className="text-xs text-slate-400 font-semibold">Ordered by nearest proximity</span>
        </div>

        {/* Check List selectors */}
        <div className="space-y-3">
          {mediators.map((med, idx) => {
            const isChecked = selectedMediator === med.name;
            return (
              <div
                key={idx}
                onClick={() => setSelectedMediator(med.name)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isChecked
                    ? "border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/10"
                    : "border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 hover:border-slate-200 dark:hover:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Styled radio circle */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isChecked ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 dark:border-slate-700"
                  }`}>
                    {isChecked && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                      {med.name} Representative
                    </h4>
                    <p className="text-xs text-slate-400">Rating: ★ {med.rating}</p>
                  </div>
                </div>
                
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-950 py-1 px-3 rounded-lg">
                  {med.distance} Away
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch Action bar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm">
        <button
          onClick={() => setCurrentView("bookings")}
          className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 rounded-xl text-xs font-semibold cursor-pointer"
        >
          Cancel Assignment
        </button>

        <button
          onClick={handleAssign}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 hover:scale-[1.02] active:scale-[0.98]"
        >
          <CheckCircle className="w-4.5 h-4.5" />
          <span>Assign Mediator</span>
        </button>
      </div>

    </div>
  );
}
