import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import Sidebar from './Sidebar';

const BusInformation = () => {
  const navigate = useNavigate();
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [newBusInfo, setNewBusInfo] = useState({ Name: '', RegNo: '', Tel: '' });
  const [isAddingNewBus, setIsAddingNewBus] = useState(false);

  const storage = getStorage();

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const busCollection = collection(db, 'BusDetails');
        const busSnapshot = await getDocs(busCollection);
        const busList = busSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBusData(busList);
      } catch (error) {
        console.error("Error fetching bus data: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusData();
  }, []);

  const updateBusDetails = async (id, updatedInfo) => {
    const busDoc = doc(db, 'BusDetails', id);
    await updateDoc(busDoc, updatedInfo);
    const updatedBusData = busData.map(bus => (bus.id === id ? { ...bus, ...updatedInfo } : bus));
    setBusData(updatedBusData);
  };

  const uploadNewImage = async (id) => {
    const bus = busData.find(bus => bus.id === id);
    if (bus?.ImageUrl) {
      const oldImageRef = ref(storage, bus.ImageUrl);
      try {
        await deleteObject(oldImageRef);
      } catch (error) {
        console.error("Error deleting old image: ", error);
      }
    }

    if (newImage) {
      const imageRef = ref(storage, `BusDetails/${newImage.name}`);
      try {
        await uploadBytes(imageRef, newImage);
        const imageUrl = await getDownloadURL(imageRef);
        await updateBusDetails(id, { ImageUrl: imageUrl });
        setNewImage(null);
        setNewBusInfo({ Name: '', RegNo: '', Tel: '' });
      } catch (error) {
        console.error("Error uploading new image: ", error);
      }
    }
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const addNewBus = async () => {
    if (newImage && newBusInfo.Name && newBusInfo.RegNo && newBusInfo.Tel) {
      try {
        const imageRef = ref(storage, `BusDetails/${newImage.name}`);
        await uploadBytes(imageRef, newImage);
        const imageUrl = await getDownloadURL(imageRef);

        const newBusDoc = {
          ...newBusInfo,
          ImageUrl: imageUrl,
        };

        const docRef = await addDoc(collection(db, 'BusDetails'), newBusDoc);
        setBusData([...busData, { id: docRef.id, ...newBusDoc }]);
        setNewBusInfo({ Name: '', RegNo: '', Tel: '' });
        setNewImage(null);
        setIsAddingNewBus(false);
      } catch (error) {
        console.error("Error adding new bus: ", error);
      }
    } else {
      alert('Please fill all fields and select an image.');
    }
  };

  const deleteBus = async (id, imageUrl) => {
    try {
      await deleteDoc(doc(db, 'BusDetails', id));
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      const updatedBusData = busData.filter(bus => bus.id !== id);
      setBusData(updatedBusData);
    } catch (error) {
      console.error('Error deleting bus:', error);
    }
  };

  if (loading) return <p>Loading bus information...</p>;
  if (error) return <p>Error fetching bus information: {error.message}</p>;

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>BUS INFORMATION</h1>
          <div style={styles.iconContainer}>
            <FaHome 
              style={styles.homeIcon} 
              onClick={() => navigate('/home')} 
            />
            <button 
              onClick={() => setIsAddingNewBus(true)} 
              style={styles.addBusButton}
            >
              Add Bus
            </button>
          </div>
        </header>
        
        <main style={styles.mainContent}>
          {isAddingNewBus && (
            <div style={styles.newBusForm}>
              <h2>Add New Bus</h2>
              <input 
                type="text" 
                placeholder="Bus Name" 
                value={newBusInfo.Name}
                onChange={(e) => setNewBusInfo({ ...newBusInfo, Name: e.target.value })} 
                style={styles.input}
              />
              <input 
                type="text" 
                placeholder="Registration No" 
                value={newBusInfo.RegNo}
                onChange={(e) => setNewBusInfo({ ...newBusInfo, RegNo: e.target.value })} 
                style={styles.input}
              />
              <input 
                type="text" 
                placeholder="Telephone" 
                value={newBusInfo.Tel}
                onChange={(e) => setNewBusInfo({ ...newBusInfo, Tel: e.target.value })} 
                style={styles.input}
              />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={styles.input}
              />
              <button 
                onClick={addNewBus} 
                style={styles.button}
              >
                Add Bus
              </button>
            </div>
          )}
          <div style={styles.busList}>
            {busData.map(bus => (
              <div key={bus.id} style={styles.busCard}>
                <img src={bus.ImageUrl} alt={bus.Name} style={styles.busImage} />
                <input 
                  type="text" 
                  value={bus.Name} 
                  onChange={(e) => updateBusDetails(bus.id, { Name: e.target.value })} 
                  style={styles.input} 
                />
                <input 
                  type="text" 
                  value={bus.RegNo} 
                  onChange={(e) => updateBusDetails(bus.id, { RegNo: e.target.value })} 
                  style={styles.input} 
                />
                <input 
                  type="text" 
                  value={bus.Tel} 
                  onChange={(e) => updateBusDetails(bus.id, { Tel: e.target.value })} 
                  style={styles.input} 
                />

                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  style={styles.input}
                />
                <button 
                  onClick={() => uploadNewImage(bus.id)} 
                  style={styles.button}
                >
                  Update Image
                </button>
                <button 
                  onClick={() => deleteBus(bus.id, bus.ImageUrl)} 
                  style={styles.deleteButton}
                >
                   Delete
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  content: {
    marginLeft: '250px', // Leave space for the sidebar
    padding: '20px',
    flex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '5px solid #e67e22',
    paddingBottom: '10px',
  },
  headerTitle: {
    fontSize: '24px',
  },
  iconContainer: {
    display: 'flex',
    gap: '20px',
  },
  homeIcon: {
    cursor: 'pointer',
  },
  addBusButton: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  mainContent: {
    marginTop: '20px',
  },
  newBusForm: {
    marginBottom: '20px',
  },
  input: {
    display: 'block',
    margin: '10px 0',
    padding: '8px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  busList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  busCard: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '15px',
    width: '200px',
    textAlign: 'center',
  },
  busImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  deleteButton: {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
};

export default BusInformation;
