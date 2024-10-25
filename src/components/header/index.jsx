import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import { FaSignOutAlt } from 'react-icons/fa'; // Import an icon for logout

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userLoggedIn, userName } = useAuth(); // Assuming userName is available in useAuth

    // Check if we are on the dashboard
    const isOnDashboard = location.pathname === '/home';

    // Conditionally render Header based on the route
    if (isOnDashboard) {
        return null; // Do not render the header on the dashboard
    }

    return (
        <nav className='w-full h-12 bg-gray-800 text-white shadow-md flex justify-between items-center px-4'>
            <div className='flex-1 text-lg font-semibold text-center tracking-wide'>
                K   o   t  h  a  l  a  w  a  l  a   D  e  f  e  n  c  e     U  n  i  v  e  r  s  i  t  y {userName || ''}
            </div>
            {userLoggedIn && (
                <button
                    onClick={() => {
                        doSignOut().then(() => { navigate('/login'); });
                    }}
                    className='flex items-center text-sm font-semibold bg-gradient-to-r from-red-500 to-red-700 rounded-lg px-3 py-1 transition-transform transform hover:scale-105 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                >
                    <FaSignOutAlt className='mr-1' /> {/* Logout icon */}
                    Logout
                </button>
            )}
        </nav>
    );
}

export default Header;
