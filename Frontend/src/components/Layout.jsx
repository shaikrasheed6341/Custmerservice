import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  LayoutDashboard,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  History,
  Users,
  CalendarDays,
  Award,
  HardHat,
  Ticket,
  MessageSquare,
  Mail,
  BarChart3,
  ShieldAlert,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Volume2,
  Bell
} from "lucide-react";

export default function Layout({ children }) {
  const {
    currentView,
    setCurrentView,
    activeUser,
    logout,
    activeCall,
    triggerIncomingCall
  } = useContext(AppContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!activeUser) return <>{children}</>;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "live-calls", label: "Live Calls", icon: PhoneCall },
    { id: "incoming-calls", label: "Incoming Calls", icon: PhoneIncoming, badge: activeCall ? "Active" : null },
    { id: "outgoing-calls", label: "Outgoing Calls", icon: PhoneOutgoing },
    { id: "call-history", label: "Call History", icon: History },
    { id: "customers", label: "Customers", icon: Users },
    { id: "bookings", label: "Bookings", icon: CalendarDays },
    { id: "mediators", label: "Mediators", icon: Award },
    { id: "workers", label: "Workers", icon: HardHat },
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
    { id: "sms", label: "SMS", icon: MessageSquare },
    { id: "email", label: "Email", icon: Mail },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "agents", label: "Agents", icon: ShieldAlert },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  return (
    <div className="flex h-screen bg-violet-50/40 text-slate-900 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-violet-100 dark:bg-violet-100 text-slate-900 border-r border-violet-200/60 h-full transition-all duration-300">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-violet-200/60">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500 text-white font-bold text-lg shadow-lg shadow-violet-500/25">
            S
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none text-slate-950 tracking-wide">SUPERHEROOO</h1>
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Call Center</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-violet-400 text-slate-950 font-bold shadow-md shadow-violet-400/25"
                    : "text-slate-700 hover:text-black hover:bg-violet-200/50 dark:text-slate-700 dark:hover:text-black dark:hover:bg-violet-200/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "text-slate-950" : "text-slate-600 group-hover:scale-110"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    item.badge === "Active" ? "bg-rose-500 text-white animate-pulse" : "bg-violet-200 text-violet-800"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-violet-200/60">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-100/30 rounded-xl transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile Toggle Menu */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/60 backdrop-blur-sm">
          <aside className="w-64 bg-violet-100 dark:bg-violet-100 text-slate-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-violet-200/65">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500 text-white font-bold">
                  S
                </div>
                <span className="font-extrabold text-sm text-slate-950">SUPERHEROOO</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-600 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-violet-400 text-slate-950 font-bold shadow-md"
                        : "text-slate-700 hover:text-black hover:bg-violet-200/50 dark:text-slate-700 dark:hover:text-black dark:hover:bg-violet-200/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-slate-600" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        item.badge === "Active" ? "bg-rose-500 text-white animate-pulse" : "bg-violet-200 text-violet-850"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-violet-200/65">
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-100/30 rounded-xl"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="bg-violet-100/90 backdrop-blur-md border-b border-violet-200/60 px-6 py-4 flex items-center justify-between gap-4 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-violet-200/50"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex flex-col">
              <h2 className="text-xl font-extrabold text-slate-950 capitalize tracking-tight">
                {currentView.replace("-", " ")}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">Superhero CRM & Dial Panel Dashboard</p>
            </div>
          </div>

          {/* Center Call Alert Indicator */}
          {activeCall && (
            <button
              onClick={() => setCurrentView("incoming-calls")}
              className="flex items-center gap-3 px-4 py-2 border border-rose-200 bg-rose-50 text-rose-600 rounded-full animate-pulse-slow shadow-md hover:shadow-lg shadow-rose-100 transition-all cursor-pointer"
            >
              <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              <span className="text-xs font-bold tracking-wide">
                ACTIVE INCOMING CALL: {activeCall.customerName}
              </span>
            </button>
          )}

          {/* Top Actions */}
          <div className="flex items-center gap-4">
            {/* Simulation Trigger */}
            <button
              onClick={() => {
                const clients = ["ABC Builders", "XYZ Infra", "Home Owner"];
                const randomClient = clients[Math.floor(Math.random() * clients.length)];
                triggerIncomingCall(randomClient);
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-violet-700 hover:text-white hover:bg-violet-600 border border-violet-200/60 transition-all duration-200 shadow-sm cursor-pointer hover:scale-[1.02]"
            >
              <Bell className="w-4 h-4 animate-bounce" />
              <span>Simulate Call</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-violet-200/60">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-sm font-extrabold text-slate-950 leading-tight">{activeUser.name}</span>
                <span className="text-[10px] text-violet-600 font-bold uppercase tracking-wider">{activeUser.role}</span>
              </div>
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-violet-500/20 shadow-md shadow-violet-100"
              />
            </div>
          </div>
        </header>

        {/* Content Render */}
        <main className="flex-1 overflow-y-auto relative p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
