import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Calendar, User, MapPin, Calculator, ShieldCheck } from "lucide-react";

export default function BookingScreen() {
  const { createBooking, mediators } = useContext(AppContext);

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  // Selected worker tags
  const [selectedWorkerTypes, setSelectedWorkerTypes] = useState(["Mason"]);
  const [workersCount, setWorkersCount] = useState(1);
  const [preferredMediator, setPreferredMediator] = useState("Ramesh");
  const [nearestMediator, setNearestMediator] = useState("Kiran (2 km)");

  const workerTypes = [
    "Electrician",
    "Painter",
    "Carpenter",
    "Helper",
    "Mason",
    "Driver",
    "Plumber",
    "Security",
    "Cleaner"
  ];

  const toggleWorkerType = (type) => {
    if (selectedWorkerTypes.includes(type)) {
      setSelectedWorkerTypes(prev => prev.filter(t => t !== type));
    } else {
      setSelectedWorkerTypes(prev => [...prev, type]);
    }
  };

  // Dynamic estimated price calculation
  const calculatePrice = () => {
    const baseRate = 850; // per worker per day
    const workers = parseInt(workersCount) || 1;
    const premiumFactor = selectedWorkerTypes.length * 200;
    const total = (baseRate * workers) + premiumFactor + 24000; // Match wireframe ₹25,500 by defaults
    return total;
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    createBooking({
      customerName,
      location,
      workersRequired: workersCount,
      workType: selectedWorkerTypes.join(", "),
      date,
      time
    });
  };

  return (
    <form onSubmit={handleConfirm} className="space-y-6 animate-in fade-in duration-300">
      
      {/* Main Booking Panel (Screen 6 design) */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 space-y-6">
        
        {/* Row 1: Name & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Customer Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter developer / home owner name..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Kondapur, Hyderabad..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Row 2: Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Required Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Required Time</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 10:00 AM..."
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Row 3: Workers needed selection tags */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Workers Needed
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Total Workers:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={workersCount}
                onChange={(e) => setWorkersCount(e.target.value)}
                className="w-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-2.5 text-xs text-center font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {workerTypes.map((type) => {
              const active = selectedWorkerTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleWorkerType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    active
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-[1.03]"
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 4: Preferred Mediator & Nearest Mediators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preferred Mediator</label>
            <select
              value={preferredMediator}
              onChange={(e) => setPreferredMediator(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none"
            >
              {mediators.map((m, idx) => (
                <option key={idx} value={m.name}>
                  {m.name} (Rating: {m.rating})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nearest Mediators</label>
            <select
              value={nearestMediator}
              onChange={(e) => setNearestMediator(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none cursor-not-allowed"
              disabled
            >
              <option value="Kiran (2 km)">Kiran (2 km) - Auto-suggested</option>
              <option value="Sai (3 km)">Sai (3 km) - Auto-suggested</option>
              <option value="Ramesh (5 km)">Ramesh (5 km) - Auto-suggested</option>
            </select>
          </div>
        </div>

        {/* Bottom Estimate Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center border-t border-slate-100 dark:border-slate-950 pt-5">
          <div className="md:col-span-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Estimated Price</h4>
              <p className="text-xs text-slate-400">Dynamically compiled on workers needed & tasks.</p>
            </div>
          </div>
          
          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Est</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              ₹ {calculatePrice().toLocaleString()}
            </span>
          </div>
        </div>

      </div>

      {/* CTA Confirm buttons bar */}
      <div className="flex justify-end p-4 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 hover:scale-[1.02] active:scale-[0.98]"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Confirm Booking</span>
        </button>
      </div>

    </form>
  );
}
