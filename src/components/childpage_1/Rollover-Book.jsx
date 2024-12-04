import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns'; // You can use date-fns or any other date formatting library


const Book = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { seatNo, email, date } = location.state || {};
  const [reservations, setReservations] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    if (typeof timestamp === "number") {
      return new Date(timestamp).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    if (typeof timestamp === "string" && !isNaN(Date.parse(timestamp))) {
      return new Date(timestamp).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return "Invalid Date";
  };

  useEffect(() => {
    if (email) {
      const fetchReservations = async () => {
        try {
          const reservationsRef = collection(db, 'reservations');
          const q = query(reservationsRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);
          const fetchedData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setReservations(fetchedData);
        } catch (error) {
          console.error('Error fetching reservations:', error);
        }
      };
      fetchReservations();
    }
  }, [email]);

  const handleProceedToDetails = () => {
    const updatedReservations = reservations.map((reservation) =>
      reservation.id === reservations[0].id
        ? { ...reservation, seatId: seatNo, travelDate: date }
        : reservation
    );
    setReservations(updatedReservations);
    setIsUpdated(true);
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      const reservationRef = doc(db, 'reservations', reservationId);
      await deleteDoc(reservationRef);

      setReservations(reservations.filter((reservation) => reservation.id !== reservationId));
      setIsDeleted(true);
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleBookSeat = async () => {
    try {
      // Get the reference to the reservation document
      const reservationRef = doc(db, 'reservations', reservations[0].id);
  
      // Convert travelDate to Firestore Timestamp
      const travelDateTimestamp = Timestamp.fromDate(new Date(reservations[0].travelDate));
  
      // Update the reservation with status, bookingDate, and travelDate (as Timestamp)
      await updateDoc(reservationRef, {
        status: 'Booked',
        bookingDate: new Date(), // Store bookingDate as Date object
        travelDate: travelDateTimestamp, // Store travelDate as Timestamp
      });
  
      // Update the local state for reservations
      const updatedReservations = reservations.map((reservation) =>
        reservation.id === reservations[0].id
          ? { ...reservation, status: 'Booked', bookingDate: new Date() }
          : reservation
      );
      setReservations(updatedReservations);
  
      // Format travelDate for display (but store it as Timestamp in Firestore)
      const formattedTravelDate = format(travelDateTimestamp.toDate(), 'MMMM dd, yyyy \'at\' hh:mm:ss aaaa z');
  
      // Navigate to the final booking page with the formatted details
      navigate('/childpage_1/finalbook', {
        state: {
          seatNo: reservations[0].seatId,
          travelDate: formattedTravelDate, // Pass formatted travelDate for display
          journeyType: reservations[0].journeyType,
          destination: reservations[0].destination,
          email: reservations[0].email,
          name: reservations[0].fullName,
          phoneNumber: reservations[0].phoneNumber,
        },
      });
    } catch (error) {
      console.error('Error booking the seat:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Rollover Booking</h1>
      <div style={styles.details}>
        <p><strong>Seat No:</strong> {seatNo}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Revised Date:</strong> {formatDate(date)}</p>
      </div>

      <h2 style={styles.subHeader}>Reservations for {email}</h2>
      {reservations.length > 0 ? (
        <ul style={styles.list}>
          {reservations.map((reservation) => (
            <li key={reservation.id} style={styles.listItem}>
              <p><strong>Seat No:</strong> {reservation.seatId}</p>
              <p><strong>Travel Date:</strong> {formatDate(reservation.travelDate)}</p>
              <p><strong>Journey Type:</strong> {reservation.journeyType}</p>
              <p><strong>Destination:</strong> {reservation.destination}</p>
              <p><strong>Email:</strong> {reservation.email}</p>
              <p><strong>Name:</strong> {reservation.fullName}</p>
              <p><strong>Phone Number:</strong> {reservation.phoneNumber}</p>
              <button onClick={() => handleDeleteReservation(reservation.id)} style={styles.deleteButton}>
                Delete Reservation
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reservations found for this email.</p>
      )}

      <div style={styles.buttonContainer}>
        <button onClick={handleProceedToDetails} style={styles.primaryButton}>
          Proceed to Details
        </button>
        <button onClick={handleBookSeat} style={styles.secondaryButton}>
          Book Seat
        </button>
      </div>

      {isUpdated && <p style={styles.successMessage}>Reservation updated!</p>}
      {isDeleted && <p style={styles.successMessage}>Reservation deleted successfully!</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '600px',
    margin: 'auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: { fontSize: '28px', fontWeight: 'bold', color: '#4A90E2', textAlign: 'center' },
  details: { marginBottom: '20px', padding: '10px', backgroundColor: '#E9F5FC', borderRadius: '8px' },
  subHeader: { fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: '#333' },
  list: { listStyleType: 'none', padding: 0 },
  listItem: {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  buttonContainer: { display: 'flex', justifyContent: 'space-between', marginTop: '20px' },
  primaryButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4A90E2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  secondaryButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#FF6B6B',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    color: 'white',
    padding: '7px 15px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
  successMessage: { color: '#28A745', marginTop: '15px', fontWeight: 'bold' },
};

export default Book;
