"use client";

import { useState } from "react";
import TicketDetail from "../components/TicketDetail";
import TicketList from "../components/TicketList";

const MyTicketsPage = () => {
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Function to set the ID of the ticket to display in detail view
  const handleSelectTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
  };

  // Function to go back to the ticket list view
  const handleBackToList = () => {
    setSelectedTicketId(null);
  };

  // Callback for when a ticket is updated (e.g., status change).
  // This can trigger a re-fetch of the list if needed, or update local state.
  const handleTicketUpdated = (updatedId) => {
    console.log(`Ticket ${updatedId} was updated. Reloading list on back.`);
    // When navigating back to TicketList, it will re-fetch its data.
  };

  return (
    <div
      style={{
        padding: "2rem 0",
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {selectedTicketId ? (
        // If a ticket is selected, show the detail view
        <TicketDetail
          ticketId={selectedTicketId}
          onBack={handleBackToList}
          onTicketUpdated={handleTicketUpdated}
        />
      ) : (
        // Otherwise, show the list of tickets
        <TicketList onSelectTicket={handleSelectTicket} />
      )}
    </div>
  );
};

export default MyTicketsPage;
