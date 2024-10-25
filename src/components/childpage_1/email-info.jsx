// src/components/Email.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Sidebar from './Sidebar'; // Import Sidebar

const Email = () => {
  const [emailType, setEmailType] = useState('lecture');
  const [emails, setEmails] = useState([]);

  const handleEmailTypeChange = (event) => {
    setEmailType(event.target.value);
  };

  useEffect(() => {
    const fetchEmails = async () => {
      const collectionName = emailType === 'lecture' ? 'registrationEmail' : 'RolloverEMAIL';
      const emailCollection = collection(db, collectionName);
      const emailSnapshot = await getDocs(emailCollection);

      const emailList = emailSnapshot.docs.map(doc => {
        const data = doc.data();
        return emailType === 'lecture'
          ? {
              id: doc.id,
              from_email: data.from_email,
              from_name: data.from_name,
              message: data.message,
            }
          : {
              id: doc.id,
              notice: data.Notice,
              receiver: data.Receiver,
              sender: data.Sender,
              time_date: data.Time_Date ? data.Time_Date.toDate().toLocaleString() : 'N/A',
            };
      });

      setEmails(emailList);
    };

    fetchEmails();
  }, [emailType]);

  return (
    <div style={styles.wrapper}>
      <Sidebar /> {/* Include Sidebar */}
      
      <div style={styles.container}>
        <h1 style={styles.greeting}>Hello!</h1>
        <p style={styles.message}>Welcome to our email service. How can we assist you today?</p>
        
        <div style={styles.radioContainer}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="lecture"
              checked={emailType === 'lecture'}
              onChange={handleEmailTypeChange}
              style={styles.radioInput}
            />
            <span style={styles.radioText}>Lecture Registration Send Email</span>
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="rollover"
              checked={emailType === 'rollover'}
              onChange={handleEmailTypeChange}
              style={styles.radioInput}
            />
            <span style={styles.radioText}>Rollover Send Email</span>
          </label>
        </div>

        <p style={styles.selectedEmailType}>Selected Email Type: {emailType === 'lecture' ? 'Lecture Registration' : 'Rollover'}</p>

        <div style={styles.emailList}>
          <h2 style={styles.emailListTitle}>Email List:</h2>
          {emails.length === 0 ? (
            <p>No emails found.</p>
          ) : (
            <ul style={styles.emailItems}>
              {emails.map(email => (
                <li key={email.id} style={styles.emailItem}>
                  {emailType === 'lecture' ? (
                    <>
                      <strong>From:</strong> {email.from_name} &lt;{email.from_email}&gt; <br />
                      <strong>Message:</strong> {email.message}
                    </>
                  ) : (
                    <>
                      <strong>Notice:</strong> {email.notice} <br />
                      <strong>Receiver:</strong> {email.receiver} <br />
                      <strong>Sender:</strong> {email.sender} <br />
                      <strong>Date:</strong> {email.time_date}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
  },
  container: {
    marginLeft: '250px', // Adjust for sidebar width
    padding: '30px',
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  greeting: {
    fontSize: '32px',
    color: '#2c3e50',
  },
  message: {
    fontSize: '18px',
    color: '#7f8c8d',
  },
  radioContainer: {
    margin: '20px 0',
    textAlign: 'left',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
    cursor: 'pointer',
  },
  radioInput: {
    marginRight: '10px',
    accentColor: '#3498db',
  },
  radioText: {
    fontSize: '16px',
    color: '#34495e',
  },
  selectedEmailType: {
    marginTop: '10px',
    fontSize: '20px',
    color: '#2980b9',
  },
  emailList: {
    marginTop: '20px',
    textAlign: 'left',
  },
  emailListTitle: {
    fontSize: '24px',
    color: '#34495e',
  },
  emailItems: {
    listStyleType: 'none',
    padding: 0,
  },
  emailItem: {
    backgroundColor: '#ecf0f1',
    borderRadius: '5px',
    padding: '15px',
    margin: '10px 0',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
};

export default Email;
