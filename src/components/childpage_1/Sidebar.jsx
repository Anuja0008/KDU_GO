import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BsGrid1X2Fill, 
  BsFillArchiveFill, 
  BsBellFill, 
  BsFillTelephoneFill, 
  BsQrCodeScan, 
  BsGeoAlt,
  BsCalendarWeek,
  // BsBoxArrowRight,
  BsFillEnvelopeFill,
  BsHouse // Add the house icon for the dashboard
} from 'react-icons/bs';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to track the hovered item
  const [hoveredItem, setHoveredItem] = useState(null);

  // Define routes and their labels, including the dashboard route
  const routes = [
    { path: '/home', label: 'Dashboard', icon: <BsHouse /> }, // Dashboard route
    { path: '/childpage_1/seat-reservation', label: 'Seat Reservations', icon: <BsGrid1X2Fill /> },
    { path: '/childpage_1/Bus-location', label: 'Live Location', icon: <BsGeoAlt /> },
    { path: '/childpage_1/Notification', label: 'Notices', icon: <BsBellFill /> },
    { path: '/childpage_1/center-details', label: 'Details', icon: <BsFillArchiveFill /> },
    { path: '/childpage_1/Details', label: 'Services', icon: <BsFillTelephoneFill /> },
    { path: '/childpage_1/Rollover', label: 'Rollover', icon: <BsCalendarWeek /> },
    { path: '/childpage_1/Qr', label: 'Student QR', icon: <BsQrCodeScan /> },
    { path: '/childpage_1/Mail', label: 'Emergancy Mail', icon: <BsFillEnvelopeFill /> },
  ];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>
        KDU.. 
        <span style={{ color: 'green' }}>g</span>
        <span style={{ color: 'orange' }}>o</span>
      </h2>
      <nav>
        <ul style={styles.navList}>
          {routes.map(({ path, label, icon }) => (
            <React.Fragment key={path}>
              <li
                style={{
                  ...styles.navItem,
                  backgroundColor: 
                    location.pathname === path 
                      ? '#4a90e2' 
                      : (hoveredItem === path ? 'rgba(175, 164, 164, 0.2)' : 'transparent'),
                  color: location.pathname === path ? '#fff' : '#d3d3d3',
                  boxShadow: location.pathname === path ? '0px 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
                }}
                onClick={() => navigate(path)}
                onMouseEnter={() => setHoveredItem(path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {React.cloneElement(icon, {
                  style: {
                    ...styles.icon,
                    color: '#FFA500', // Icon color set to orange
                  },
                })}
                <span>{label}</span>
              </li>
              <hr style={styles.separator} /> {/* Separator line */ }
            </React.Fragment>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Styles for Sidebar
const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#263043', // Rich navy tone for modern feel
    color: '##fafffa',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.15)', // Softer shadow for depth
  },
  logo: {
    fontSize: '26px',
    marginBottom: '40px',
    textAlign: 'center',
    color: '#fff',
    letterSpacing: '1.5px',
    fontWeight: '600',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // Clean separation
    paddingBottom: '10px',
    fontFamily: 'Times New Roman', // Set font to Times New Roman
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    marginTop: '20px',
  },
  navItem: {
    marginBottom: '15px',
    padding: '12px 18px',
    cursor: 'pointer',
    borderRadius: '10px',
    transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px', // Added gap between icon and text for cleaner layout
  },
  icon: {
    fontSize: '20px',
    transition: 'color 0.3s ease',
  },
  separator: {
    border: 'none',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)', // Soft, subtle separator line
    margin: '10px 0', // Space around the separator
  },
};

export default Sidebar;
