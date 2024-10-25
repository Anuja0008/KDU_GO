import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com"; // Ensure you have this package installed
import { db } from "../../firebase/firebase"; // Adjust the import according to your firebase config
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

// MessageCard component to display individual messages
const MessageCard = ({ message, onNavigate, onEmailClick }) => {
  // Function to format date to "YYYY-MM-DD HH:MM"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
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
        width: "300px", // Increased width
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 20px rgba(0, 123, 255, 0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        position: "relative", // Set position to relative for absolute positioning of button
      }}
    >
      <button
        onClick={() => onNavigate(message.rSeatNo)} // Navigate to the seat reservation page
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
      <p 
        onClick={() => onEmailClick(message.email)} // Call onEmailClick when the email is clicked
        style={{ 
          fontWeight: "bold", 
          color: "#007bff", 
          wordWrap: "break-word", 
          fontSize: "13px", 
          cursor: "pointer" // Change cursor to pointer for interactivity
        }}
      >
        Email: {message.email}
      </p>
      <p style={{ margin: "5px 0", fontWeight: "bold", color: "#555" }}>
        Revised Seat No: <span style={{ fontWeight: "normal" }}>{message.seatNo}</span>
      </p>
      <p style={{ margin: "5px 0", fontWeight: "bold", color: "#555" }}>
        New Ride Date: <span style={{ fontWeight: "normal" }}>{formatDate(message.date)}</span>
      </p>
      <p style={{ margin: "5px 0", fontWeight: "bold", color: "#555" }}>
        Destination: <span style={{ fontWeight: "normal" }}>{message.destination}</span>
      </p>
    </div>
  );
};

// ROLLOVER component
const ROLLOVER = () => {
  const [notice, setNotice] = useState("");
  const [receiver, setReceiver] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]); // State to hold fetched messages
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "TicketRollover")); // Fetch messages from collection
        const messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList); // Set the fetched messages
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []); // Fetch messages on component mount

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error message

    try {
      // Save email details to Firestore
      await addDoc(collection(db, "RolloverEMAIL"), {
        Notice: notice,
        Receiver: receiver,
        Sender: "your_verified_email@example.com", // Replace with your verified email
        Time_Date: serverTimestamp(),
      });

      // Send the email using EmailJS
      const templateParams = {
        to_email: receiver, // Dynamic recipient email
        from_name: "Your Name", // Add your name or sender's name
        from_email: "your_verified_email@example.com", // Your verified email
        message: notice,
      };

      const response = await emailjs.send(
        "service_skr725o", // Your service ID
        "template_delfrig", // Your template ID
        templateParams,
        "TQNCaWwbyeda2B53Z" // Your user ID
      );

      console.log("Email sent successfully!", response.status, response.text);
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Failed to send email:", error);
      setError("Failed to send email. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to handle navigation to the seat reservation page
  const handleNavigate = (seatNo) => {
    navigate(`/childpage_1/seat-details/${seatNo}`); // Replace with your actual route for the seat reservation page
  };

  // Function to handle setting the receiver's email
  const handleEmailClick = (email) => {
    setReceiver(email); // Set the receiver email to the clicked email
  };

  // Function to clear all documents in the TicketRollover collection
  const clearMessages = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all messages?");
    if (!confirmDelete) return;

    try {
      const querySnapshot = await getDocs(collection(db, "TicketRollover"));
      const batchDelete = querySnapshot.docs.map((document) =>
        deleteDoc(doc(db, "TicketRollover", document.id))
      );
      await Promise.all(batchDelete);
      setMessages([]); // Clear messages from state
      alert("All messages have been cleared.");
    } catch (error) {
      console.error("Error clearing messages:", error);
      alert("Failed to clear messages.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header Section */}
      <header style={{
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
      }}>
        <h1>Ticket Rollover System</h1>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", color: "#333" }}>Send Email</h2>
          <form style={{ display: "flex", flexDirection: "column" }} onSubmit={sendEmail}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Notice:</label>
              <textarea
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "16px",
                  width: "100%",
                  resize: "vertical", // Allow vertical resizing
                }}
                placeholder="Type your notice here..."
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Receiver's Email:</label>
              <input
                type="email"
                value={receiver} // Controlled input for receiver email
                onChange={(e) => setReceiver(e.target.value)}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "16px",
                  width: "100%",
                }}
                placeholder="Receiver's email..."
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px",
                backgroundColor: loading ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
              }}
            >
              {loading ? "Sending..." : "Send Email"}
            </button>
          </form>

          <h3 style={{ textAlign: "center", color: "#333", marginTop: "30px" }}>Fetched Messages</h3>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onNavigate={handleNavigate}
                onEmailClick={handleEmailClick}
              />
            ))}
          </div>

          {/* Clear All Messages button */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={clearMessages}
              style={{
                padding: "10px",
                backgroundColor: "#dc3545", // Red background
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
