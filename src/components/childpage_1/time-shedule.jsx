import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { db } from '../../firebase/firebase'; // Adjust the import path as needed
import { collection, getDocs, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore'; // Import Timestamp

function TimeSchedule() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedInterchange, setSelectedInterchange] = useState('');
  const [newTime, setNewTime] = useState('');

  const interchanges = [
    'Kahathuduwa Interchange',
    'Gelanigama Interchange',
    'Dodangoda Interchange',
    'Welipenna Interchange',
    'Kurudugahahethekma Interchange',
    'Baddegama Interchange',
    'Pinnaduwa Interchange',
    'Imaduwa Interchange',
    'Kokmaduwa Interchange',
    'Godagama Interchange',
    'Godagama - Palatuwa Interchange',
    'Kapuduwa Interchange',
    'Aparekka Interchange',
    'Beliatta Interchange',
    'Bedigama Interchange',
    'Kasagala Interchange',
    'Angunukolapelessa Interchange',
    'Barawakubuka Interchange',
    'Sooriyawewa Interchange',
  ];

  // Fetch schedule data from Firestore
  const fetchScheduleData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Buscheduling'));
      const data = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          name: doc.data().name,
          time: doc.data().time?.toDate ? doc.data().time.toDate().toLocaleTimeString() : doc.data().time,
        }))
        .sort((a, b) => parseInt(a.id) - parseInt(b.id)); // Sort by document ID in ascending order

      setScheduleData(data);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchScheduleData();
  }, []);

  // Get the next numeric ID for a new schedule entry
  const getNextId = async () => {
    const querySnapshot = await getDocs(collection(db, 'Buscheduling'));
    const ids = querySnapshot.docs.map(doc => parseInt(doc.id)).filter(id => !isNaN(id)); // Get numeric IDs
    const maxId = Math.max(0, ...ids); // Find the maximum ID, default to 0 if no docs exist
    return maxId + 1; // Return the next ID
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      const newId = await getNextId(); // Get the next numeric ID
      
      // Convert newTime (which is in 'HH:mm' format) into a Date object
      const [hours, minutes] = newTime.split(':');
      const date = new Date();
      date.setHours(hours, minutes);

      // Store time as a Firestore Timestamp
      const timestamp = Timestamp.fromDate(date);

      await setDoc(doc(db, 'Buscheduling', newId.toString()), {
        name: selectedInterchange,
        time: timestamp, // Store as Firestore Timestamp
      });

      // Clear input fields after successful addition
      setSelectedInterchange('');
      setNewTime('');
      
      // Fetch updated schedule data
      fetchScheduleData();
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteDoc(doc(db, 'Buscheduling', id));
      // Fetch updated schedule data after deletion
      fetchScheduleData();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  return (
    <div>
      <header style={styles.header}>
        <h1 style={styles.title}>Time Schedule</h1>
        <button 
          style={styles.backButton} 
          onClick={() => navigate(-1)} // Go back to the previous page
        >
          Go Back
        </button>
      </header>
      
      <div style={styles.scheduleContainer}>
        <form onSubmit={handleAddSchedule} style={styles.addForm}>
          <select
            value={selectedInterchange}
            onChange={(e) => setSelectedInterchange(e.target.value)}
            required
            style={styles.select}
          >
            <option value="" disabled>Select Interchange</option>
            {interchanges.map((interchange, index) => (
              <option key={index} value={interchange}>
                {interchange}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.addButton}>Add Schedule</button>
        </form>

        <div style={styles.tableContainer}> {/* Wrapping container for scrollability */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Interchange</th>
                <th style={styles.tableHeader}>Arrival Time</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.length > 0 ? (
                scheduleData.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.tableCell}>{item.name}</td>
                    <td style={styles.tableCell}>{item.time}</td>
                    <td style={styles.tableCell}>
                      <button 
                        onClick={() => handleDeleteSchedule(item.id)} 
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={styles.tableCell}>No schedule available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: '#263043',
    padding: '10px',
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between', // Align items
    alignItems: 'center', // Center vertically
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  backButton: {
    backgroundColor: '#1ea60c',
    color: '#3E3E3E',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  scheduleContainer: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  addForm: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    flex: '1',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    flex: '1',
  },
  addButton: {
    padding: '10px 15px',
    backgroundColor: '#FFA500',
    color: '#3E3E3E',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  tableContainer: {
    maxHeight: '400px', // Set a max height for the table container
    overflowY: 'auto', // Allow vertical scrolling if needed
    border: '1px solid #ccc', // Optional styling for the table container
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#FFA500',
    color: 'white',
    padding: '10px',
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'center',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#FF6347',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default TimeSchedule;
