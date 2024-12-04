import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const MessageCard = ({ message, onNavigate, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "10px",
        padding: "20px",
        border: "1px solid #007bff",
        borderRadius: "12px",
        width: "300px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 20px rgba(0, 123, 255, 0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <button
        onClick={() => onNavigate(message.seatNo, message.email, message.date)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "5px 10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Go to Seat
      </button>
      <p style={{ fontWeight: "bold", color: "#007bff", wordWrap: "break-word", fontSize: "13px" }}>
        Email: {message.email}
      </p>
      <p style={{ margin: "5px 0", fontWeight: "bold", color: "#555" }}>
        Revised Seat No: <span style={{ fontWeight: "normal" }}>{message.seatNo}</span>
      </p>
      <p style={{ margin: "5px 0", fontWeight: "bold", color: "#555" }}>
        Destination: <span style={{ fontWeight: "normal" }}>{message.destination || "Unknown"}</span>
      </p>
      <p style={{ margin: "5px 0", fontWeight: "bold", color: "#555" }}>
        Revised Date: <span style={{ fontWeight: "normal" }}>{formatDate(message.date)}</span>
      </p>
      <p style={{ margin: "5px 0", fontWeight: "bold", color: "#555" }}>
        Seat State: <span style={{ fontWeight: "normal", color: message.checked ? 'green' : 'red' }}>
          {message.checked ? "Checked" : "Not Checked"}
        </span>
      </p>

      {/* Cross Button to Delete */}
      <button
        onClick={() => onDelete(message.id)}
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "20px",
          color: "#dc3545",
          cursor: "pointer",
        }}
      >
        &times;
      </button>
    </div>
  );
};

const ROLLOVER = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "TicketRollover"));
        const messagesList = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const messageData = docSnapshot.data();
            let destination = "Unknown";
            let checked = false;  // Default to false if not found

            try {
              const reservationQuery = query(
                collection(db, "reservations"),
                where("email", "==", messageData.email)
              );
              const reservationSnapshot = await getDocs(reservationQuery);

              if (!reservationSnapshot.empty) {
                const reservationDoc = reservationSnapshot.docs[0];
                if (reservationDoc.data().destination) {
                  destination = reservationDoc.data().destination;
                }
                if (reservationDoc.data().checked !== undefined) {
                  checked = reservationDoc.data().checked;  // Get the checked status
                }
              }
            } catch (error) {
              console.error(`Error fetching destination for email ${messageData.email}:`, error);
            }

            return {
              id: docSnapshot.id,
              ...messageData,
              destination,
              checked,  // Include seat state in the message object
            };
          })
        );
        setMessages(messagesList);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleNavigate = (seatNo, email, date) => {
    navigate(`/childpage_1/Rollover-Book`, {
      state: {
        seatNo,
        email,
        date,
      },
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this message?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "TicketRollover", id));
      setMessages(messages.filter((message) => message.id !== id));
      alert("Message deleted successfully.");
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message.");
    }
  };

  const clearMessages = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all messages?");
    if (!confirmDelete) return;

    try {
      const querySnapshot = await getDocs(collection(db, "TicketRollover"));
      const batchDelete = querySnapshot.docs.map((document) =>
        deleteDoc(doc(db, "TicketRollover", document.id))
      );
      await Promise.all(batchDelete);
      setMessages([]);
      alert("All messages have been cleared.");
    } catch (error) {
      console.error("Error clearing messages:", error);
      alert("Failed to clear messages.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          backgroundColor: '#263043',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#FFA500',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          borderBottom: '2px solid #FFA500',
        }}
      >
        <h1>Ticket Rollover System</h1>
      </header>

      <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h3 style={{ textAlign: "center", color: "#333", marginTop: "30px" }}>Fetched Messages</h3>

          {loading ? (
            <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>
              No messages found.
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
              {messages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onNavigate={handleNavigate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={clearMessages}
              style={{
                padding: "10px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Clear All Messages
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ROLLOVER;
