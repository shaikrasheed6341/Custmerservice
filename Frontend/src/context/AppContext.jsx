import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

export function AppProvider({ children }) {
  const [currentView, setCurrentView] = useState("login");
  const [activeUser, setActiveUser] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  
  // Transition booking state to assign mediators
  const [pendingBookingId, setPendingBookingId] = useState(null);

  // Active audio recording file being played
  const [playingAudio, setPlayingAudio] = useState(null);

  // SOS States
  const [activeSosCount, setActiveSosCount] = useState(0);
  const [activeSosCalls, setActiveSosCalls] = useState([]);

  // App Stats
  const [stats, setStats] = useState({
    calls: 158,
    waiting: 100,
    answered: 132,
    missed: 14,
    onlineAgents: 10,
  });

  // State caches for data syncing
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [agents, setAgents] = useState([]);
  const [liveCalls, setLiveCalls] = useState([]);
  const [crmRecords, setCrmRecords] = useState([]);

  // Available mediators list (Static mock configuration)
  const mediators = [
    { name: "Ramesh", distance: "5 km", rating: "4.8" },
    { name: "Sai", distance: "3 km", rating: "4.5" },
    { name: "Naveen", distance: "8 km", rating: "4.9" },
    { name: "Kiran", distance: "2 km", rating: "4.2" }
  ];

  // Refresh data from PostgreSQL DB API
  const refreshData = async () => {
    try {
      // 1. Fetch Agents
      const resAgents = await fetch(`${API_BASE_URL}/agents`);
      if (resAgents.ok) {
        const res = await resAgents.json();
        if (res.success) setAgents(res.data);
      }

      // 2. Fetch CRM records
      const resCrm = await fetch(`${API_BASE_URL}/crm`);
      if (resCrm.ok) {
        const res = await resCrm.json();
        if (res.success) setCrmRecords(res.data);
      }

      // 3. Fetch Bookings
      const resBookings = await fetch(`${API_BASE_URL}/bookings`);
      if (resBookings.ok) {
        const res = await resBookings.json();
        if (res.success) setBookings(res.data);
      }

      // 4. Fetch Tickets
      const resTickets = await fetch(`${API_BASE_URL}/tickets`);
      if (resTickets.ok) {
        const res = await resTickets.json();
        if (res.success) setTickets(res.data);
      }

      // 5. Fetch Call History
      const resHistory = await fetch(`${API_BASE_URL}/calls/history`);
      if (resHistory.ok) {
        const res = await resHistory.json();
        if (res.success) setCallHistory(res.data);
      }

      // 6. Fetch Active Calls (Live Feed)
      const resActive = await fetch(`${API_BASE_URL}/calls/active`);
      if (resActive.ok) {
        const res = await resActive.json();
        if (res.success) setLiveCalls(res.data);
      }

      // 7. Fetch active SOS Calls
      const resSos = await fetch(`${API_BASE_URL}/sos/active-count`);
      if (resSos.ok) {
        const res = await resSos.json();
        if (res.success) {
          setActiveSosCount(res.activeCount);
          setActiveSosCalls(res.activeCalls);
        }
      }
    } catch (err) {
      console.warn("Backend API offline. Operating in Local Mock Mode.", err.message);
    }
  };

  // Poll database state updates every 3 seconds
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update statistics dynamically based on historical counts
  useEffect(() => {
    if (callHistory.length > 0) {
      const totalCalls = callHistory.length + liveCalls.length;
      const completed = callHistory.filter(c => c.status === 'completed').length;
      const failed = callHistory.filter(c => c.status !== 'completed').length;

      setStats({
        calls: totalCalls,
        waiting: liveCalls.length,
        answered: completed,
        missed: failed,
        onlineAgents: agents.filter(a => a.status !== 'Offline').length || 4
      });
    }
  }, [callHistory, liveCalls, agents]);

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

  // Simulate an Incoming Call from Header
  const triggerIncomingCall = (customerName = "ABC Builders") => {
    const matchedCRM = crmRecords.find(c => c.name === customerName) || crmRecords[0] || {
      name: customerName,
      phone: "+919876543210",
      city: "Hyderabad",
      state: "Telangana",
      previousBookingsCount: 5,
      outstandingAmount: 0,
      mediator: "Ramesh",
      address: "Plot 45, IT Park"
    };
    
    setActiveCall({
      id: `call-${Date.now()}`,
      customerName: matchedCRM.name,
      phoneNumber: matchedCRM.phone,
      location: `${matchedCRM.city || 'Hyderabad'}, ${matchedCRM.state || 'Telangana'}`,
      type: (matchedCRM.previousBookingsCount || 0) > 0 ? "Existing" : "New",
      previousCalls: matchedCRM.previousBookingsCount || 0,
      outstandingAmount: matchedCRM.outstandingAmount || 0,
      assignedMediator: matchedCRM.mediator || "Ramesh",
      notes: "",
      bookingDetails: {
        workersRequired: "",
        workType: "Mason",
        date: "",
        time: "",
        location: matchedCRM.address || "Kondapur"
      }
    });
    setCurrentView("incoming-calls");
  };

  // Trigger Outbound calling connect API
  const triggerOutboundCall = async (from, to, customerName, agentName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calls/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, customerName, agentName })
      });
      if (response.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error("Outbound API call failed:", err.message);
    }
  };

  // Trigger emergency SOS Call
  const triggerSOSCall = async (customerName = 'SOS Caller', customerNumber = '+919555512345') => {
    try {
      const response = await fetch(`${API_BASE_URL}/sos/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerNumber,
          agentName: activeUser ? activeUser.name : 'Carol'
        })
      });
      if (response.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error("SOS API trigger failed:", err.message);
    }
  };

  // Trigger bulk SOS simulation
  const simulateBulkSOSCalls = async (count = 100) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sos/simulate-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      if (response.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error("Bulk SOS simulation failed:", err.message);
    }
  };

  const endCall = () => {
    setActiveCall(null);
    setCurrentView("dashboard");
  };

  const saveCallNotes = (notes) => {
    if (activeCall) {
      setActiveCall(prev => ({ ...prev, notes }));
    }
  };

  // Create booking via PostgreSQL API
  const createBooking = async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: bookingData.customerName || "Walk-in Customer",
          location: bookingData.location || "Kondapur",
          workers: bookingData.workersRequired || 1,
          date: bookingData.date,
          time: bookingData.time,
          workType: bookingData.workType
        })
      });
      if (response.ok) {
        const res = await response.json();
        if (res.success) {
          setPendingBookingId(res.data.bookingId);
          await refreshData();
          setCurrentView("mediators");
          return;
        }
      }
    } catch (err) {
      console.error("Booking post error:", err.message);
    }

    // Local Fallback
    const newId = `SH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      bookingId: newId,
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
    setCurrentView("mediators");
  };

  // Assign mediator via PostgreSQL API
  const assignMediator = async (mediatorName) => {
    if (!pendingBookingId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${pendingBookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Assigned',
          mediator: mediatorName,
          agent: activeUser ? activeUser.name : 'Carol'
        })
      });
      if (response.ok) {
        setPendingBookingId(null);
        await refreshData();
        setCurrentView("bookings");
        return;
      }
    } catch (err) {
      console.error("Assign mediator API error:", err.message);
    }

    // Fallback
    setBookings(prev =>
      prev.map(b =>
        b.bookingId === pendingBookingId
          ? { ...b, status: "Assigned", mediator: mediatorName }
          : b
      )
    );
    setPendingBookingId(null);
    setCurrentView("bookings");
  };

  // Create ticket via PostgreSQL API
  const createTicket = async (ticketData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: ticketData.customer || "Unknown",
          complaint: ticketData.complaint || "General Complaint",
          priority: ticketData.priority || "Medium",
          description: ticketData.description || "",
          agent: activeUser ? activeUser.name : "Carol"
        })
      });
      if (response.ok) {
        await refreshData();
        setCurrentView("tickets");
        return;
      }
    } catch (err) {
      console.error("Ticket post API error:", err.message);
    }

    // Fallback
    const newId = `SH-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket = {
      ticketId: newId,
      customer: ticketData.customer || "Unknown",
      complaint: ticketData.complaint || "General Complaint",
      priority: ticketData.priority || "Medium",
      description: ticketData.description || "",
      agent: ticketData.agent || (activeUser ? activeUser.name : "Carol"),
      status: "Open",
      date: new Date().toISOString().split('T')[0]
    };

    setTickets(prev => [newTicket, ...prev]);
    setCurrentView("tickets");
  };

  // Update ticket status via PostgreSQL API
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error("Update ticket status API error:", err.message);
    }

    // Fallback
    setTickets(prev =>
      prev.map(t => (t.ticketId === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  // Update customer record via PostgreSQL API
  const updateCRMRecord = async (updatedRecord) => {
    try {
      const response = await fetch(`${API_BASE_URL}/crm/${updatedRecord.crmId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecord)
      });
      if (response.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error("Update CRM API error:", err.message);
    }

    // Fallback
    setCrmRecords(prev =>
      prev.map(r => (r.crmId === updatedRecord.crmId ? updatedRecord : r))
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
        triggerOutboundCall,
        triggerSOSCall,
        simulateBulkSOSCalls,
        activeSosCount,
        activeSosCalls,
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
