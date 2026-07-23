import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentView, setCurrentView] = useState("login");
  const [activeUser, setActiveUser] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  
  // Transition booking state to assign mediators
  const [pendingBookingId, setPendingBookingId] = useState(null);

  // Active audio recording file being played
  const [playingAudio, setPlayingAudio] = useState(null);

  // App Stats derived or fixed
  const [stats, setStats] = useState({
    calls: 158,
    waiting: 100,
    answered: 132,
    missed: 14,
    onlineAgents: 10,
  });

  // Today's Bookings
  const [bookings, setBookings] = useState([
    {
      id: "SH-1024",
      customer: "ABC Builders",
      location: "Gachibowli",
      workers: 25,
      status: "Assigned",
      agent: "Rahul",
      date: "2026-07-24",
      time: "10:00 AM",
      mediator: "Ramesh",
      workType: "Mason"
    },
    {
      id: "SH-1025",
      customer: "XYZ Infra",
      location: "Madhapur",
      workers: 10,
      status: "Pending",
      agent: "Priya",
      date: "2026-07-24",
      time: "11:30 AM",
      mediator: "",
      workType: "Carpenter"
    }
  ]);

  // Tickets logs
  const [tickets, setTickets] = useState([
    {
      id: "SH-2026-00231",
      customer: "ABC Builders",
      complaint: "Delay in worker arrival",
      priority: "High",
      description: "Customer reported that the painters assigned did not arrive on time.",
      agent: "Rahul",
      status: "In Progress",
      date: "2026-07-23"
    },
    {
      id: "SH-2026-00232",
      customer: "XYZ Infra",
      complaint: "Incorrect billing",
      priority: "Medium",
      description: "Discrepancy in invoice amount for Madhapur project.",
      agent: "Priya",
      status: "Open",
      date: "2026-07-23"
    }
  ]);

  // Call Logs History
  const [callHistory, setCallHistory] = useState([
    {
      id: "hist-1",
      date: "10:20 AM",
      customer: "ABC Builders",
      agent: "Rahul",
      duration: "04:15",
      recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      id: "hist-2",
      date: "11:35 AM",
      customer: "XYZ Infra",
      agent: "Priya",
      duration: "02:45",
      recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
      id: "hist-3",
      date: "01:15 PM",
      customer: "Home Owner",
      agent: "Sai",
      duration: "05:21",
      recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
  ]);

  // Agent Status List
  const [agents, setAgents] = useState([
    { name: "Rahul", status: "Talking", badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    { name: "Anjali", status: "Available", badgeColor: "bg-teal-100 text-teal-800 border-teal-200" },
    { name: "Ravi", status: "Break", badgeColor: "bg-amber-100 text-amber-800 border-amber-200" },
    { name: "Sai", status: "Offline", badgeColor: "bg-slate-100 text-slate-800 border-slate-200" }
  ]);

  // Live calls (for supervisor monitoring)
  const [liveCalls, setLiveCalls] = useState([
    { id: "live-1", agent: "Rahul", customer: "ABC Builders", duration: "04:21" },
    { id: "live-2", agent: "Priya", customer: "XYZ Infra", duration: "02:15" },
    { id: "live-3", agent: "Sai", customer: "Home Owner", duration: "01:08" }
  ]);

  // Customer CRM data
  const [crmRecords, setCrmRecords] = useState([
    {
      id: "crm-1",
      name: "ABC Builders",
      company: "ABC Builders Pvt Ltd",
      gst: "36AAAAA1111A1Z1",
      email: "info@abcbuilders.com",
      phone: "+91 98765 43210",
      address: "Plot 45, IT Park",
      city: "Hyderabad",
      state: "Telangana",
      preferredLanguage: "English",
      notes: "Prefers Ramesh as mediator. Always prompt on payments.",
      previousBookingsCount: 18,
      outstandingAmount: 12500,
      mediator: "Ramesh"
    },
    {
      id: "crm-2",
      name: "XYZ Infra",
      company: "XYZ Infrastructure",
      gst: "36BBBBB2222B1Z2",
      email: "contact@xyzinfra.in",
      phone: "+91 87654 32109",
      address: "Survey 12, Hitech City",
      city: "Hyderabad",
      state: "Telangana",
      preferredLanguage: "Telugu",
      notes: "Requires Telugu speaking workers.",
      previousBookingsCount: 8,
      outstandingAmount: 0,
      mediator: "Priya"
    },
    {
      id: "crm-3",
      name: "Home Owner",
      company: "Individual",
      gst: "N/A",
      email: "owner@gmail.com",
      phone: "+91 76543 21098",
      address: "Flat 202, Sunshine Apts",
      city: "Hyderabad",
      state: "Telangana",
      preferredLanguage: "Hindi",
      notes: "Requires helper for cleaning. Payment usually via UPI.",
      previousBookingsCount: 3,
      outstandingAmount: 3200,
      mediator: "Sai"
    }
  ]);

  // Available mediators list
  const mediators = [
    { name: "Ramesh", distance: "5 km", rating: "4.8" },
    { name: "Sai", distance: "3 km", rating: "4.5" },
    { name: "Naveen", distance: "8 km", rating: "4.9" },
    { name: "Kiran", distance: "2 km", rating: "4.2" }
  ];

  // Auth Functions
  const login = (email, password) => {
    setActiveUser({
      name: "Agent Carol",
      email: email || "carol@superherooo.com",
      role: "Super Agent",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    });
    setCurrentView("dashboard");
  };

  const logout = () => {
    setActiveUser(null);
    setCurrentView("login");
  };

  // Simulate an Incoming Call (triggered from header for demonstration)
  const triggerIncomingCall = (customerName = "ABC Builders") => {
    const matchedCRM = crmRecords.find(c => c.name === customerName) || crmRecords[0];
    
    // Set active call details
    setActiveCall({
      id: `call-${Date.now()}`,
      customerName: matchedCRM.name,
      phoneNumber: matchedCRM.phone,
      location: matchedCRM.city + ", " + matchedCRM.state,
      type: matchedCRM.previousBookingsCount > 0 ? "Existing" : "New",
      previousCalls: matchedCRM.previousBookingsCount,
      outstandingAmount: matchedCRM.outstandingAmount,
      assignedMediator: matchedCRM.mediator,
      notes: "",
      bookingDetails: {
        workersRequired: "",
        workType: "Mason",
        date: "",
        time: "",
        location: matchedCRM.address
      }
    });
    setCurrentView("incoming-calls");
    
    // Increment total calls statistic
    setStats(prev => ({ ...prev, calls: prev.calls + 1, waiting: prev.waiting + 1 }));
  };

  const endCall = () => {
    if (activeCall) {
      // Add call log to history
      const durationSecs = Math.floor(Math.random() * 200) + 30; // Random length
      const mins = Math.floor(durationSecs / 60);
      const secs = durationSecs % 60;
      const formattedDuration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      const now = new Date();
      const hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${displayHours}:${minutes} ${ampm}`;

      const newLog = {
        id: `hist-${Date.now()}`,
        date: formattedTime,
        customer: activeCall.customerName,
        agent: activeUser ? activeUser.name : "Carol",
        duration: formattedDuration,
        recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
      };

      setCallHistory(prev => [newLog, ...prev]);
      setStats(prev => ({
        ...prev,
        waiting: Math.max(0, prev.waiting - 1),
        answered: prev.answered + 1
      }));
    }
    setActiveCall(null);
    setCurrentView("dashboard");
  };

  // Actions within the Incoming Call screen pop
  const saveCallNotes = (notes) => {
    if (activeCall) {
      setActiveCall(prev => ({ ...prev, notes }));
    }
  };

  // Create booking
  const createBooking = (bookingData) => {
    const newId = `SH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: newId,
      customer: bookingData.customerName || "Walk-in Customer",
      location: bookingData.location || "Kondapur",
      workers: parseInt(bookingData.workersRequired) || 1,
      status: "Pending",
      agent: activeUser ? activeUser.name : "Carol",
      date: bookingData.date || new Date().toISOString().split('T')[0],
      time: bookingData.time || "12:00 PM",
      mediator: "",
      workType: bookingData.workType || "Mason"
    };

    setBookings(prev => [newBooking, ...prev]);
    setPendingBookingId(newId);
    setCurrentView("mediators"); // Redirect to mediator assignment screen pop
  };

  // Assign mediator
  const assignMediator = (mediatorName) => {
    if (!pendingBookingId) return;
    
    setBookings(prev =>
      prev.map(b =>
        b.id === pendingBookingId
          ? { ...b, status: "Assigned", mediator: mediatorName }
          : b
      )
    );
    setPendingBookingId(null);
    setCurrentView("bookings");
  };

  // Create ticket
  const createTicket = (ticketData) => {
    const newId = `SH-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket = {
      id: newId,
      customer: ticketData.customer || "Unknown",
      complaint: ticketData.complaint || "General Complaint",
      priority: ticketData.priority || "Medium",
      description: ticketData.description || "",
      agent: ticketData.agent || (activeUser ? activeUser.name : "Carol"),
      status: ticketData.status || "Open",
      date: new Date().toISOString().split('T')[0]
    };

    setTickets(prev => [newTicket, ...prev]);
    setCurrentView("tickets");
  };

  // Update ticket status
  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  // Update customer record
  const updateCRMRecord = (updatedRecord) => {
    setCrmRecords(prev =>
      prev.map(r => (r.id === updatedRecord.id ? updatedRecord : r))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeUser,
        setActiveUser,
        activeCall,
        setActiveCall,
        stats,
        bookings,
        tickets,
        callHistory,
        agents,
        liveCalls,
        crmRecords,
        mediators,
        pendingBookingId,
        setPendingBookingId,
        playingAudio,
        setPlayingAudio,
        login,
        logout,
        triggerIncomingCall,
        endCall,
        saveCallNotes,
        createBooking,
        assignMediator,
        createTicket,
        updateTicketStatus,
        updateCRMRecord
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
