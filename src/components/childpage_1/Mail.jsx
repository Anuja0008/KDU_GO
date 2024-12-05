import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Sidebar from './Sidebar';

const Mail = () => {
  const [receiverEmail, setReceiverEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!receiverEmail || !description) {
      alert("Please fill in both fields");
      return;
    }

    setIsLoading(true);

    const templateParams = {
      to_email: receiverEmail,
      message: description,
    };

    try {
      const response = await emailjs.send(
        'service_skr725o', 
        'template_delfrig', 
        templateParams,
        'TQNCaWwbyeda2B53Z'
      );
      console.log('Email sent successfully:', response);
      alert("Email sent successfully!");
    } catch (error) {
      console.error('Error sending email:', error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
      setReceiverEmail('');
      setDescription('');
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <h1 style={styles.title}>Send Email</h1>

        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Receiver's Email:</label>
            <input
              type="email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter receiver's email"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              placeholder="Enter your message"
              required
            />
          </div>

          <button onClick={handleSendEmail} style={styles.sendButton} disabled={isLoading}>
            {isLoading ? <div style={styles.spinner}></div> : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  content: {
    flexGrow: 1,
    padding: '30px',
    backgroundColor: '#fafafa',
    overflowY: 'auto',
    fontFamily: 'Poppins, sans-serif',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    marginTop: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: '0.3s ease',
  },
  inputFocus: {
    borderColor: '#4CAF50',
    boxShadow: '0 0 5px rgba(76, 175, 80, 0.5)',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '16px',
    height: '150px',
    boxSizing: 'border-box',
    transition: '0.3s ease',
  },
  sendButton: {
    background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
    color: '#fff',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.3s ease',
  },
  sendButtonHover: {
    background: 'linear-gradient(45deg, #8BC34A, #4CAF50)',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    animation: 'spin 2s linear infinite',
    margin: '0 auto',
  },
};

export default Mail;
