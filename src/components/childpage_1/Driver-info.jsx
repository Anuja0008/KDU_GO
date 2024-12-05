import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Loading spinner
import Sidebar from './Sidebar'; // Import the Sidebar component
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DriverDetails = () => {
  const navigate = useNavigate();
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [busName, setBusName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [tel, setTel] = useState('');
  const [deletingId, setDeletingId] = useState(null); // Track the ID of the driver to be deleted
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Track confirmation modal

  const storage = getStorage();

  // Fetch driver details from Firestore
  const fetchDriverDetails = async () => {
    try {
      const driverCollection = collection(db, 'DriverDetails');
      const driverSnapshot = await getDocs(driverCollection);
      const driverList = driverSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBusData(driverList);
    } catch (error) {
      console.error("Error fetching driver details: ", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverDetails();
  }, []);

  const updateBusDetails = async (id, updatedInfo) => {
    const driverDoc = doc(db, 'DriverDetails', id);
    await updateDoc(driverDoc, updatedInfo);
    const updatedBusData = busData.map(bus => (bus.id === id ? { ...bus, ...updatedInfo } : bus));
    setBusData(updatedBusData);
  };

  const uploadNewImage = async (id) => {
    const bus = busData.find(bus => bus.id === id);
    if (bus?.ImageUrl) {
      const oldImageRef = ref(storage, bus.ImageUrl);
      try {
        await deleteObject(oldImageRef);  // Delete the old image if a new image is uploaded
      } catch (error) {
        console.error("Error deleting old image: ", error);
      }
    }

    if (newImage) {
      const imageRef = ref(storage, `DriverDetails/${newImage.name}`);
      try {
        await uploadBytes(imageRef, newImage);
        const imageUrl = await getDownloadURL(imageRef);
        await updateBusDetails(id, { ImageUrl: imageUrl });  // Update only the ImageUrl field
        setNewImage(null);
      } catch (error) {
        console.error("Error uploading new image: ", error);
      }
    }
  };

  const deleteDriver = async (id) => {
    const driverDoc = doc(db, 'DriverDetails', id);
    try {
      await deleteDoc(driverDoc);  // Delete the driver document
      const updatedBusData = busData.filter(bus => bus.id !== id);
      setBusData(updatedBusData);
      setShowConfirmDelete(false);  // Close the confirmation modal
    } catch (error) {
      console.error("Error deleting driver: ", error);
    }
  };

  const addNewDriver = async () => {
    try {
      const newDriverRef = await addDoc(collection(db, 'DriverDetails'), {
        Name: busName,
        RegNo: regNo,
        Tel: tel,
        ImageUrl: ''  // No image initially
      });

      if (newImage) {
        const imageRef = ref(storage, `DriverDetails/${newImage.name}`);
        await uploadBytes(imageRef, newImage);
        const imageUrl = await getDownloadURL(imageRef);
        await updateBusDetails(newDriverRef.id, { ImageUrl: imageUrl });
      }

      setBusName('');
      setRegNo('');
      setTel('');
      setNewImage(null);
      fetchDriverDetails();
    } catch (error) {
      console.error("Error adding new driver: ", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowConfirmDelete(true);
  };

  if (loading) return <p style={styles.loading}><AiOutlineLoading3Quarters className="spinner" /> Loading driver information...</p>;
  if (error) return <p>Error fetching driver information: {error.message}</p>;

  return (
    <div style={styles.container}>
      <Sidebar /> {/* Add the sidebar here */}
      <div style={styles.content}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>Driver Information</h1>
             <FaHome 
              style={styles.homeIcon} 
              onClick={() => navigate('/childpage_1/center-details')} 
            />
            
            <button 
              onClick={addNewDriver} 
              style={styles.addDriverButton}
            >
              Add Driver
            </button>
          </div>
          <div style={styles.topBar}></div> {/* Top bar */}
        </header>
        <div style={styles.bottomBar}></div> {/* Bottom bar */}
        
        <main style={styles.mainContent}>
          <div style={styles.busList}>
            {busData.map(bus => (
              <div key={bus.id} style={styles.busCard}>
                <img src={bus.ImageUrl} alt={bus.Name} style={styles.busImage} />
                <h2 style={styles.busName}>{bus.Name}</h2>
                <p style={styles.busDetails}>Reg No: {bus.RegNo}</p>
                <p style={styles.busDetails}>Tel: {bus.Tel}</p>

                {/* Update Name */}
                <input 
                  type="text" 
                  placeholder="New Name" 
                  value={busName} 
                  onChange={(e) => setBusName(e.target.value)} 
                  style={styles.input}
                />
                <button 
                  onClick={() => busName && updateBusDetails(bus.id, { Name: busName })} 
                  style={{ ...styles.button, ...styles.updateButton }}
                >
                  Update Name
                </button>

                {/* Update Reg No */}
                <input 
                  type="text" 
                  placeholder="New Reg No" 
                  value={regNo} 
                  onChange={(e) => setRegNo(e.target.value)} 
                  style={styles.input}
                />
                <button 
                  onClick={() => regNo && updateBusDetails(bus.id, { RegNo: regNo })} 
                  style={{ ...styles.button, ...styles.updateButton }}
                >
                  Update Reg No
                </button>

                {/* Update Tel */}
                <input 
  type="text" 
  placeholder="New Tel" 
  value={tel} 
  onChange={(e) => {
    const value = e.target.value;
    // Allow only digits and ensure the length doesn't exceed 10
    if (/^\d{0,10}$/.test(value)) {
      setTel(value);
    }
  }} 
  maxLength={10}
  style={styles.input}
/>

                <button 
                  onClick={() => tel && updateBusDetails(bus.id, { Tel: tel })} 
                  style={{ ...styles.button, ...styles.updateButton }}
                >
                  Update Tel
                </button>

                {/* Image upload */}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setNewImage(e.target.files[0])} 
                  style={styles.input}
                />
                <button 
                  onClick={() => uploadNewImage(bus.id)} 
                  style={{ ...styles.button, ...styles.updateButton }}
                >
                  Upload New Image
                </button>

                {/* Delete Button */}
                <button 
                  onClick={() => handleDeleteClick(bus.id)} 
                  style={{ ...styles.button, ...styles.deleteButton }}
                >
                  Delete Driver
                </button>
              </div>
            ))}
          </div>

          {/* Confirmation Modal */}
          {showConfirmDelete && (
            <div style={styles.modal}>
              <p>Are you sure you want to delete this driver?</p>
              <button onClick={() => deleteDriver(deletingId)} style={styles.confirmButton}>Yes</button>
              <button onClick={() => setShowConfirmDelete(false)} style={styles.cancelButton}>No</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Styles for DriverDetails
const styles = {
  container: {
    display: 'flex',
  },
  content: {
    marginLeft: '250px', // Adjust based on the sidebar width
    flex: 1,
    padding: '20px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  headerTitle: {
    fontSize: '24px',
    color: '#333',
  },
  addDriverButton: {
    padding: '10px 20px',
    backgroundColor: '#FFA500',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    
  },
  homeIcon: {
    cursor: 'pointer',
    fontSize:'30px',
    marginLeft:'85px'
  },
  topBar: {
    height: '5px',
    backgroundColor: '#e67e22', // Change to your desired color
    marginBottom: '10px',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  loading: {
    fontSize: '20px',
    textAlign: 'center',
  },
  busList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  busCard: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    width: '200px',
  },
  busImage: {
    width: '100%',
    height: 'auto',
  },
  busName: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  busDetails: {
    fontSize: '14px',
    color: '#777',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '8px 15px',
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    marginBottom: '5px',
  },
  updateButton: {
    backgroundColor: '#babfba',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  confirmButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default DriverDetails;
