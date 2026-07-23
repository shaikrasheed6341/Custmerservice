import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  User,
  Phone,
  MessageSquare,
  Mail,
  Edit2,
  Save,
  CheckCircle,
  FileText,
  CreditCard,
  Star,
  BookOpen
} from "lucide-react";

export default function CRM() {
  const { crmRecords, updateCRMRecord, triggerIncomingCall } = useContext(AppContext);
  const [selectedRecordId, setSelectedRecordId] = useState(crmRecords[0]?.id);
  const [isEditing, setIsEditing] = useState(false);

  // Active tab inside related records
  const [activeTab, setActiveTab] = useState("bookings");

  // Local form editing states
  const [formData, setFormData] = useState(null);

  const selectedRecord = crmRecords.find((r) => r.id === selectedRecordId) || crmRecords[0];

  const handleSelectRecord = (id) => {
    setSelectedRecordId(id);
    setIsEditing(false);
    setFormData(null);
  };

  const startEditing = () => {
    setFormData({ ...selectedRecord });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateCRMRecord(formData);
    setIsEditing(false);
    setFormData(null);
    alert("Customer details updated successfully!");
  };

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  // Mock CRM relative contents based on active tab
  const getTabContent = () => {
    switch (activeTab) {
      case "bookings":
        return (
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <div className="flex-1">
                <h4 className="text-sm font-bold">Booking #SH-1024</h4>
                <p className="text-xs text-slate-400">Assigned Ramesh (Mediator) • 25 Workers</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 py-1 px-2.5 rounded-full">Assigned</span>
            </div>
            {selectedRecord.previousBookingsCount > 1 && (
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 text-xs text-slate-400 font-medium">
                + {selectedRecord.previousBookingsCount - 1} more bookings processed in past 90 days.
              </div>
            )}
          </div>
        );
      case "invoices":
        return (
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10">
              <FileText className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <h4 className="text-sm font-bold">Invoice #INV-2026-001</h4>
                <p className="text-xs text-slate-400">Due: July 30, 2026 • Amount: ₹25,500</p>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-400 py-1 px-2.5 rounded-full">Sent</span>
            </div>
          </div>
        );
      case "payments":
        return (
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10">
              <CreditCard className="w-5 h-5 text-indigo-500" />
              <div className="flex-1">
                <h4 className="text-sm font-bold">Outstanding Balance</h4>
                <p className="text-xs text-slate-400">Pending payment reconciliation</p>
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">₹{selectedRecord.outstandingAmount}</span>
            </div>
          </div>
        );
      case "feedback":
        return (
          <div className="p-5 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col items-center text-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-sm font-bold">"Excellent service and dispatcher support."</p>
            <span className="text-xs text-slate-400">Average customer rating: 5.0 Stars</span>
          </div>
        );
      case "notes":
        return (
          <div className="space-y-3.5">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 text-sm italic text-slate-600 dark:text-slate-400">
              "{selectedRecord.notes || "No dispatcher notes logged."}"
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: "bookings", label: "Previous Bookings", icon: CheckCircle },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "feedback", label: "Feedback", icon: Star },
    { id: "notes", label: "Notes", icon: BookOpen }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* CRM Customer Picker header */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Profile</label>
          <div className="flex gap-2">
            {crmRecords.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelectRecord(r.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRecordId === r.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Customer Information (Screen 5 Layout) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Customer Information
            </span>
          </div>

          <div className="space-y-3.5 text-sm">
            {/* Name */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-slate-400 font-semibold">Name</span>
              <div className="col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none"
                  />
                ) : (
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.name}</span>
                )}
              </div>
            </div>

            {/* Company */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-slate-400 font-semibold">Company</span>
              <div className="col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none"
                  />
                ) : (
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedRecord.company}</span>
                )}
              </div>
            </div>

            {/* GST */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-slate-400 font-semibold">GST</span>
              <div className="col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.gst}
                    onChange={(e) => handleInputChange("gst", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none"
                  />
                ) : (
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{selectedRecord.gst}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-slate-400 font-semibold">Email</span>
              <div className="col-span-2">
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none"
                  />
                ) : (
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">{selectedRecord.email}</span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-slate-400 font-semibold">Phone</span>
              <div className="col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none"
                  />
                ) : (
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-semibold">{selectedRecord.phone}</span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-slate-400 font-semibold">Address</span>
              <div className="col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none"
                  />
                ) : (
                  <span className="text-slate-700 dark:text-slate-300">{selectedRecord.address}</span>
                )}
              </div>
            </div>

            {/* City */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-slate-400 font-semibold">City</span>
              <div className="col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none"
                  />
                ) : (
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedRecord.city}</span>
                )}
              </div>
            </div>

            {/* State */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-slate-400 font-semibold">State</span>
              <div className="col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none"
                  />
                ) : (
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedRecord.state}</span>
                )}
              </div>
            </div>

            {/* Preferred Language */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-slate-400 font-semibold">Preferred Language</span>
              <div className="col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.preferredLanguage}
                    onChange={(e) => handleInputChange("preferredLanguage", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none"
                  />
                ) : (
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedRecord.preferredLanguage}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Related Records (Screen 5 Layout) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
              <span className="px-3 py-1 bg-violet-50 text-violet-700 dark:bg-violet-950/20 dark:text-violet-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Related Records
              </span>
            </div>

            {/* Selector tabs */}
            <div className="flex flex-wrap gap-1.5">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/50 text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab content panel */}
            <div className="min-h-[160px] pt-2">
              {getTabContent()}
            </div>
          </div>
        </div>

      </div>

      {/* CRM CTA buttons block */}
      <div className="flex flex-wrap gap-3 items-center justify-end p-4 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        ) : (
          <button
            onClick={startEditing}
            className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit CRM Record</span>
          </button>
        )}

        <button
          onClick={() => triggerIncomingCall(selectedRecord.name)}
          className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <Phone className="w-4 h-4" />
          <span>Call Client</span>
        </button>

        <button
          onClick={() => alert(`Simulated: WhatsApp chat initialized with ${selectedRecord.name} (+91 XXXXX XXXXX)`)}
          className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <span>WhatsApp Chat</span>
        </button>

        <button
          onClick={() => alert(`Simulated: Email composer opened for ${selectedRecord.email}`)}
          className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <Mail className="w-4 h-4 text-violet-500" />
          <span>Send Email</span>
        </button>
      </div>

    </div>
  );
}
