import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { db } from "../../firebase/firebase";
import { doc, setDoc, serverTimestamp, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Sidebar from './Sidebar'; // Import Sidebar
import { useNavigate } from "react-router-dom"; // Import useNavigate


const Lecturer = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [enrollmentNum, setEnrollmentNum] = useState("");
  const [department, setDepartment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State to hold lecturers
  const [lecturers, setLecturers] = useState([]);

  // Fetch registered lecturers on component mount
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const q = query(collection(db, "userdata"), where("role", "==", "lecturer"));
        const querySnapshot = await getDocs(q);
        const lecturersData = querySnapshot.docs.map(doc => doc.data());
        setLecturers(lecturersData);
      } catch (error) {
        console.error("Error fetching lecturers:", error);
      }
    };

    fetchLecturers();
  }, []);

  const registerLecturer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const auth = getAuth();

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore with email as document ID
      await setDoc(doc(db, "userdata", email), {
        uid: user.uid,
        fullName: fullName,
        email: email,
        enrollmentNum: enrollmentNum,
        departmentName: department,
        phoneNumber: phoneNumber,
        gender: gender,
        password: password,
        role: "lecturer",
        date: date,
        Time_Date: serverTimestamp(),
      });

      // Email parameters
      const templateParams = {
        to_email: email,
        from_name: "Admin office",
        from_email: "MT Office KDU Southern Campus",
        message: `Dear ${fullName},\n\nYou have been successfully registered as a lecturer.\n\nYour credentials are as follows:\n\nFull Name: ${fullName}\nEmail: ${email}\nPassword: ${password}\n\nBest regards,\nYour Team`,
      };

      // Send email
      await emailjs.send("service_skr725o", "template_delfrig", templateParams, "TQNCaWwbyeda2B53Z");

      // Save email details to Firestore
      await setDoc(doc(db, "registrationEmail", user.uid), {
        to_email: email,
        from_name: templateParams.from_name,
        from_email: templateParams.from_email,
        message: templateParams.message,
        date_sent: serverTimestamp(),
      });

      alert("Lecturer registered successfully and email sent!");
    } catch (error) {
      console.error("Failed to register lecturer or send email:", error);
      setError("Failed to register lecturer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <Sidebar /> {/* Add the Sidebar here */}
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            backgroundColor: '#263043',
            color: '#fff',
            padding: '15px 20px',
            fontSize: '20px',
            position: 'fixed',
            width: 'calc(100% - 250px)', // Adjust width to account for sidebar
            top: 0,
            left: 250, // Adjust left position to accommodate the sidebar width
            zIndex: 1000, // Ensure header is above other content
            display: 'flex', // Use flexbox for centering
            justifyContent: 'center', // Center the text
          }}
        >
          Lecturer Registration System
        </header>

        <div style={{ marginTop: '60px', padding: '20px', overflowY: 'auto', flex: 1, display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                maxWidth: "800px",
                margin: "20px auto",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
                marginRight: '20px', // Margin between the form and the list
              }}
            >
              <h2 style={{ textAlign: "center", color: "#333",marginBottom:"20px" }}>Register Lecturer</h2>
              <form
                style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}
                onSubmit={registerLecturer}
              >
                {/* Form inputs */}
                <div style={{ flex: "1 1 45%", marginBottom: "15px", paddingRight: "10px" }}>
                  <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Full Name:</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                    }}
                    placeholder="Enter full name"
                  />
                </div>
                <div style={{ flex: "1 1 45%", marginBottom: "15px", paddingRight: "10px" }}>
                  <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                    }}
                    placeholder="Enter email"
                  />
                </div>
                <div style={{ flex: "1 1 45%", marginBottom: "15px", paddingRight: "10px" }}>
                  <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Enrollment Number:</label>
                  <input
                    type="text"
                    value={enrollmentNum}
                    onChange={(e) => setEnrollmentNum(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                    }}
                    placeholder="Enter enrollment number"
                  />
                </div>
                <div style={{ flex: "1 1 45%", marginBottom: "15px", paddingRight: "10px" }}>
                  <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Department:</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                    }}
                    placeholder="Enter department"
                  />
                </div>
                <div style={{ flex: "1 1 45%", marginBottom: "15px", paddingRight: "10px" }}>
                  <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Phone Number:</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                    }}
                    placeholder="Enter phone number"
                  />
                </div>
                <div style={{ flex: "1 1 45%", marginBottom: "15px", paddingRight: "10px" }}>
                  <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Gender:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div style={{ flex: "1 1 45%", marginBottom: "15px", paddingRight: "10px" }}>
                  <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                    }}
                    placeholder="Enter password"
                  />
                </div>
                <div style={{ flex: "1 1 45%", marginBottom: "15px", paddingRight: "10px" }}>
                  <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Date:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                    }}
                  />
                </div>

                <div style={{ width: '100%', marginTop: '20px' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: '#007BFF',
                      color: '#fff',
                      padding: '10px 15px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      width: '100%',
                    }}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                  {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                </div>
              </form>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button
        onClick={() => navigate('/childpage_1/view-lectures')} // Navigate to the lecturers page
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        View Lecturers
      </button>
    </div>
          </div>
          

          {/* Registered Lecturers Section */}
          <div style={{ width: '300px', marginLeft: '20px', overflowY: 'auto', maxHeight: 'calc(100vh - 60px)', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ textAlign: 'center', color: '#333' }}>Registered Lecturers</h3>
            {lecturers.length === 0 ? (
              <p>No registered lecturers found.</p>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {lecturers.map((lecturer, index) => (
                  <li key={index} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <strong>{lecturer.fullName}</strong><br />
                    Phone: {lecturer.phoneNumber}<br />
                    Role: {lecturer.role}
                  </li>
                  
                ))}
              </ul>
              
            )}
            


            
          </div>
          
          
        </div>
        
      </div>
      
    </div>
  );
};

export default Lecturer;
