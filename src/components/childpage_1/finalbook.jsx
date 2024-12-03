import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import { Timestamp } from 'firebase/firestore';  // Import Timestamp from Firestore

const FinalBook = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    seatNo,
    travelDate,
    journeyType,
    destination,
    email,
    name,
    phoneNumber,
  } = location.state || {};

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const [month, day, year] = new Date(date).toLocaleDateString('en-US', options).split('/');
    return `${year}-${month}-${day}`;
  };

  // Helper function to convert the travel date string to Firestore Timestamp
  const convertToTimestamp = (dateString) => {
    // Step 1: Remove 'at' and 'a.m.'/'p.m.' parts and format to a valid format
    const formattedDateString = dateString
      .replace(' at', '')
      .replace(' a.m.', ' AM')
      .replace(' p.m.', ' PM');

    // Step 2: Create a Date object from the formatted string
    const date = new Date(formattedDateString);

    // Step 3: Convert to Firestore Timestamp
    return Timestamp.fromDate(date);
  };

  const handleBookSeat = async () => {
    // Convert the travelDate to Firestore Timestamp
    const formattedDate = convertToTimestamp(travelDate);

    const documentId = `${email}_${seatNo}_${formattedDate.toMillis()}`; // Use the timestamp in the document ID

    const bookingData = {
      seatId: Number(seatNo),
      travelDate: formattedDate,  // Store as Timestamp
      journeyType,
      destination,
      email,
      fullName: name,
      phoneNumber,
      seat_state: true,
    };

    try {
      const reservationsRef = collection(db, 'reservations');
      const oldEmailQuery = query(reservationsRef, where('email', '==', email));
      const querySnapshot = await getDocs(oldEmailQuery);

      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, 'reservations', docSnapshot.id));
      });

      await setDoc(doc(db, 'reservations', documentId), bookingData);

      const templateParams = {
        to_name: name,
        to_email: email,
        seat_id: seatNo,
        destination: destination,
        travel_date: travelDate, // You can keep the original string format for the email
        full_name: name,
        message: `You have been booked for seat ${seatNo} according to your rollover request on ${travelDate} to ${destination}.`,
      };

      await emailjs.send(
        "service_skr725o",
        "template_delfrig",
        templateParams,
        "TQNCaWwbyeda2B53Z"
      );

      const rolloverData = {
        Notice: `You have been booked for seat ${seatNo} on ${travelDate} to ${destination}.`,
        Receiver: email,
      };

      await setDoc(doc(db, 'RolloverEMAIL', documentId), rolloverData);

      alert('Seat successfully booked, confirmation email sent, and notification added!');
      navigate('/home');
    } catch (error) {
      console.error('Error booking seat:', error);
      alert('Failed to book seat. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.header}>Booking Details</h1>
        <div style={styles.info}>
          <p><strong>Seat No:</strong> {seatNo}</p>
          <p><strong>Travel Date:</strong> {travelDate}</p>
          <p><strong>Journey Type:</strong> {journeyType}</p>
          <p><strong>Destination:</strong> {destination}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Full Name:</strong> {name}</p>
          <p><strong>Phone Number:</strong> {phoneNumber}</p>
        </div>
        <button onClick={handleBookSeat} style={styles.bookButton}>
          Book Seat
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f6f9',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'center',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  info: {
    textAlign: 'left',
    marginBottom: '20px',
  },
  bookButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  bookButtonHover: {
    backgroundColor: '#0056b3',
  },
};

export default FinalBook;
