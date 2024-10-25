import React, { useEffect, useState } from 'react';
import { /*Link*/ useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import './profile.css';
import { 
  BsFillArchiveFill, 
  BsFillGrid3X3GapFill, 
  BsPeopleFill, 
  BsFillBellFill 
} from 'react-icons/bs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { db } from '../../firebase/firebase'; // Import the Firestore database instance
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

function Home() {
  const [seatReservations, setSeatReservations] = useState([]);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [userCount, setUserCount] = useState(0); // Live user count
  const [reservedSeats, setReservedSeats] = useState(0); // Reserved seats count
  const [latestRollover, setLatestRollover] = useState(null); // Latest rollover alert
  const totalSeats = 45; // Total number of seats
  const navigate = useNavigate(); // Use navigate hook for navigation

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationsCollection = collection(db, 'reservations');
      const q = query(reservationsCollection, where('seat_state', '==', true));
      const querySnapshot = await getDocs(q);

      const reservations = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const travelDate = data.travelDate ? new Date(data.travelDate.seconds * 1000).toLocaleDateString() : 'N/A';
        
        return {
          id: doc.id,
          seatNumber: data.seatId || 'N/A',
          destination: data.destination || 'N/A',
          fullName: data.fullName || 'N/A',
          email: data.email || 'N/A',
          phoneNumber: data.phoneNumber || 'N/A',
          // role: data.role || 'N/A',
          travelDate: travelDate, // Format the date here
        };
      });

      setSeatReservations(reservations);
      calculateAvailableSeats(reservations.length);
      setReservedSeats(reservations.length); // Set reserved seat count
    };

    const fetchUserCount = async () => {
      const usersCollection = collection(db, 'userdata');
      const querySnapshot = await getDocs(usersCollection);
      setUserCount(querySnapshot.size); // Set live user count
    };

    const fetchLatestRollover = async () => {
      const rolloverCollection = collection(db, 'TicketRollover');
      const q = query(rolloverCollection, orderBy('date', 'desc'), limit(1)); // Get latest entry by date
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const latestDoc = querySnapshot.docs[0].data();
        const seatNo = latestDoc.seatNo;
        const rolloverDate = new Date(latestDoc.date.seconds * 1000).toLocaleDateString(); // Format date

        setLatestRollover({ seatNo, rolloverDate }); // Set latest rollover data
      }
    };

    fetchReservations();
    fetchUserCount();
    fetchLatestRollover();
  }, []);

  const calculateAvailableSeats = (bookedSeatsCount) => {
    setAvailableSeats(totalSeats - bookedSeatsCount);
  };

  const handleRolloverClick = () => {
    if (latestRollover) {
      navigate(`/childpage_1/seat-details/${latestRollover.seatNo}`); // Navigate to seat details page
    }
  };

  const handleNavigation = (path) => {
    navigate(path); // Function for navigating to specified path
  };

  // Sample chart data
  const data = [
    { name: '1st week', Lectures: 1000, Students: 1000, amt: 1000 },
    { name: '2nd Week', Lectures: 1000, Students: 1398, amt: 1000 },
    { name: '3rd Week', Lectures: 1000, Students: 1800, amt: 1000 },
    { name: '4th Week', Lectures: 1000, Students: 800, amt: 1000 },
  ];

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3 className='Dashboard'>Hello Admin</h3>
      </div>

      <div className='main-cards'>
        <div className='card' onClick={() => handleNavigation('/childpage_1/seat-reservation')}>
          <div className='card-inner'>
            <h3>Seats Available</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>{availableSeats}</h1> {/* Display available seat count */}
        </div>

        <div className='card' onClick={() => handleNavigation('/childpage_1/seat-reservation')}>
          <div className='card-inner'>
            <h3>Reserved Seats</h3>
            <BsFillGrid3X3GapFill className='card_icon' />
          </div>
          <h1>{reservedSeats}</h1> {/* Display reserved seat count */}
        </div>

        <div className='card' onClick={() => handleNavigation('/childpage_1/student-details')}>
          <div className='card-inner'>
            <h3>Active Users</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{userCount}</h1> {/* Display live user count */}
        </div>

        <div className='card' onClick={handleRolloverClick} style={{ cursor: 'pointer' }}> {/* Clickable for navigation */}
          <div className='card-inner'>
            <h3>Rollover Request</h3>
            <BsFillBellFill className='card_icon' />
          </div>
          {latestRollover ? (
            <h1>{`Seat: ${latestRollover.seatNo}`}</h1> // Display latest rollover seat number
          ) : (
            <h1>No Alerts</h1>
          )}
        </div>
      </div>

      <div className='divider'></div> {/* Divider added here */}

      <div className='charts'>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Lectures" fill="#FFA500" />
            <Bar dataKey="Students" fill="#1f536b" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Lectures" stroke="#FFA550" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Students" stroke="#1f536b" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className='divider'></div> {/* Divider added here */}

      <div className='reservations-table'>
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
         
              {/* <th>Status</th> */}
            
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
                
               
                  
                  {/* <td>{reservation.role}</td> */}
                   {/* Display formatted travel date */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No reservations found</td> {/* Updated colSpan to match the number of columns */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Home;
