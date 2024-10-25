import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { db } from '../../firebase/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const LecturerView = () => {
  const navigate = useNavigate();
  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userCollection = collection(db, 'userdata');
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role === 'lecturer');

      setLecturers(userList);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const lecturerDoc = doc(db, 'userdata', id);
    await deleteDoc(lecturerDoc);
    setLecturers(lecturers.filter(lecturer => lecturer.id !== id));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}> {/* Full height for the view */}
      <Sidebar />
      <div style={{ flex: 1, textAlign: 'center', marginTop: '30px', marginLeft: '155px' }}>
        <div style={styles.header}>
          <h1 style={{ marginBottom: '5px', fontSize: '28px' }}>Lecturer Registration</h1>
          <div style={styles.lecturerCount}>Count: {lecturers.length}</div>
          <button onClick={() => navigate(-1)} style={styles.goBackButton}>Go Back</button>
        </div>
        <hr style={{ width: '100%', border: '2px solid #e0af0b', margin: '0' }} />

        {/* Scrollable area for the table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Enrollment No.</th>
                <th style={styles.tableHeader}>Department</th>
                <th style={styles.tableHeader}>Phone</th>
                <th style={styles.tableHeader}>Date</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lecturers.map(lecturer => (
                <tr key={lecturer.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{lecturer.fullName}</td>
                  <td style={styles.tableCell}>{lecturer.email}</td>
                  <td style={styles.tableCell}>{lecturer.enrollmentNum}</td>
                  <td style={styles.tableCell}>{lecturer.departmentName}</td>
                  <td style={styles.tableCell}>{lecturer.phoneNumber}</td>
                  <td style={styles.tableCell}>{lecturer.date}</td>
                  <td style={styles.tableCell}>
                    <button 
                      onClick={() => handleDelete(lecturer.id)} 
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Styles for table and header
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '0 20px',
    marginLeft: '550px'
  },
  lecturerCount: {
    fontSize: '16px',
    color: '#333',
  },
  goBackButton: {
    backgroundColor: '#089632',
    color: '#fff',
    border: 'none',
    padding: '10px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tableContainer: {
    maxHeight: '400px', // Set a max height for the scrollable area
    overflowY: 'auto', // Enable vertical scrolling
    margin: '0 auto', // Center the table horizontally
    marginTop: '20px', // Space above the table
  },
  table: {
    width: '80%',
    margin: '20px auto',
    borderCollapse: 'collapse',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#e0af0b',
    color: '#fff',
    padding: '12px 15px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  tableRow: {
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #ccc',
  },
  tableCell: {
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '14px',
    color: 'black',
  },
};

export default LecturerView;
