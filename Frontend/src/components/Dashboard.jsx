import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar">

      <div className="logo">
        Logo
      </div>

      <div className="nav-item active">
        Dashboard
      </div>

      <div className="nav-item">
        Calls
      </div>

      <div className="nav-item">
        CRM
      </div>

      <div className="nav-item">
        Leads
      </div>

      <div className="nav-item">
        Tickets
      </div>

      <div className="nav-item">
        Reports
      </div>

      <div className="nav-item search">
        🔍 Search
      </div>

      <div className="nav-item admin">
        Admin
      </div>

    </div>
  );
}

export default Navbar;