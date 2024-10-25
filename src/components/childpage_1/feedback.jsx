import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase'; // Adjust the path according to your file structure
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { AiOutlineHome } from 'react-icons/ai'; // Importing home icon
import Sidebar from './Sidebar'; // Adjust the path according to your file structure

const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const feedbackCollection = collection(db, "Feedback");
        const feedbackSnapshot = await getDocs(feedbackCollection);
        const feedbackList = feedbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Extract relevant fields: contactInfo, fullName, description
        const filteredFeedback = feedbackList.map(({ contactInfo, fullName, description }) => ({
          contactInfo,
          fullName,
          description
        }));

        setFeedbackData(filteredFeedback);
      } catch (error) {
        setError("Failed to fetch feedback data");
        console.error("Error fetching feedback data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, []);

  const clearFeedbackData = async () => {
    try {
      const feedbackCollection = collection(db, "Feedback");
      const feedbackSnapshot = await getDocs(feedbackCollection);

      // Delete each document in the collection
      await Promise.all(feedbackSnapshot.docs.map(doc => deleteDoc(doc.ref)));

      // Clear local state
      setFeedbackData([]);
      alert("All feedback documents have been cleared.");
    } catch (error) {
      console.error("Error clearing feedback data:", error);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red', textAlign: 'center' }}>{error}</h2>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
      <Sidebar /> {/* Include the Sidebar here */}
      
      <div style={{ flex: 1, padding: '20px' }}> {/* Main content area */}
        {/* Header */}
        <header
          style={{
            backgroundColor: '#263043',
            color: '#fff',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop:'-20px',
            marginRight:'-65px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '24px' }}>Feedback System</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              style={{ 
                marginRight: '10px', 
                cursor: 'pointer', 
                backgroundColor: '#FFAC1C', 
                border: 'none', 
                borderRadius: '5px', 
                padding: '10px 15px',
                color: '#fff',
                fontWeight: 'bold',
                transition: 'background-color 0.3s',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0960d'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFAC1C'}
              onClick={clearFeedbackData}
            >
              Clear All Feedback
            </button>
            <a href="/home" style={{ color: '#fff' }}>
              <AiOutlineHome size={24} />
            </a>
          </div>
        </header>

        <main style={{ maxWidth: "800px", margin: "20px auto", padding: "20px", backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ marginBottom: '20px', fontSize: '28px', color: '#263043' }}>Feedback Data</h1>
          {feedbackData.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>No feedback data available.</p>
          ) : (
            <div>
              {feedbackData.map((feedback, index) => (
                <div 
                  key={feedback.id} 
                  style={{ 
                    border: '1px solid #ccc', 
                    padding: '15px', 
                    margin: '10px 0', 
                    borderRadius: '5px', 
                    backgroundColor: '#fafafa', 
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3 style={{ margin: '0 0 10px 0', color: '#FFAC1C' }}>Feedback Document {index + 1}</h3>
                  <p><strong>Full Name:</strong> {feedback.fullName}</p>
                  <p><strong>Contact Info:</strong> {feedback.contactInfo}</p>
                  <p><strong>Description:</strong> {feedback.description}</p>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        {/* <footer
          style={{
            backgroundColor: '#263043',
            color: '#fff',
            textAlign: 'center',
            padding: '15px 0',
            fontSize: '14px',
          }}
        >
          &copy; {new Date().getFullYear()} Your Company Name. All Rights Reserved.
        </footer> */}
      </div>
    </div>
  );
};

export default Feedback;
