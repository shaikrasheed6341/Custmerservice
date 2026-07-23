import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">CRM</div>

      <ul className="nav-links">
        <li className="active">Dashboard</li>
        <li>Calls</li>
        <li>CRM</li>
        <li>Leads</li>
        <li>Tickets</li>
        <li>Reports</li>
      </ul>

      <div className="right">
        <input type="text" placeholder="Search..." />
        <button className="profile">Admin</button>
      </div>
    </nav>
  );
}

export default Navbar;