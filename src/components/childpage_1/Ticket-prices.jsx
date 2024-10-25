import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { collection, setDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Adjust the import path as necessary
import Sidebar from './Sidebar'; // Import the Sidebar component

function TicketPrices() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  // Inline styles
  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5faff',
  };

  const contentContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '250px', // Leave space for the sidebar
  };

  const headerStyle = {
    padding: '20px',
    backgroundColor: '#263043',
    color: 'white',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottom: '4px solid #ffac1c',
  };

  const homeButtonStyle = {
    position: 'absolute',
    right: '20px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    fontSize: '24px',
  };

  const contentStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 100px)',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    width: '100%',
    maxWidth: '1200px',
  };

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const stationNameStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const priceSectionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const priceButtonStyle = {
    backgroundColor: '#ffac1c',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '5px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  // const footerStyle = {
  //   padding: '10px',
  //   backgroundColor: '#263043',
  //   color: 'white',
  //   textAlign: 'center',
  //   fontSize: '14px',
  //   position: 'relative',
  //   bottom: 0,
  //   width: '100%',
  // };

  // Fetch data from Firestore
  useEffect(() => {
    const fetchTicketPrices = async () => {
      try {
        const collectionRef = collection(db, 'ticketPrices');
        const querySnapshot = await getDocs(collectionRef);
        const ticketData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Ensure each document has the exitName field
        ticketData.forEach(async (item) => {
          const docRef = doc(db, 'ticketPrices', item.id);
          await updateDoc(docRef, { exitName: item.id });
        });

        console.log('Fetched ticket prices:', ticketData); // Log fetched data
        setData(ticketData);
      } catch (error) {
        console.error('Error fetching ticket prices: ', error);
      }
    };

    fetchTicketPrices();
  }, []);

  // Function to handle price change
  const handleEditPrice = (index, price) => {
    setEditIndex(index);
    setEditPrice(price);
  };

  // Function to save updated price
  const handleSavePrice = async (id) => {
    try {
      const docRef = doc(db, 'ticketPrices', id);
      await setDoc(docRef, { price: editPrice }, { merge: true });

      // Update local data after saving
      const updatedData = data.map((item, index) =>
        index === editIndex ? { ...item, price: editPrice } : item
      );
      setData(updatedData);
      setEditIndex(null);
      setEditPrice('');
    } catch (error) {
      console.error('Error updating ticket price: ', error);
    }
  };

  return (
    <div style={containerStyle}>
      <Sidebar /> {/* Sidebar component */}
      <div style={contentContainerStyle}>
        <header style={headerStyle}>
          <button onClick={() => navigate('/home')} style={homeButtonStyle}>
            <FaHome />
          </button>
          Ticket Prices
        </header>
        <div style={contentStyle}>
          <div style={gridStyle}>
            {data.length === 0 ? (
              <p>No ticket prices available.</p>
            ) : (
              data.map((item, index) => (
                <div key={item.id} style={cardStyle}>
                  <div style={stationNameStyle}>{item.exitName || item.id}</div>
                  <div style={priceSectionStyle}>
                    {editIndex === index ? (
                      <>
                        <input
                          type="text"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          style={{ flex: 1, marginRight: '10px' }}
                        />
                        <button
                          onClick={() => handleSavePrice(item.id)}
                          style={priceButtonStyle}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <span>KDUSC</span>
                        <button
                          style={priceButtonStyle}
                          onClick={() => handleEditPrice(index, item.price)}
                        >
                          {item.price}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* <footer style={footerStyle}>
          &copy; 2024 Ticket Prices Inc. All rights reserved.
        </footer> */}
      </div>
    </div>
  );
}

export default TicketPrices;
