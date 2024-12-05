// import React, { useState } from 'react';
// // import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Optional, in case you want to add password visibility toggling
// import emailjs from 'emailjs-com'; // Import the EmailJS SDK
// import Sidebar from './Sidebar'; // Make sure the path is correct for your Sidebar component

// const Mail = () => {
//   const [receiverEmail, setReceiverEmail] = useState('');
//   const [description, setDescription] = useState('');
//   const [isLoading, setIsLoading] = useState(false); // For showing loading state while sending the email

//   // Handle form submission to send the email via EmailJS
//   const handleSendEmail = async () => {
//     if (!receiverEmail || !description) {
//       alert("Please fill in both fields");
//       return;
//     }

//     setIsLoading(true); // Show loading state

//     // Prepare the email template params
//     const templateParams = {
//       to_email: receiverEmail,
//       message: description,
//     };

//     try {
//       // Send the email using EmailJS
//       const response = await emailjs.send(
//         'service_skr725o',    // Your EmailJS service ID
//         'template_delfrig',   // Your EmailJS template ID
//         templateParams,       // Template parameters (contains 'to_email' and 'message')
//         'TQNCaWwbyeda2B53Z'   // Your EmailJS user ID
//       );
//       console.log('Email sent successfully:', response);
//       alert("Email sent successfully!");
//     } catch (error) {
//       console.error('Error sending email:', error);
//       alert("Failed to send email. Please try again.");
//     } finally {
//       setIsLoading(false); // Hide loading state
//       setReceiverEmail('');
//       setDescription('');
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* Sidebar */}
//       <Sidebar />
      
//       {/* Main Content */}
//       <div style={styles.content}>
//         <h1>Send Email</h1>
        
//         {/* Email Form */}
//         <div style={styles.form}>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Receiver's Email:</label>
//             <input
//               type="email"
//               value={receiverEmail}
//               onChange={(e) => setReceiverEmail(e.target.value)}
//               style={styles.input}
//               placeholder="Enter receiver's email"
//               required
//             />
//           </div>

//           <div style={styles.formGroup}>
//             <label style={styles.label}>Description:</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               style={styles.textarea}
//               placeholder="Enter your message"
//               required
//             />
//           </div>

//           <button onClick={handleSendEmail} style={styles.sendButton} disabled={isLoading}>
//             {isLoading ? 'Sending...' : 'Send'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Styles for the layout (sidebar, content, and form)
// const styles = {
//   container: {
//     display: 'flex', // Use flexbox to display the sidebar and content side by side
//     height: '100vh', // Full viewport height
//   },
//   content: {
//     flexGrow: 1, // Content takes up the remaining space
//     padding: '20px', // Add padding inside the content area
//     backgroundColor: '#f9f9f9', // Light background color for contrast
//     overflowY: 'auto', // Allow content to scroll if needed
//   },
//   form: {
//     marginTop: '20px', // Add space above the form
//     maxWidth: '600px', // Max width for the form
//     margin: '0 auto', // Center the form horizontally
//   },
//   formGroup: {
//     marginBottom: '15px', // Space between form fields
//   },
//   label: {
//     fontWeight: 'bold',
//     marginBottom: '5px',
//     color: '#555',
//     display: 'block',
//   },
//   input: {
//     width: '100%',
//     padding: '10px',
//     borderRadius: '4px',
//     border: '1px solid #ccc',
//     fontSize: '16px',
//     boxSizing: 'border-box', // Ensure padding is included in width calculation
//   },
//   textarea: {
//     width: '100%',
//     padding: '10px',
//     borderRadius: '4px',
//     border: '1px solid #ccc',
//     fontSize: '16px',
//     height: '150px', // Set a fixed height for the textarea
//     boxSizing: 'border-box', // Ensure padding is included in width calculation
//   },
//   sendButton: {
//     backgroundColor: '#4CAF50', // Green background color
//     color: '#fff', // White text
//     padding: '10px 20px',
//     border: 'none',
//     borderRadius: '4px',
//     fontSize: '16px',
//     cursor: 'pointer',
//     width: '100%',
//     boxSizing: 'border-box',
//   },
// };

// export default Mail;
