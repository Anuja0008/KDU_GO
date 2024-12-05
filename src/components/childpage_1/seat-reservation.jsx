import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BsFillArchiveFill, BsFillTelephoneFill,BsFillEnvelopeFill,BsCalendarWeek,BsQrCodeScan } from 'react-icons/bs';
import { FaHome, FaMapMarkerAlt, FaBell } from 'react-icons/fa';

const TOTAL_SEAT_COUNT = 45;

const SeatReservation = () => {
  const [seatData, setSeatData] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [availableSeatCount, setAvailableSeatCount] = useState(TOTAL_SEAT_COUNT);
  const [bookedSeatCount, setBookedSeatCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'reservations'));
        const seats = {};
        const destinationCounts = {};
        let bookedCount = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const seatId = data.seatId;

          if (seatId) {
            // Count each seat only once
            if (!seats[seatId]) {
              seats[seatId] = data.seat_state;

              if (data.seat_state) {
                bookedCount++;
                const normalizedDestination = data.destination ? data.destination.trim().toLowerCase() : '';

                if (normalizedDestination) {
                  if (!destinationCounts[normalizedDestination]) {
                    destinationCounts[normalizedDestination] = {
                      count: 1,
                      fullNames: [data.fullName],
                      originalName: data.destination,
                    };
                  } else {
                    destinationCounts[normalizedDestination].count++;
                    destinationCounts[normalizedDestination].fullNames.push(data.fullName);
                  }
                }
              }
            }
          }
        });

        setSeatData(seats);
        setBookedSeatCount(bookedCount);
        setAvailableSeatCount(TOTAL_SEAT_COUNT - bookedCount);

        const destinationList = Object.entries(destinationCounts).map(([_, info]) => ({
          destination: info.originalName,
          count: info.count,
          fullNames: info.fullNames,
        }));

        setDestinations(destinationList);
      } catch (error) {
        console.error('Error fetching seat data:', error);
      }
    };

    fetchSeats();
  }, []);

  const makeAllSeatsAvailable = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reservations'));
      const deletePromises = querySnapshot.docs.map((seatDoc) => deleteDoc(doc(db, 'reservations', seatDoc.id)));
      await Promise.all(deletePromises);
      setSeatData({});
      setAvailableSeatCount(TOTAL_SEAT_COUNT);
      setBookedSeatCount(0);
      setDestinations([]);
      alert('All seats have been set to available, and reservations have been deleted.');
    } catch (error) {
      console.error('Error setting all seats to available and deleting documents:', error);
    }
  };

  const handleSeatClick = (seatNumber) => {
    if (seatNumber) {
      navigate(`/childpage_1/seat-details/${seatNumber}`);
    }
  };

  const seatStyle = (seatNumber) => {
    const isBooked = seatData[seatNumber];
    return {
      width: '45px',
      height: '45px',
      backgroundColor: isBooked ? '#FFA500' : '#E0F7FA',
      border: seatNumber <= 20 ? '2px solid #FF3D00' : '1px solid #004D40',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'background-color 0.3s, transform 0.3s',
      transform: 'scale(1.05)',
      fontSize: '1rem',
      color: isBooked ? '#FFF' : '#000',
    };
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('KDU_go Staff Bus Management System', 10, 10);
    doc.setFontSize(14);

    let yOffset = 20;
    doc.text('Destination Report', 10, yOffset);
    yOffset += 10;

    if (destinations.length > 0) {
      destinations.forEach((dest, index) => {
        doc.text(`${index + 1}. ${dest.destination} - ${dest.count} reservation(s)`, 10, yOffset);
        yOffset += 10;
        doc.text('', 10, yOffset);
        yOffset += 10;
        dest.fullNames.forEach((name, nameIndex) => {
          doc.text(`  ${nameIndex + 1}. ${name}`, 20, yOffset);
          yOffset += 10;
        });
      });
    } else {
      doc.text('No destinations booked.', 10, yOffset);
      yOffset += 10;
    }

    doc.save('KDU_go_Staff_Bus_Management_System_Destination_Report.pdf');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5', color: '#333', fontFamily: 'Times New Roman, serif' }}>
      <header style={{ height: '70px', backgroundColor: '#263043', padding: '15px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#FFAC1C' }}>
          Seat Reservation
        </h1>

        {/* Icon container aligned to the right */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <FaHome onClick={() => navigate('/home')} style={{ fontSize: '28px', cursor: 'pointer', transition: 'color 0.3s', color: '#fff' }} />
          <FaMapMarkerAlt onClick={() => navigate('/location')} style={{ fontSize: '28px', cursor: 'pointer', transition: 'color 0.3s', color: '#fff' }} />
          <FaBell onClick={() => navigate('/childpage_1/Notification')} style={{ fontSize: '28px', cursor: 'pointer', transition: 'color 0.3s', color: '#fff' }} />
          <BsFillArchiveFill onClick={() => navigate('/childpage_1/center-details')} style={{ fontSize: '28px', cursor: 'pointer', transition: 'color 0.3s', color: '#fff' }} />
          <BsFillTelephoneFill onClick={() => navigate('/childpage_1/Details')} style={{ fontSize: '28px', cursor: 'pointer', transition: 'color 0.3s', color: '#fff' }} />
          <BsCalendarWeek onClick={() => navigate('/childpage_1/Rollover')} style={{ fontSize: '28px', cursor: 'pointer', transition: 'color 0.3s', color: '#fff' }} />
          <BsQrCodeScan  onClick={() => navigate('/childpage_1/Qr')} style={{ fontSize: '28px', cursor: 'pointer', transition: 'color 0.3s', color: '#fff' }} />
          <BsFillEnvelopeFill  onClick={() => navigate('/childpage_1/Mail')} style={{ fontSize: '28px', cursor: 'pointer', transition: 'color 0.3s', color: '#fff' }} />
               
        </div>
      </header>
      <main style={{ flexGrow: 1, padding: '30px', display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: 2, maxWidth: '900px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Available Seats: {availableSeatCount}</h2>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Booked Seats: {bookedSeatCount}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '10px', marginTop: '20px' }}>
            {Array.from({ length: TOTAL_SEAT_COUNT }, (_, i) => {
              const seatNumber = i + 1;
              return (
                <div
                  key={seatNumber}
                  style={seatStyle(seatNumber)}
                  onClick={() => handleSeatClick(seatNumber)}
                >
                  {seatNumber}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={makeAllSeatsAvailable} style={{ backgroundColor: '#FF3D00', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
              Make All Seats Available
            </button>
            <button onClick={generatePDF} style={{ backgroundColor: '#007BFF', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
              Generate PDF
            </button>
          </div>
        </div>

        {/* Scrollable destination details section */}
        <div style={{ flex: 1, maxHeight: '600px', marginLeft: '20px', padding: '20px', overflowY: 'scroll', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Destination Details</h2>
          {destinations.length > 0 ? (
            destinations.map((dest, index) => (
              <div key={index} style={{ marginBottom: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px' }}>
                <strong>{dest.destination}</strong> - {dest.count} reservation(s)
                <ul style={{ paddingLeft: '20px', margin: '10px 0 0 0' }}>
                  {dest.fullNames.map((name, nameIndex) => (
                    <li key={nameIndex}>{name}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No destinations booked.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SeatReservation;
