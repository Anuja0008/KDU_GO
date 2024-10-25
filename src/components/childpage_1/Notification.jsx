import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, setDoc, doc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { MdDelete } from 'react-icons/md';
import Sidebar from './Sidebar'; // Import the Sidebar component

// Notification Component
function Notification() {
  const [notices, setNotices] = useState([]);
  const [notice, setNotice] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchNotices = async () => {
    const noticesCollection = collection(db, 'Notices');
    const noticeSnapshot = await getDocs(noticesCollection);
    const noticesList = noticeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotices(noticesList);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAddNotice = async () => {
    if (notice.trim()) {
      const noticesCollection = collection(db, 'Notices');
      const noticeSnapshot = await getDocs(noticesCollection);
      const newDocId = `doc${noticeSnapshot.docs.length + 1}`;

      const noticeRef = doc(db, 'Notices', newDocId);
      await setDoc(noticeRef, {
        notice,
        date: serverTimestamp(),
      });
      setNotice('');
      fetchNotices();
    }
  };

  const handleDeleteNotice = async (id) => {
    const noticeRef = doc(db, 'Notices', id);
    await deleteDoc(noticeRef);
    fetchNotices();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar /> {/* Include the Sidebar here */}

      <div style={{ flex: '1', marginLeft: '250px', paddingTop: '20px' }}> {/* Adjust main content margin for fixed header */}
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '30px',
          backgroundColor: '#f0f4f8',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 20px)',
        }}>
          {/* Page Heading */}
          <h1 style={{
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#344955',
            marginBottom: '10px',
            width: '100%',
          }}>
             Notices
          </h1>
          
          {/* Full-width separator bar */}
          <hr style={{ border: '2px solid #FFA500', width: '100%',marginBottom:'20px' }} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between', // Adjust to space between elements
            alignItems: 'flex-start',
          }}>
            {/* Left Section - Input form */}
            <div style={{
              width: '50%',
              marginRight: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '30px',
              transition: 'box-shadow 0.3s',
            }}>
              {/* Heading and separator bar */}
              <h2 style={{ textAlign: 'center', fontSize: '28px', margin: '0 0 10px', color: '#344955' }}>
                Add Notice
              </h2>
              <hr style={{ margin: '0 0 20px', border: '1px solid #ddd' }} /> {/* Horizontal separator bar */}

              <textarea
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
                placeholder="Enter notice"
                style={{
                  padding: '15px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  width: '100%',
                  height: '150px',
                  resize: 'none',
                  outline: 'none',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px',
                  transition: 'border-color 0.3s ease',
                }}
              />
              <button
                onMouseDown={() => setIsAdding(true)}
                onMouseUp={() => setIsAdding(false)}
                onMouseLeave={() => setIsAdding(false)}
                onClick={handleAddNotice}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isAdding ? '#4CAF50' : '#5cb85c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  alignSelf: 'center',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  transition: 'background-color 0.3s ease, transform 0.1s ease',
                  marginTop: '10px',
                  transform: isAdding ? 'scale(0.95)' : 'scale(1)',
                }}
              >
                Add Notice
              </button>
            </div>

            {/* Right Section - Published notices */}
            <div style={{
              width: '45%',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '30px',
              transition: 'box-shadow 0.3s',
              maxHeight: '600px', // Set max height for scrollable area
              overflowY: 'auto', // Enable scrolling if content overflows
            }}>
              <h2 style={{ textAlign: 'center', fontSize: '28px', margin: '0 0 10px', color: '#344955' }}>
                Published Notices
              </h2>
              <hr style={{ margin: '0 0 20px', border: '1px solid #ddd' }} /> {/* Horizontal separator bar */}

              {notices.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'gray' }}>No notices available.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {notices.map(({ id, notice, date }) => (
                    <li key={id} style={{
                      padding: '15px',
                      margin: '10px 0',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}>
                      <div style={{ flex: '1' }}>
                        <p style={{ margin: '0 0 5px', fontWeight: 'bold', color: '#2d3748' }}>{notice}</p>
                        <small style={{ color: 'gray' }}>{date?.toDate().toLocaleString()}</small>
                      </div>
                      <button
                        onClick={() => handleDeleteNotice(id)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#e63946',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        <MdDelete />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Notification;
