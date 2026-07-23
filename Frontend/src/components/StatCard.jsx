import React from "react";
import "./StatCard.css";

function StatCard({ title, value, growth, icon, color }) {
  return (
    <div className="stat-card">

      <div
        className="stat-icon"
        style={{ background: color }}
      >
        {icon}
      </div>

      <div className="stat-info">

        <p>{title}</p>

        <h2>{value}</h2>

        <span>{growth}</span>

      </div>

    </div>
  );
}

export default StatCard;