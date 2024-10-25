import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar'; // Adjust the import path as necessary
import { db } from '../../firebase/firebase'; // Adjust import based on your Firebase configuration
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import emailjs from 'emailjs-com'; // Import EmailJS

const PasswordReset = () => {
  const [users, setUsers] = useState([]);
  const [emailStatus, setEmailStatus] = useState(null); // State for email sending status
  const [updatedUsers, setUpdatedUsers] = useState({}); // Track which users have been updated

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'userdata');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.role === 'lecturer'); // Filter to get only lecturers
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdate = async (id, field, value) => {
    try {
      const userDoc = doc(db, 'userdata', id);
      await updateDoc(userDoc, { [field]: value });

      // Update the user state locally
      const updatedUser = { ...users.find(user => user.id === id), [field]: value };
      const updatedUsersState = { ...updatedUsers, [id]: { ...updatedUsers[id], [field]: value } }; // Mark as updated
      setUsers(users.map(user => (user.id === id ? updatedUser : user)));
      setUpdatedUsers(updatedUsersState); // Update the tracking state

      // Send email only if the password or email is updated
      if (field === 'password' || field === 'email') {
        await sendEmailNotification(updatedUser, field === 'password' ? value : updatedUser.password);
        setEmailStatus('Email sent successfully!'); // Set email status to success
      }
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      setEmailStatus('Failed to send email. Please try again.'); // Update status on failure
    }
  };

  const sendEmailNotification = async (user, newPassword) => {
    console.log('Sending email to:', user.email);

    const templateParams = {
      to_email: user.email,
      subject: `Your password has been updated`,
      message: `Your password has been successfully updated to: "${newPassword}"`, // Include the updated password
    };

    try {
      const response = await emailjs.send('service_skr725o', 'template_delfrig', templateParams, 'TQNCaWwbyeda2B53Z');
      console.log('Email sent successfully!', response.status, response.text);
    } catch (error) {
      console.error('Failed to send email:', error);
      setEmailStatus('Failed to send email. Please try again.'); // Update status on failure
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '250px' }}>
        <Sidebar /> {/* Include the Sidebar component */}
      </div>
      <div style={{ marginLeft: '20px', padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
          Password Management
        </h2>
        <hr style={{ margin: '10px 0', border: '3px solid #FFA500',marginBottom:'10px' }} /> {/* Separator bar */}
        
        {emailStatus && (
          <div style={{ marginBottom: '20px', color: emailStatus.includes('successfully') ? 'green' : 'red' }}>
            {emailStatus} {/* Display the email sending status */}
          </div>
        )}

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #131413', padding: '8px' }}>Enrollment Number</th>
                <th style={{ border: '1px solid #131413', padding: '8px' }}>Full Name</th>
                <th style={{ border: '1px solid #131413', padding: '8px' }}>Email</th>
                <th style={{ border: '1px solid #131413', padding: '8px' }}>Password</th>
                <th style={{ border: '1px solid #131413', padding: '8px' }}>Role</th>
                <th style={{ border: '1px solid #131413', padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ border: '1px solid #131413', padding: '8px' }}>
                    <span>{user.enrollmentNum}</span> {/* Non-editable Enrollment Number */}
                  </td>
                  <td style={{ border: '1px solid #131413', padding: '8px' }}>{user.fullName}</td>
                  <td style={{ border: '1px solid #131413', padding: '8px' }}>
                    <input
                      type="text"
                      defaultValue={user.email}
                      onBlur={(e) => handleUpdate(user.id, 'email', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #131413', padding: '8px' }}>
                    <input
                      type="text"
                      defaultValue={user.password}
                      onBlur={(e) => handleUpdate(user.id, 'password', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #131413', padding: '8px' }}>{user.role}</td>
                  <td style={{ border: '1px solid #131413', padding: '8px' }}>
                    <button style={{ color: updatedUsers[user.id]?.password ? 'green' : 'black' }} 
                      onClick={() => sendEmailNotification(user, user.password)}>
                      Send Email
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

export default PasswordReset;
