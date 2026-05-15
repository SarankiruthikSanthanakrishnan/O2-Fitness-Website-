

// src/pages/UserDashboard/SupportTickets.jsx
export default function SupportTickets({ tickets, raiseTicket }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Support & Tickets</h2>
      <button onClick={raiseTicket} className="mb-4 bg-orange-600 text-white px-4 py-2 rounded">Raise Complaint</button>
      {tickets.map(ticket => (
        <div key={ticket.id} className="border p-4 rounded mb-3">
          <p>Subject: {ticket.subject}</p>
          <p>Status: {ticket.status}</p>
        </div>
      ))}
    </div>
  );
}