import React, { useEffect, useState } from 'react';
import { 
  BsFillBellFill, 
  // BsPersonCircle, 
  BsJustify, 
  BsBoxArrowRight,
  BsPerson
} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation
import { db } from '../../firebase/firebase'; // Import Firestore database instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods

function Header({ OpenSidebar }) {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasNewFeedback, setHasNewFeedback] = useState(false); // State to track new feedback

  // Function to handle logout
  const handleLogout = () => {
    alert('You have been logged out.');
    navigate('/login', { replace: true });
  };

  // Function to navigate to the password reset page
  const handleProfileClick = () => {
    navigate('/childpage_1/password-reset'); // Navigate to the password reset page
  };

  // Function to navigate to the notifications page
  const handleNotificationsClick = () => {
    navigate('/childpage_1/Rollover'); // Adjust the path to your notifications page
  };

  // Fetch notification count from the TicketRollover collection
  const fetchNotificationCount = async () => {
    const rolloverCollection = collection(db, 'TicketRollover');
    const querySnapshot = await getDocs(rolloverCollection);
    setNotificationCount(querySnapshot.size); // Set the count of documents in the collection
  };

  // Fetch feedback and check for new feedback
  const checkNewFeedback = async () => {
    const feedbackCollection = collection(db, 'Feedback');
    const querySnapshot = await getDocs(feedbackCollection);
    const feedbackIds = querySnapshot.docs.map(doc => doc.id);

    // Here you can implement your logic to check for new feedback
    // For demonstration, let's assume we check for an ID that you already stored in the state
    const lastKnownFeedbackId = localStorage.getItem('lastFeedbackId'); // Assuming you stored the last seen ID
    const newFeedback = feedbackIds.filter(id => id > lastKnownFeedbackId); // Example logic to check for new feedback

    if (newFeedback.length > 0) {
      setHasNewFeedback(true); // Set new feedback flag
      // Optionally update last known feedback ID in localStorage
      localStorage.setItem('lastFeedbackId', newFeedback[newFeedback.length - 1]); // Store the latest feedback ID
    }
  };

  useEffect(() => {
    fetchNotificationCount(); // Fetch notification count on component mount
    checkNewFeedback(); // Check for new feedback on component mount

    const interval = setInterval(checkNewFeedback, 30000); // Check for new feedback every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>

      <div className='header-icon'>
        <div style={{ position: 'relative' }} onClick={handleNotificationsClick}>
          <BsFillBellFill className={`icon-header ${hasNewFeedback ? 'blink' : ''}`} />
          {notificationCount > 0 && (
            <span className='notification-count'>{notificationCount}</span>
          )}
        </div>
        <BsPerson className='icon-header' onClick={handleProfileClick} title="Profile" />
        <BsBoxArrowRight className='icon-header' onClick={handleLogout} title="Logout" />
      </div>
    </header>
  );
}

export default Header;
