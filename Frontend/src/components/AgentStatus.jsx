import React from "react";

const agents = [
  {
    name: "Rahul",
    status: "Talking",
    color: "green",
  },
  {
    name: "Anjali",
    status: "Available",
    color: "green",
  },
  {
    name: "Ravi",
    status: "Break",
    color: "yellow",
  },
  {
    name: "Sai",
    status: "Offline",
    color: "red",
  },
];

function AgentStatus() {
  return (
    <div className="card">
      <h2>Agent Status</h2>

      {agents.map((agent, index) => (
        <div className="list-item" key={index}>
          <strong>{agent.name}</strong>

          <span className={agent.color}>
            {agent.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export default AgentStatus;