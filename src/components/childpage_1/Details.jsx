import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { FaHome } from 'react-icons/fa'; // Import home icon
import Sidebar from './Sidebar'; // Adjust the path as needed

function Details() {
  const navigate = useNavigate();
  // const [isHomeIconHovered, setIsHomeIconHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#263043',
    color: '#FFA500',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    borderBottom: '4px solid #e67e22',
    position: 'fixed', // Fix the header at the top
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure header is above other content
  };

  const logoStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  };

  // const homeIconStyle = {
  //   fontSize: '24px',
  //   cursor: 'pointer',
  //   color: isHomeIconHovered ? '#f39c12' : '#FFA500',
  //   transform: isHomeIconHovered ? 'scale(1.1)' : 'scale(1)',
  //   transition: 'color 0.3s, transform 0.3s',
  // };

  const contentStyle = {
    display: 'flex',
    marginTop: '80px', // Adjust margin to avoid overlap with the fixed header
    flex: '1',
  };

  const cardContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    marginTop: '60px',
    marginLeft: '450px', // Keep the original sidebar width
    padding: '20px',
  };

  const cardStyle = {
    width: '220px',
    height: '140px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '15px',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    transform: hoveredCard ? 'scale(1.05)' : 'scale(1)',
  };

  const iconStyle = {
    fontSize: '40px',
    marginBottom: '10px',
  };

  const labelStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar /> {/* Include Sidebar here */}
      <div style={{ flex: 1 }}>
        <header style={headerStyle}>
          <div style={logoStyle}>🏢 Help Center</div>
          {/* <FaHome 
            style={homeIconStyle} 
            onClick={() => navigate('/Home')} // Navigate to home on click
            onMouseEnter={() => setIsHomeIconHovered(true)}
            onMouseLeave={() => setIsHomeIconHovered(false)}
            role="button"
            aria-label="Home"
          /> */}
        </header>
        <div style={contentStyle}>
          <div style={cardContainerStyle}>
            <div 
              style={cardStyle} 
              onClick={() => handleCardClick('/childpage_1/email-info')}
              role="button"
              aria-label="Email History"
              onMouseEnter={() => setHoveredCard('email')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={iconStyle}>📧</div>
              <div style={labelStyle}>Email History</div>
            </div>
            <div 
              style={cardStyle} 
              onClick={() => handleCardClick('/childpage_1/lost-found')}
              role="button"
              aria-label="Lost and Found"
              onMouseEnter={() => setHoveredCard('lost-found')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={iconStyle}>🕵️‍♂️</div>
              <div style={labelStyle}>Lost and Found</div>
            </div>
            <div 
              style={cardStyle} 
              onClick={() => handleCardClick('/childpage_1/feedback')}
              role="button"
              aria-label="Feedback"
              onMouseEnter={() => setHoveredCard('feedback')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={iconStyle}>💬</div>
              <div style={labelStyle}>Feedback</div>
            </div>
          </div>
        </div>
        {/* <footer style={{
          backgroundColor: '#263043',
          color: '#ffffff',
          textAlign: 'center',
          padding: '15px 0',
          fontSize: '14px',
          borderTop: '2px solid #FFA500',
        }}>
          KDU_go Staff Bus Management System &copy; 2023. All Rights Reserved.
        </footer> */}
      </div>
    </div>
  );
}

export default Details;
