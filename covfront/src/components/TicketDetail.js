import { useParams } from "react-router-dom";

export const TicketDetail = () => {
  const { id } = useParams();

  // Mock Ticket Data
  const ticket = {
    id: parseInt(id),
    user_id: 101,
    ride_id: 5,
    subject: "App Login Issue",
    description: "User cannot log in to the application.",
    status: "open",
    created_at: new Date().toLocaleDateString(),
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-red-100 text-red-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      closed: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${styles[status]}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Ticket #{ticket.id}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <strong>User ID:</strong> {ticket.user_id}
          </div>
          <div>
            <strong>Ride ID:</strong> {ticket.ride_id || "N/A"}
          </div>
          <div>
            <strong>Status:</strong> {getStatusBadge(ticket.status)}
          </div>
          <div>
            <strong>Date:</strong> {ticket.created_at}
          </div>
        </div>
        <div className="mb-6">
          <strong>Subject:</strong>
          <p className="mt-1 text-gray-700">{ticket.description}</p>
        </div>
        <div>
          <button
            onClick={() => window.history.back()}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
