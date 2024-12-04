import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Sidebar from './Sidebar'; // Import Sidebar component
import { db } from '../../firebase/firebase'; // Import Firestore instance

function QR() {
  const [reservations, setReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State to hold search query

  // Fetch reservations data from Firestore
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsRef = collection(db, 'reservations');
        const q = query(reservationsRef, where('checked', '==', true)); // Query for checked reservations
        const querySnapshot = await getDocs(q);

        const fetchedReservations = [];
        for (const doc of querySnapshot.docs) {
          const reservationData = { id: doc.id, ...doc.data() };
          // Fetch enrollmentNum from userdata collection based on email
          const enrollmentNum = await fetchEnrollmentNum(reservationData.email);
          fetchedReservations.push({ ...reservationData, enrollmentNum });
        }

        console.log('Fetched Reservations:', fetchedReservations); // Log fetched reservations
        setReservations(fetchedReservations); // Set the state with fetched reservations
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    const fetchEnrollmentNum = async (email) => {
      const userdataRef = collection(db, 'userdata');
      const q = query(userdataRef, where('email', '==', email)); // Query userdata by email
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        return userDoc.enrollmentNum; // Return the enrollmentNum if found
      }
      return null; // Return null if not found
    };

    fetchReservations();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Filter reservations by email based on search query
  const filteredReservations = reservations.filter((reservation) =>
    reservation.email.toLowerCase().includes(searchQuery)
  );

  // Inline CSS styles for the full layout
  const layoutStyle = {
    display: 'flex', // Flex layout for sidebar and content
    height: '100vh', // Full viewport height for the layout
  };

  // Inline CSS styles for the sidebar
  const sidebarStyle = {
    width: '250px', // Fixed width for the sidebar
    backgroundColor: '#1b263b', // Sidebar background color
    height: '100vh', // Ensure the sidebar takes up the full viewport height
  };

  // Inline CSS styles for the main content area
  const contentStyle = {
    flexGrow: 1, // Make the content area take up the remaining space
    padding: '20px', // Padding for the content
    backgroundColor: '#ffffff', // Set background to white
    boxShadow: 'none', // Remove any box shadow
  };

  // Inline CSS styles for the "Seat Checking" heading
  const headingStyle = {
    fontSize: '1.8rem', // Font size for the heading text
    marginBottom: '10px', // Margin below the heading
  };

  // Inline CSS styles for the divider
  const dividerStyle = {
    height: '5px', // Height of the divider
    backgroundColor: '#FFA500', // Color of the divider
    marginBottom: '20px', // Margin below the divider
  };

  // Inline CSS styles for the table
  const tableStyle = {
    width: '100%', // Full width for the table
    borderCollapse: 'collapse', // Collapse borders for a cleaner look
  };

  const thStyle = {
    border: '1px solid #ddd', // Border for table header
    padding: '8px', // Padding for table header
    backgroundColor: '#f2f2f2', // Light gray background for table header
    textAlign: 'left', // Align text to the left
  };

  const tdStyle = {
    border: '2px solid #ddd', // Border for table cells
    padding: '8px', // Padding for table cells
  };

  return (
    <div style={layoutStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div style={contentStyle}>
        {/* Seat Checking Heading */}
        <h1 style={headingStyle}>Seat Checking</h1>

        {/* Divider */}
        <div style={dividerStyle}></div>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search by email"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ padding: '10px', marginBottom: '20px', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}
        />

        {/* Reservations Table */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Enrollment Number</th>
              <th style={thStyle}>Full Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Destination</th>
              <th style={thStyle}>Seat ID</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Seat Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => {
                // Check if reservation.date is a Firestore timestamp
                const reservationDate = reservation.date ? new Date(reservation.date.seconds * 1000) : new Date();

                return (
                  <tr key={reservation.id}>
                    <td style={tdStyle}>{reservation.enrollmentNum || 'N/A'}</td>
                    <td style={tdStyle}>{reservation.fullName}</td>
                    <td style={tdStyle}>{reservation.email}</td>
                    <td style={tdStyle}>{reservation.destination}</td>
                    <td style={tdStyle}>{reservation.seatId}</td>
                    <td style={tdStyle}>
                      {new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'long',
                        timeStyle: 'medium',
                        timeZone: 'UTC',
                        hour12: true,
                      }).format(reservationDate)}
                    </td>
                    <td style={tdStyle}>{reservation.checked ? 'Used' : 'Not Used'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={tdStyle}>No reservations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QR;
