import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaTrashAlt } from 'react-icons/fa'; // Import the trash icon for delete

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userdata")); 
        const studentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
        setStudents(studentList);
      } catch (err) {
        setError(`Error fetching student data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Filter students based on the role
  const filteredStudents = students.filter(student => student.role === 'student');

  // Function to handle deletion of a student document
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "userdata", id)); // Delete the document by ID
      setStudents(prevStudents => prevStudents.filter(student => student.id !== id)); // Remove from local state
    } catch (err) {
      setError(`Error deleting student: ${err.message}`);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.headerText}>Student Details</h2>
        <FaHome 
          style={styles.homeIcon} 
          onClick={() => navigate('/childpage_1/center-details')}
        />
      </header>
      <main style={styles.mainContent}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Enrollment Number</th>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone Number</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Actions</th> {/* New Actions column */}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td style={styles.td}>{student.enrollmentNum}</td>
                  <td style={styles.td}>{student.fullName}</td>
                  <td style={styles.td}>{student.email}</td>
                  <td style={styles.td}>{student.phoneNumber}</td>
                  <td style={styles.td}>{student.role}</td>
                  <td style={styles.td}>
                    <FaTrashAlt 
                      style={styles.deleteIcon} 
                      onClick={() => handleDelete(student.id)} 
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={styles.noData}>No student data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 Your Company Name</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    width: '100%',
    position: 'fixed',
    left: 0,
    top: 0,
    textAlign: 'center',
    backgroundColor: '#263043',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    margin: 0,
    color: '#fff',
    fontSize: '24px',
  },
  homeIcon: {
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    marginRight: '20px',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    marginTop: '80px', // Increased margin to make room for the fixed header
    overflowY: 'auto', // Make content scrollable
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    backgroundColor: '#ffac1c',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    color: '#333',
  },
  noData: {
    textAlign: 'center',
    color: '#888',
    padding: '10px',
  },
  deleteIcon: {
    color: 'red',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px',
  },
  footer: {
    width: '100%',
    backgroundColor: '#263043',
    textAlign: 'center',
    padding: '15px',
    position: 'relative',
    bottom: 0,
  },
  footerText: {
    margin: '0',
    fontSize: '14px',
  },
};

export default StudentDetails;
