import React, { useState, useEffect } from 'react';
import { FaHome, FaSearch, FaCheckCircle, FaPlusCircle, FaTrashAlt } from 'react-icons/fa';
import { db } from '../../firebase/firebase'; // Import your Firebase config
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './LostAndFound.css'; // Import the CSS file for additional styles

function Lostandfound() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [activeSection, setActiveSection] = useState('lost-items');
  const [lostItems, setLostItems] = useState([]); // Store lost items
  const [foundItems, setFoundItems] = useState([]); // Store found items
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    item: '',
    time: '',
    type: 'lost', // Default to lost item
  });

  // Fetch lost items from Firestore
  useEffect(() => {
    const fetchLostItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'LostItems'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLostItems(items);
    };

    fetchLostItems();
  }, []);

  // Fetch found items from Firestore
  useEffect(() => {
    const fetchFoundItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'FoundItems'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoundItems(items);
    };

    fetchFoundItems();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const collectionName = formData.type === 'lost' ? 'LostItems' : 'FoundItems';

    // Add the form data to Firestore
    try {
      await addDoc(collection(db, collectionName), {
        date: formData.date,
        description: formData.description,
        item: formData.item,
      });
      alert(`${formData.type === 'lost' ? 'Lost' : 'Found'} item submitted successfully!`);
      // Reset the form
      setFormData({ date: '', description: '', item: '', type: 'lost' });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  // Function to delete a lost item
  const deleteLostItem = async (id) => {
    await deleteDoc(doc(db, 'LostItems', id));
    setLostItems(lostItems.filter(item => item.id !== id)); // Update state
  };

  // Function to delete a found item
  const deleteFoundItem = async (id) => {
    await deleteDoc(doc(db, 'FoundItems', id));
    setFoundItems(foundItems.filter(item => item.id !== id)); // Update state
  };

  // Function to clear all documents from LostItems collection
  const clearLostItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'LostItems'));
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, 'LostItems', docSnapshot.id));
    });
    setLostItems([]); // Clear the state
    alert('All lost items have been cleared.');
  };

  // Function to clear all documents from FoundItems collection
  const clearFoundItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'FoundItems'));
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, 'FoundItems', docSnapshot.id));
    });
    setFoundItems([]); // Clear the state
    alert('All found items have been cleared.');
  };

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '250px',
    height: '100%',
    backgroundColor: '#263043',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '2px 0 12px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle = {
    background: '#263043',
    padding: '20px',
    textAlign: 'center',
    fontSize: '25px',
    fontWeight: 'bold',
    position: 'fixed',
    top: 0,
    left: '250px',
    right: 0,
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Poppins, sans-serif',
  };

  const homeIconStyle = {
    cursor: 'pointer',
    fontSize: '32px',
    color: '#fff',
    marginBottom: '30px',
  };

  const buttonStyle = {
    backgroundColor: '#E0E0E0',
    color: '#000',
    padding: '20px',
    margin: '10px 0',
    fontSize: '18px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '200px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const buttonIconStyle = {
    marginRight: '10px',
    fontSize: '24px',
  };


  const contentStyle = {
    marginLeft: '250px',
    padding: '20px',
    marginTop: '80px',
  };

  const renderContent = () => {
    switch (activeSection) {
      case '/childpage_1/Details':
        return (
          <div>
            <h2>Welcome to the Lost and Found System</h2>
            <p>Select an option from the sidebar to continue.</p>
          </div>
        );
      case 'lost-items':
        return (
          <>
            <h2>Lost Items</h2>
            <ul className="item-list">
              {lostItems.map(item => (
                <li key={item.id} className="item-card">
                  <strong>Date:</strong> {item.date} <br />
                  <strong>Item:</strong> {item.item} <br />
                  <strong>Description:</strong> {item.description} <br />
                  <button onClick={() => deleteLostItem(item.id)} className="delete-button">
                    <FaTrashAlt /> Delete
                  </button>
                  <hr />
                </li>
              ))}
            </ul>
            <button onClick={clearLostItems} className="clear-button">
              <FaTrashAlt /> Clear Lost Items
            </button>
          </>
        );
      case 'found-items':
        return (
          <>
            <h2>Found Items</h2>
            <ul className="item-list">
              {foundItems.map(item => (
                <li key={item.id} className="item-card">
                  <strong>Date:</strong> {item.date} <br />
                  <strong>Item:</strong> {item.item} <br />
                  <strong>Description:</strong> {item.description} <br />
                  <button onClick={() => deleteFoundItem(item.id)} className="delete-button">
                    <FaTrashAlt /> Delete
                  </button>
                  <hr />
                </li>
              ))}
            </ul>
            <button onClick={clearFoundItems} className="clear-button">
              <FaTrashAlt /> Clear Found Items
            </button>
          </>
        );
      case 'submit-lost-found':
        return (
          <>
            <h2>Submit Lost/Found Item</h2>
            <form onSubmit={handleSubmit} className="item-form">
              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Item:
                <textarea
                  name="item"
                  value={formData.item}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Type:
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </label>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={sidebarStyle}>
        <FaHome style={homeIconStyle} onClick={() => navigate('/childpage_1/Details')} />
        {/* <button style={buttonStyle} onClick={() => setActiveSection('home')}>
          <FaHome style={buttonIconStyle} /> Home
        </button> */}
        <button style={buttonStyle} onClick={() => setActiveSection('lost-items')}>
          <FaSearch style={buttonIconStyle} /> View Lost Items
        </button>
        <button style={buttonStyle} onClick={() => setActiveSection('found-items')}>
          <FaCheckCircle style={buttonIconStyle} /> View Found Items
        </button>
        <button style={buttonStyle} onClick={() => setActiveSection('submit-lost-found')}>
          <FaPlusCircle style={buttonIconStyle} /> Submit Lost/Found Item
        </button>
      </div>

      <div style={headerStyle}>
        Lost and Found System
      </div>

      <div style={contentStyle}>
        {renderContent()}
      </div>
    </div>
  );
}

export default Lostandfound;
