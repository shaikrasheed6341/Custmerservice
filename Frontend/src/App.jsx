import React, { useContext } from "react";
import { AppProvider, AppContext } from "./context/AppContext";
import Layout from "./components/Layout";
import AudioPlayer from "./components/AudioPlayer";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import IncomingCall from "./pages/IncomingCall";
import CallHistory from "./pages/CallHistory";
import CRM from "./pages/CRM";
import BookingScreen from "./pages/BookingScreen";
import MediatorAssignment from "./pages/MediatorAssignment";
import TicketModule from "./pages/TicketModule";
import LiveCallMonitoring from "./pages/LiveCallMonitoring";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// Mock Pages
import {
  OutgoingCallsView,
  WorkersView,
  WhatsAppView,
  SMSView,
  EmailView,
  AgentsView
} from "./pages/MockChannels";

function AppContent() {
  const { currentView } = useContext(AppContext);

  // Router switcher
  const renderView = () => {
    switch (currentView) {
      case "login":
        return <Login />;
      case "dashboard":
        return <Dashboard />;
      case "live-calls":
        return <LiveCallMonitoring />;
      case "incoming-calls":
        return <IncomingCall />;
      case "outgoing-calls":
        return <OutgoingCallsView />;
      case "call-history":
        return <CallHistory />;
      case "customers":
        return <CRM />;
      case "bookings":
        return <BookingScreen />;
      case "mediators":
        return <MediatorAssignment />;
      case "workers":
        return <WorkersView />;
      case "tickets":
        return <TicketModule />;
      case "whatsapp":
        return <WhatsAppView />;
      case "sms":
        return <SMSView />;
      case "email":
        return <EmailView />;
      case "reports":
        return <Reports />;
      case "agents":
        return <AgentsView />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderView()}
      <AudioPlayer />
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}