import React from "react";

const liveCalls = [
  {
    name: "Rahul",
    type: "Customer",
    duration: "03:22",
  },
  {
    name: "Priya",
    type: "Customer",
    duration: "01:10",
  },
  {
    name: "Ramesh",
    type: "Customer",
    duration: "05:45",
  },
];

function LiveCalls() {
  return (
    <div className="card">
      <h2>Live Calls</h2>

      {liveCalls.map((call, index) => (
        <div className="list-item" key={index}>
          <div>
            <strong>{call.name}</strong>
            <p>{call.type}</p>
          </div>

          <span>{call.duration}</span>
        </div>
      ))}
    </div>
  );
}

export default LiveCalls;