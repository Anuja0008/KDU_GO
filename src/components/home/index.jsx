import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
  BsFillPersonFill,
} from 'react-icons/bs';
import { db } from '../../firebase/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import BusLocation from '../childpage_1/Bus-location';  // Import the BusLocation component

function Home() {
  const [seatReservations, setSeatReservations] = useState([]);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [reservedSeats, setReservedSeats] = useState(0);
  const [latestRollover, setLatestRollover] = useState(null);
  const [lecturerCount, setLecturerCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const totalSeats = 45;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationsCollection = collection(db, 'reservations');
      const q = query(reservationsCollection, where('seat_state', '==', true));
      const querySnapshot = await getDocs(q);

      const reservations = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const travelDate = data.travelDate
          ? new Date(data.travelDate.seconds * 1000).toLocaleDateString()
          : 'N/A';

        return {
          id: doc.id,
          seatNumber: data.seatId || 'N/A',
          destination: data.destination || 'N/A',
          fullName: data.fullName || 'N/A',
          email: data.email || 'N/A',
          phoneNumber: data.phoneNumber || 'N/A',
          travelDate,
        };
      });

      setSeatReservations(reservations);
      calculateAvailableSeats(reservations.length);
      setReservedSeats(reservations.length);
    };

    const fetchUserCount = async () => {
      const usersCollection = collection(db, 'userdata');
      const querySnapshot = await getDocs(usersCollection);
      setUserCount(querySnapshot.size);
    };

    const fetchLecturerCount = async () => {
      const usersCollection = collection(db, 'userdata');
      const q = query(usersCollection, where('role', '==', 'lecturer'));
      const querySnapshot = await getDocs(q);
      setLecturerCount(querySnapshot.size);
    };

    const fetchStudentCount = async () => {
      const usersCollection = collection(db, 'userdata');
      const q = query(usersCollection, where('role', '==', 'student'));
      const querySnapshot = await getDocs(q);
      setStudentCount(querySnapshot.size);
    };

    const fetchLatestRollover = async () => {
      const rolloverCollection = collection(db, 'TicketRollover');
      const q = query(rolloverCollection, orderBy('date', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const latestDoc = querySnapshot.docs[0].data();
        const seatNo = latestDoc.seatNo;
        const rolloverDate = new Date(latestDoc.date.seconds * 1000).toLocaleDateString();

        setLatestRollover({ seatNo, rolloverDate });
      }
    };

    fetchReservations();
    fetchUserCount();
    fetchLecturerCount();
    fetchStudentCount();
    fetchLatestRollover();
  }, []);

  const calculateAvailableSeats = (bookedSeatsCount) => {
    setAvailableSeats(totalSeats - bookedSeatsCount);
  };

  const handleRolloverClick = () => {
    if (latestRollover) {
      navigate(`/childpage_1/seat-details/${latestRollover.seatNo}`);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3 className="Dashboard">Hello Admin</h3>
      </div>

      <div className="main-cards">
        {/* Cards for available seats, reserved seats, etc. */}
        <div className="card" onClick={() => handleNavigation('/childpage_1/seat-reservation')}>
          <div className="card-inner">
            <h3>Seats Available</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{availableSeats}</h1>
        </div>

        <div className="card" onClick={() => handleNavigation('/childpage_1/seat-reservation')}>
          <div className="card-inner">
            <h3>Reserved Seats</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{reservedSeats}</h1>
        </div>

        <div className="card" onClick={() => handleNavigation('/childpage_1/student-details')}>
          <div className="card-inner">
            <h3>Active Users</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{userCount}</h1>
        </div>

        <div className="card" onClick={handleRolloverClick} style={{ cursor: 'pointer' }}>
          <div className="card-inner">
            <h3>Rollover Request</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          {latestRollover ? (
            <h1>{`Seat: ${latestRollover.seatNo}`}</h1>
          ) : (
            <h1>No Alerts</h1>
          )}
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Number of Lecturers</h3>
            <BsFillPersonFill className="card_icon" />
          </div>
          <h1>{lecturerCount}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Number of Students</h3>
            <BsFillPersonFill className="card_icon" />
          </div>
          <h1>{studentCount}</h1>
        </div>
      </div>

      <div className="divider"></div>

      <div className="reservations-table">
        <h3>Seat Reservations</h3>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Seat Number</th>
              <th>Destination</th>
              <th>Travel Date</th>
            </tr>
          </thead>
          <tbody>
            {seatReservations.length > 0 ? (
              seatReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.fullName}</td>
                  <td>{reservation.email}</td>
                  <td>{reservation.phoneNumber}</td>
                  <td>{reservation.seatNumber}</td>
                  <td>{reservation.destination}</td>
                  <td>{reservation.travelDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No reservations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Integrating the BusLocation component */}
      <div className="bus-location-container">
        <h3>Current Bus Location</h3>
        <BusLocation /> {/* Displaying the bus location */}
      </div>
    </main>
  );
}

export default Home;
