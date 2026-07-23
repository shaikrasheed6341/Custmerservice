import React from "react";

const bookings = [
  {
    customer: "ABC Builders",
    location: "Gachibowli",
    workers: 25,
    status: "Assigned",
    agent: "Rahul",
  },
  {
    customer: "XYZ Infra",
    location: "Madhapur",
    workers: 10,
    status: "Pending",
    agent: "Priya",
  },
];

function BookingTable() {
  return (
    <div className="card">

      <div className="table-header">

        <h2>Today's Bookings</h2>

        <button>View All</button>

      </div>

      <table>

        <thead>
          <tr>
            <th>Customer</th>
            <th>Location</th>
            <th>Workers</th>
            <th>Status</th>
            <th>Agent</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((item, index) => (
            <tr key={index}>
              <td>{item.customer}</td>
              <td>{item.location}</td>
              <td>{item.workers}</td>

              <td>
                <span
                  className={
                    item.status === "Assigned"
                      ? "badge success"
                      : "badge warning"
                  }
                >
                  {item.status}
                </span>
              </td>

              <td>{item.agent}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default BookingTable;