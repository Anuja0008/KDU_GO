import React, { useEffect, useState } from 'react';
import { 
  BsQrCodeScan,
  BsGrid1X2Fill, 
  BsFillArchiveFill, 
  BsBellFill, 
  BsFillTelephoneFill, 
  // BsInfoCircleFill, 
  BsThreeDotsVertical,// Triple dot icon import
  BsCalendarWeek ,
  BsGeoAlt 
} from 'react-icons/bs';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage'; // Firebase Storage
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore
import './profile.css';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [accountName, setAccountName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State for file upload
  const [showOptions, setShowOptions] = useState(false); // Toggle for options dropdown
  const [showUploadButton, setShowUploadButton] = useState(false); // Toggle for upload button visibility

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();

      // Fetch profile image URL from Firestore
      const fetchProfileImageFromFirestore = async () => {
        const docRef = doc(db, 'admin', 'login'); // Document reference
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.imageUrl) {
              setProfileImageUrl(data.imageUrl);
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching Firestore document:", error);
        }
      };

      // Fetch account name from Firestore
      const fetchAccountName = async () => {
        const docRef = doc(db, 'admin', 'login');
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setAccountName(data.name);
          }
        } catch (error) {
          console.error("Error fetching account name:", error);
        }
      };

      await fetchProfileImageFromFirestore();
      await fetchAccountName();
    };

    fetchData();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      console.log("Selected file:", e.target.files[0]); // Debugging: Check selected file
      setShowUploadButton(true); // Show upload button when a file is selected
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (selectedFile) {
      const storage = getStorage();
      const db = getFirestore();
      const storageRef = ref(storage, `profile/${selectedFile.name}`);

      try {
        console.log("Uploading file..."); // Debugging: Log before upload starts
        const snapshot = await uploadBytes(storageRef, selectedFile);
        console.log("Upload success:", snapshot); // Debugging: Log upload success

        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("Download URL:", downloadURL); // Debugging: Log download URL

        const docRef = doc(db, 'admin', 'login');
        await updateDoc(docRef, { imageUrl: downloadURL });
        setProfileImageUrl(downloadURL);
        alert('Image uploaded and URL saved to Firestore!');
        setShowUploadButton(false); // Hide upload button after successful upload
      } catch (error) {
        console.error("Error uploading image and saving URL:", error);
        alert("Error uploading image.");
      }
    } else {
      console.error("No file selected for upload");
      alert("Please select a file first.");
    }
  };

  // Toggle the dropdown menu
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className="profile-section">
        <img
          src={profileImageUrl || "https://via.placeholder.com/50"}
          alt="Profile"
          className="profile-photo"
        />
        <span className="profile-name">{accountName || "Loading..."}</span>
        <span className="close-icon" onClick={OpenSidebar}>X</span>

        {/* Triple dot icon for options */}
        <BsThreeDotsVertical className="options-icon" onClick={toggleOptions} />

        {/* Dropdown menu */}
        {showOptions && (
          <div className="dropdown-menu">
            <p onClick={() => document.getElementById('fileInput').click()}>
              Change Profile Image
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          id="fileInput"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Show upload button when an image is selected */}
        {showUploadButton && (
          <button onClick={handleUpload} className="upload-button">
            Upload Image
          </button>
        )}
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <a href="/childpage_1/seat-reservation">
            <BsGrid1X2Fill className="icon" /> Seat Reservation
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="/childpage_1/Bus-location">
            <BsGeoAlt  className="icon" /> Live Location
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="/childpage_1/Notification">
            <BsBellFill className="icon" /> Notices
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="/childpage_1/center-details">
            <BsFillArchiveFill className="icon" /> Details
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="/childpage_1/Details">
            <BsFillTelephoneFill className="icon" /> Services
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="/childpage_1/Rollover">
            <BsCalendarWeek  className="icon" /> Rollover
          </a>
        </li>
        <li className="sidebar-list-item">  
          <a href="/childpage_1/Qr">
            < BsQrCodeScan className="icon" />QR Seats
          </a>
        </li>
        
      </ul>
    </aside>
  );
}

export default Sidebar; 


