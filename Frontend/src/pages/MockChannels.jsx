import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  PhoneCall,
  Send,
  MessageSquare,
  Mail,
  Shield,
  Smartphone,
  HardHat,
  Search,
  CheckCheck,
  User,
  Trash
} from "lucide-react";

// ==========================================
// 1. OUTGOING CALLS (Dialer Pad)
// ==========================================
export function OutgoingCallsView() {
  const { triggerIncomingCall } = useContext(AppContext);
  const [dialNum, setDialNum] = useState("");

  const handleDial = (num) => {
    if (dialNum.length < 15) {
      setDialNum(prev => prev + num);
    }
  };

  const handleClear = () => setDialNum("");
  const handleCall = () => {
    if (!dialNum) return;
    alert(`Initiating simulated outbound call to ${dialNum}...`);
    // Simulate connection by triggering incoming pop after 2 seconds
    setTimeout(() => {
      triggerIncomingCall("Home Owner");
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-3xl shadow-sm p-6 space-y-6 animate-in fade-in duration-300">
      <div className="text-center">
        <h3 className="font-bold text-slate-800 dark:text-white">Superhero Dial Pad</h3>
        <p className="text-xs text-slate-400">Place mock outgoing calls to dispatch agents</p>
      </div>

      {/* Screen */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 min-h-[58px] flex items-center justify-between">
        <span className="text-xl font-mono font-bold text-slate-800 dark:text-white tracking-widest">
          {dialNum || "Enter Number..."}
        </span>
        {dialNum && (
          <button onClick={handleClear} className="text-xs font-bold text-rose-500 hover:text-rose-600">
            Clear
          </button>
        )}
      </div>

      {/* Keys */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
          <button
            key={key}
            onClick={() => handleDial(key)}
            className="w-full aspect-square rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200/50 dark:border-slate-800 text-lg font-bold font-mono transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Actions */}
      <button
        onClick={handleCall}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 cursor-pointer transition-transform hover:scale-[1.02]"
      >
        <PhoneCall className="w-5 h-5 fill-current" />
        <span>Place Simulated Call</span>
      </button>
    </div>
  );
}

// ==========================================
// 2. WORKERS DIRECTORY
// ==========================================
export function WorkersView() {
  const [search, setSearch] = useState("");
  const workers = [
    { name: "John Doe", skill: "Electrician", status: "Active", rating: "4.9", phone: "+91 99001 12233" },
    { name: "Sam Wilson", skill: "Painter", status: "On Job", rating: "4.7", phone: "+91 99001 44556" },
    { name: "Bruce Banner", skill: "Mason", status: "Active", rating: "4.8", phone: "+91 99001 77889" },
    { name: "Steve Rogers", skill: "Security", status: "Active", rating: "5.0", phone: "+91 99001 99001" },
    { name: "Tony Stark", skill: "Electrician", status: "On Job", rating: "4.9", phone: "+91 99001 22334" },
    { name: "Natasha Romanoff", skill: "Cleaner", status: "Active", rating: "4.9", phone: "+91 99001 55667" },
    { name: "Thor Odinson", skill: "Helper", status: "Break", rating: "4.5", phone: "+91 99001 88990" },
    { name: "Clint Barton", skill: "Driver", status: "Active", rating: "4.6", phone: "+91 99001 11224" }
  ];

  const filtered = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.skill.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 flex items-center shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by worker name or specialized skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((w, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 py-0.5 px-2 rounded-full">
                  {w.skill}
                </span>
                <h4 className="font-bold text-slate-950 dark:text-white mt-2">{w.name}</h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                w.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                w.status === "On Job" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                "bg-amber-50 text-amber-700 border border-amber-100"
              }`}>
                {w.status}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-xs text-slate-400">
              <span>★ {w.rating} Rating</span>
              <span className="font-mono font-semibold">{w.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. SIMULATED WHATSAPP PANEL
// ==========================================
export function WhatsAppView() {
  const [messages, setMessages] = useState([
    { sender: "client", text: "Hello, has the mason reached Gachibowli site?", time: "10:30 AM" },
    { sender: "you", text: "Yes, Ramesh is on-site and supervising 25 workers.", time: "10:32 AM" },
    { sender: "client", text: "Excellent, thank you for quick dispatch!", time: "10:33 AM" }
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal) return;
    
    const newMsg = {
      sender: "you",
      text: inputVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputVal("");

    // Mock client response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: "client",
          text: "Received! Let us sync on the invoice details tomorrow.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto h-[520px] bg-slate-100 border border-slate-200 dark:bg-slate-950 dark:border-slate-900 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
      {/* WhatsApp Header */}
      <div className="bg-[#075e54] text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold">
          AB
        </div>
        <div>
          <h4 className="text-sm font-bold">ABC Builders</h4>
          <span className="text-[10px] text-emerald-200 font-semibold uppercase animate-pulse">Online</span>
        </div>
      </div>

      {/* Messages Board */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#efeae2] dark:bg-slate-900/40">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] p-3 rounded-2xl text-sm ${
              m.sender === "you"
                ? "bg-[#dcf8c6] text-slate-800 ml-auto rounded-tr-none shadow-sm"
                : "bg-white text-slate-800 rounded-tl-none shadow-sm"
            }`}
          >
            <p>{m.text}</p>
            <span className="text-[9px] text-slate-400 block text-right mt-1.5 font-bold">
              {m.time} {m.sender === "you" && <span className="text-blue-500 font-bold ml-1">✓✓</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 flex gap-2">
        <input
          type="text"
          placeholder="Type a WhatsApp message..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
        />
        <button type="submit" className="w-10 h-10 rounded-xl bg-[#128c7e] hover:bg-[#075e54] text-white flex items-center justify-center transition-colors cursor-pointer">
          <Send className="w-4 h-4 fill-current" />
        </button>
      </form>
    </div>
  );
}

// ==========================================
// 4. SIMULATED SMS
// ==========================================
export function SMSView() {
  const [messages, setMessages] = useState([
    { text: "Alert: Ramesh assigned for project Kondapur at 11:30 AM.", date: "July 23, 2026" },
    { text: "Alert: Booking confirmation code SH-1025.", date: "July 23, 2026" }
  ]);
  const [phone, setPhone] = useState("");
  const [smsText, setSmsText] = useState("");

  const handleSendSMS = (e) => {
    e.preventDefault();
    if (!phone || !smsText) return;
    
    setMessages(prev => [{ text: `SMS to ${phone}: ${smsText}`, date: "Today" }, ...prev]);
    setSmsText("");
    alert(`SMS broadcast sent successfully to ${phone}!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
      <form onSubmit={handleSendSMS} className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 space-y-5 shadow-sm">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-900 pb-3">
          SMS Broadcast Dispatch
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recipient Phone</label>
          <input
            type="text"
            placeholder="e.g. +91 99887 76655"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message Body</label>
          <textarea
            placeholder="Write SMS message content..."
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            required
            rows="3"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none"
          />
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] cursor-pointer">
          <Smartphone className="w-4 h-4" />
          <span>Send SMS Broadcast</span>
        </button>
      </form>

      <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-900 pb-3">
          Outgoing SMS Logs
        </h3>

        <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
          {messages.map((sms, i) => (
            <div key={i} className="p-3.5 border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 rounded-xl space-y-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{sms.text}</p>
              <span className="text-[10px] text-slate-400 block font-bold">{sms.date} • Sent via carrier routing</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. SIMULATED EMAIL INBOX
// ==========================================
export function EmailView() {
  const [emails, setEmails] = useState([
    { to: "developer@abcbuilders.com", subject: "Mediator Assignment SH-1024", body: "Ramesh has been assigned with 25 workers on location Gachibowli." },
    { to: "support@xyzinfra.in", subject: "Invoice Details Pending Reconcile", body: "Pending invoice of ₹12,500 due on July 30, 2026." }
  ]);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!to || !subject || !body) return;
    
    setEmails(prev => [{ to, subject, body }, ...prev]);
    setTo("");
    setSubject("");
    setBody("");
    alert(`Email successfully queued for delivery to ${to}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
      <form onSubmit={handleSendEmail} className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-900 pb-3">
          Compose Email
        </h3>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recipient</label>
          <input
            type="email"
            placeholder="developer@client.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</label>
          <input
            type="text"
            placeholder="Job Dispatch Logs..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message</label>
          <textarea
            placeholder="Write email body text..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows="3"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none"
          />
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] cursor-pointer">
          <Mail className="w-4 h-4" />
          <span>Send SMTP Email</span>
        </button>
      </form>

      <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-900 pb-3">
          Outbox Logs
        </h3>

        <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
          {emails.map((e, idx) => (
            <div key={idx} className="p-4 border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 rounded-xl text-left space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-indigo-600">{e.to}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Queued</span>
              </div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">{e.subject}</h4>
              <p className="text-xs text-slate-500 italic mt-1">"{e.body}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. AGENTS DIRECTORY
// ==========================================
export function AgentsView() {
  const { agents } = useContext(AppContext);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {agents.map((a, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm p-5 flex flex-col items-center text-center space-y-4"
          >
            {/* Avatar block with status lights */}
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center font-bold text-xl relative">
              {a.name[0]}
              <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full border-4 border-white dark:border-slate-950 ${
                a.status === "Available" ? "bg-emerald-500" :
                a.status === "Talking" ? "bg-blue-500 animate-pulse" :
                a.status === "Break" ? "bg-amber-500" : "bg-slate-400"
              }`} />
            </div>

            <div>
              <h4 className="font-bold text-slate-950 dark:text-white">{a.name}</h4>
              <p className="text-xs text-slate-400">Agent Representative</p>
            </div>

            <span className={`text-xs font-bold py-1 px-3.5 rounded-full border ${a.badgeColor}`}>
              {a.status}
            </span>

            <div className="w-full border-t border-slate-100 dark:border-slate-900 pt-3 flex justify-around text-[10px] text-slate-400 font-bold uppercase">
              <span>CSAT: 4.8</span>
              <span>Calls: {Math.floor(Math.random() * 30) + 10}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
