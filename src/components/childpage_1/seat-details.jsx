import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';

// Styling constants
const containerStyle = {
  padding: '20px',
  fontFamily: 'Times New Roman, Times, serif',
};

const headerStyle = {
  fontSize: '24px',
  marginBottom: '20px',
};

const cardStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
};

const fieldStyle = {
  margin: '5px 0',
};

const labelStyle = {
  margin: '10px 0 5px',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const submitButtonStyle = {
  padding: '10px 15px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const unbookButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

// Destination options for dropdown
const destinationOptions = [
  "Kahathuduwa Interchange",
  "Gelanigama Interchange",
  "Dodangoda Interchange",
  "Welipenna Interchange",
  "Kurudugahahethekma Interchange",
  "Baddegama Interchange",
  "Pinnaduwa Interchange",
  "Imaduwa Interchange",
  "Kokmaduwa Interchange",
  "Godagama Interchange",
  "Godagama - Palatuwa Interchange",
  "Kapuduwa Interchange",
  "Aparekka Interchange",
  "Beliatta Interchange",
  "Bedigama Interchange",
  "Kasagala Interchange",
  "Angunukolapelessa Interchange",
  "Barawakubuka Interchange",
  "Sooriyawewa Interchange",
];

// Role options for dropdown
const roleOptions = ["Student", "Lecturer"];

const SeatDetails = () => {
  const { seatNumber } = useParams();
  const [seatDetails, setSeatDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    enrollmentNum: '',
    journeyType: 'One Way',
    destination: '',
    role: 'Student',
    travelDate1: '', // First travel date for booking
    travelDate2: '', // Second travel date for booking
  });
  const [rebookData, setRebookData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    enrollmentNum: '',
    journeyType: 'One Way',
    destination: '',
    role: 'Student',
    travelDate: '', // Single travel date for rebooking
  });

  useEffect(() => {
    const fetchSeatDetails = async () => {
      try {
        const seatIdNumber = Number(seatNumber);
        const seatsRef = collection(db, 'reservations');
        const q = query(seatsRef, where('seatId', '==', seatIdNumber));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const seatData = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const bookingData = doc.data();
              const userEmail = bookingData.email;

              // Fetch user role based on email
              const userRef = collection(db, 'userdata');
              const userQuery = query(userRef, where('email', '==', userEmail));
              const userSnapshot = await getDocs(userQuery);
              let role = '';
              let enrollmentNum = ''; // Initialize variable for enrollment number

              if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                role = userDoc.data().role; // Assuming 'role' is the field in userdata
                enrollmentNum = userDoc.data().enrollmentNum; 
              }


              return {
                id: doc.id,
                ...bookingData,
                role,// Add role to seat data
                enrollmentNum, 
              };
            })
          );

          setSeatDetails(seatData);
          setIsBooked(true);
        } else {
          setSeatDetails([]);
          setIsBooked(false);
        }
      } catch (error) {
        setError('Error fetching seat details: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatDetails();
  }, [seatNumber]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleDateString();
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }
    return 'Invalid Date';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleRebookChange = (e) => {
    const { name, value } = e.target;
    setRebookData((prevRebookData) => ({
      ...prevRebookData,
      [name]: value,
    }));
  };

  const handleDateInput = (e) => {
    const selectedDate = e.target.value;
    if (isDisabledDate(selectedDate)) {
      alert('Only Saturdays and Tuesdays are available for booking!');
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: '', // Reset invalid date
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: selectedDate, // Update valid date
      }));
    }
  };

  const isDisabledDate = (date) => {
    const day = new Date(date).getDay();
    return day !== 2 && day !== 6; // Disable if not Tuesday (2) or Saturday (6)
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    const {
      email,
      fullName,
      phoneNumber,
      enrollmentNum,
      journeyType,
      destination,
      role,
      travelDate1,
      travelDate2,
    } = formData;

    if (!travelDate1 || isDisabledDate(travelDate1) || !travelDate2 || isDisabledDate(travelDate2)) {
      alert('Please select valid travel dates (Saturdays or Tuesdays only)!');
      return;
    }

    try {
      const seatIdNumber = Number(seatNumber);

      // Check if the seat is already booked for the valid travel dates
      const travelDates = [travelDate1, travelDate2];
      for (const travelDate of travelDates) {
        const q = query(
          collection(db, 'reservations'),
          where('seatId', '==', seatIdNumber),
          where('travelDate', '==', Timestamp.fromDate(new Date(travelDate)))
        );
        const existingBookingSnapshot = await getDocs(q);

        if (!existingBookingSnapshot.empty) {
          alert(`This seat is already booked for ${travelDate}!`);
          return;
        }
      }
      

      // Create unique IDs using email and travel dates
      const seatDocId1 = `${email}_${seatIdNumber}_${new Date(travelDate1)
        .toISOString()
        .split('T')[0]}`;
      const seatDocId2 = `${email}_${seatIdNumber}_${new Date(travelDate2)
        .toISOString()
        .split('T')[0]}`;

      // Book the first travel date
      await setDoc(doc(db, 'reservations', seatDocId1), {
        seatId: seatIdNumber,
        fullName,
        email,
        phoneNumber,
        enrollmentNum,
        journeyType,
        destination,
        role,
        travelDate: Timestamp.fromDate(new Date(travelDate1)),
        seat_state: true,
      });

      // Book the second travel date
      await setDoc(doc(db, 'reservations', seatDocId2), {
        seatId: seatIdNumber,
        fullName,
        email,
        phoneNumber,
        enrollmentNum,
        journeyType,
        destination,
        role,
        travelDate: Timestamp.fromDate(new Date(travelDate2)),
        seat_state: true,
      });

      const userdataRef = doc(db, 'userdata', email);
      await setDoc(
        userdataRef,
        {
          email,
          role,
          enrollmentNum,
          fullName,
          phoneNumber,
        },
        { merge: true }
      );

      // Add the new bookings to the existing seat details
      const newBookings = travelDates.map((travelDate) => ({
        seatId: seatIdNumber,
        fullName,
        email,
        phoneNumber,
        enrollmentNum,
        journeyType,
        destination,
        role,
        travelDate: Timestamp.fromDate(new Date(travelDate)),
      }));

      setSeatDetails((prevDetails) => [...prevDetails, ...newBookings]);

      alert(`Seats booked successfully for ${travelDate1} and ${travelDate2}!`);
      window.location.reload();
    } catch (error) {
      setError('Error booking seat: ' + error.message);
    }
  };

  const handleRebookSeat = async (e) => {
    e.preventDefault();

    const {
      email,
      fullName,
      phoneNumber,
      enrollmentNum,
      journeyType,
      destination,
      role,
      travelDate,
    } = rebookData;

    if (isDisabledDate(travelDate)) {
      alert('Please select a valid travel date (Saturdays or Tuesdays only)!');
      return;
    }

    try {
      const seatIdNumber = Number(seatNumber);

      // Check if the seat is already booked for the travel date
      const q = query(
        collection(db, 'reservations'),
        where('seatId', '==', seatIdNumber),
        where('travelDate', '==', Timestamp.fromDate(new Date(travelDate)))
      );
      const existingBookingSnapshot = await getDocs(q);

      if (!existingBookingSnapshot.empty) {
        alert(`This seat is already booked for ${travelDate}!`);
        return;
      }

      // Rebook the seat
      await setDoc(doc(db, 'reservations', `${email}_${seatIdNumber}_${new Date(travelDate).toISOString().split('T')[0]}`), {
        seatId: seatIdNumber,
        fullName,
        email,
        phoneNumber,
        enrollmentNum,
        journeyType,
        destination,
        role,
        travelDate: Timestamp.fromDate(new Date(travelDate)),
        seat_state: true,
      });

      alert(`Seat ${seatIdNumber} rebooked successfully!`);
      window.location.reload();
    } catch (error) {
      setError('Error rebooking seat: ' + error.message);
    }
  };

  const handleUnbookSeat = async (bookingId) => {
    try {
      await deleteDoc(doc(db, 'reservations', bookingId));
      alert('Seat unbooked successfully!');
      window.location.reload();
    } catch (error) {
      setError('Error unbooking seat: ' + error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Seat Details for Seat #{seatNumber}</h1>
      {loading ? (
        <p>Loading seat details...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : isBooked ? (
        <div>
          <h2>Current Bookings:</h2>
          {seatDetails.map((detail) => (
            <div key={detail.id} style={cardStyle}>
              <p style={fieldStyle}><strong>Full Name:</strong> {detail.fullName}</p>
              <p style={fieldStyle}><strong>Email:</strong> {detail.email}</p>
              <p style={fieldStyle}><strong>Phone Number:</strong> {detail.phoneNumber}</p>
              <p style={fieldStyle}><strong>Enrollment Number:</strong> {detail.enrollmentNum}</p>
              <p style={fieldStyle}><strong>Journey Type:</strong> {detail.journeyType}</p>
              <p style={fieldStyle}><strong>Destination:</strong> {detail.destination}</p>
              <p style={fieldStyle}><strong>Role:</strong> {detail.role}</p>
              <p style={fieldStyle}><strong>Travel Date:</strong> {formatTimestamp(detail.travelDate)}</p>
              <button
                style={unbookButtonStyle}
                onClick={() => handleUnbookSeat(detail.id)}
              >
                Unbook
              </button>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleRegistration}>
          <h2>Book this Seat:</h2>
          <label style={labelStyle}>Full Name:</label>
          <input
            type="text"
            name="fullName"
            style={inputStyle}
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <label style={labelStyle}>Email:</label>
          <input
            type="email"
            name="email"
            style={inputStyle}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label style={labelStyle}>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            style={inputStyle}
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <label style={labelStyle}>Enrollment Number:</label>
          <input
            type="text"
            name="enrollmentNum"
            style={inputStyle}
            value={formData.enrollmentNum}
            onChange={handleChange}
            required
          />
          <label style={labelStyle}>Journey Type:</label>
          <select
            name="journeyType"
            style={inputStyle}
            value={formData.journeyType}
            onChange={handleChange}
            required
          >
            <option value="One Way">One Way</option>
            <option value="Round Trip">Round Trip</option>
          </select>
          <label style={labelStyle}>Destination:</label>
          <select
            name="destination"
            style={inputStyle}
            value={formData.destination}
            onChange={handleChange}
            required
          >
            <option value="">Select Destination</option>
            {destinationOptions.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </select>
          <label style={labelStyle}>Role:</label>
          <select
            name="role"
            style={inputStyle}
            value={formData.role}
            onChange={handleChange}
            required
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <label style={labelStyle}>Travel Date 1:</label>
          <input
            type="date"
            name="travelDate1"
            style={inputStyle}
            value={formData.travelDate1}
            onChange={handleDateInput}
            required
          />
          <label style={labelStyle}>Travel Date 2:</label>
          <input
            type="date"
            name="travelDate2"
            style={inputStyle}
            value={formData.travelDate2}
            onChange={handleDateInput}
            required
          />
          <button style={submitButtonStyle} type="submit">
            Book Seat
          </button>
        </form>
      )}

      {/* Rebooking Section */}
      {isBooked && (
        <form onSubmit={handleRebookSeat}>
          <h2>Rebook this Seat:</h2>
          <label style={labelStyle}>Full Name:</label>
          <input
            type="text"
            name="fullName"
            style={inputStyle}
            value={rebookData.fullName}
            onChange={handleRebookChange}
            required
          />
          <label style={labelStyle}>Email:</label>
          <input
            type="email"
            name="email"
            style={inputStyle}
            value={rebookData.email}
            onChange={handleRebookChange}
            required
          />
          <label style={labelStyle}>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            style={inputStyle}
            value={rebookData.phoneNumber}
            onChange={handleRebookChange}
            required
          />
          <label style={labelStyle}>Enrollment Number:</label>
          <input
            type="text"
            name="enrollmentNum"
            style={inputStyle}
            value={rebookData.enrollmentNum}
            onChange={handleRebookChange}
            required
          />
          <label style={labelStyle}>Journey Type:</label>
          <select
            name="journeyType"
            style={inputStyle}
            value={rebookData.journeyType}
            onChange={handleRebookChange}
            required
          >
            <option value="One Way">One Way</option>
            <option value="Round Trip">Round Trip</option>
          </select>
          <label style={labelStyle}>Destination:</label>
          <select
            name="destination"
            style={inputStyle}
            value={rebookData.destination}
            onChange={handleRebookChange}
            required
          >
            <option value="">Select Destination</option>
            {destinationOptions.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </select>
          <label style={labelStyle}>Role:</label>
          <select
            name="role"
            style={inputStyle}
            value={rebookData.role}
            onChange={handleRebookChange}
            required
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <label style={labelStyle}>Travel Date:</label>
          <input
            type="date"
            name="travelDate"
            style={inputStyle}
            value={rebookData.travelDate}
            onChange={handleRebookChange}
            required
          />
          <button style={submitButtonStyle} type="submit">
            Rebook Seat
          </button>
        </form>
      )}
    </div>
  );
};

export default SeatDetails;
