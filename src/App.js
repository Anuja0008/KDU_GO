import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Login from "./components/auth/login";
import SeatReservation from "./components/childpage_1/seat-reservation"; 
import SeatDetails from "./components/childpage_1/seat-details"; 
import TicketPrices from './components/childpage_1/Ticket-prices';
import { AuthProvider } from "./contexts/authContext";
import CenterDetails from './components/childpage_1/center-details';
import TimeShedule from './components/childpage_1/time-shedule';
import Details from './components/childpage_1/Details';
import LostAndFound from './components/childpage_1/lost-found';
import Dashboard from './components/home/Dashboard';
import Notification from './components/childpage_1/Notification';
import StudentDetails from './components/childpage_1/student-details';
import DriverDetails from './components/childpage_1/Driver-info';
import BusInformation from './components/childpage_1/Bus-info';
import BusLocation from './components/childpage_1/Bus-location';
import ROLLOVER from './components/childpage_1/Rollover';
import LECTURER from './components/childpage_1/lecturer';
import FEEDBACK from './components/childpage_1/feedback';
import Email from './components/childpage_1/email-info';
import QR from './components/childpage_1/qr';
import LecturerView from './components/childpage_1/view-lectures';
import PasswordReset from './components/childpage_1/password-reset ';
import Book from './components/childpage_1/Rollover-Book';
import FinalBook from './components/childpage_1/finalbook';
import Mail from './components/childpage_1/Mail';



function App() {
  const routesArray = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/Home",
      element: <Dashboard />,
    },
    {
      path: "/childpage_1/seat-reservation",
      element: <SeatReservation />,
    },
    {
      path: "/childpage_1/seat-details/:seatNumber",
      element: <SeatDetails />,
    },
    {
      path: "/childpage_1/center-details",
      element: <CenterDetails />,
    },
    {
      path: "/childpage_1/Ticket-prices",
      element: <TicketPrices />,
    },
    {
      path: "/childpage_1/time-shedule",
      element: <TimeShedule />, // Fixed typo: TimeShedule to TimeSchedule
    },
    {
      path: "/childpage_1/Details",
      element: <Details />,
    },
    {
      path: "/childpage_1/lost-found",
      element: <LostAndFound />, // Fixed casing: Lostandfound to LostAndFound
    },
    {
      path: "/childpage_1/qr",
      element: <QR />, // Fixed casing: Lostandfound to LostAndFound
    },
    {
      path: "/childpage_1/Notification",
      element: <Notification />,
    },
    {
      path: "/childpage_1/student-details",
      element: <StudentDetails />,
    },
    {
      path: "/childpage_1/Driver-info",
      element: <DriverDetails />,
    },
    {
      path: "/childpage_1/Bus-info",
      element: <BusInformation />,
    },
    {
      path: "/childpage_1/Bus-location",
      element: <BusLocation />,
    },
   
    {
      path: "/childpage_1/Rollover",
      element: <ROLLOVER/>, 
    },
    
    {
      path: "/childpage_1/lecturer",
      element: <LECTURER/>, 
    },
    {
      path: "/childpage_1/feedback",
      element: <FEEDBACK/>, 
    },

    {
      path: "/childpage_1/email-info",
      element: <Email/>, 
    },
    {
      path: "/childpage_1/password-reset",
      element: < PasswordReset/>, 
    },
    {
      path: "/childpage_1/view-lectures",
      element: <LecturerView/>, 
    },
    {
      path: "/childpage_1/Rollover-Book",
      element: <Book/>, 
    },
    {
      path: "/childpage_1/finalbook",
      element: <FinalBook/>, 
    },
    {
      path: "/childpage_1/Mail",
      element: <Mail/>, 
    },
    
  
    {
      path: "/",
      element: <Navigate to="/login" />, // Redirect to login
    },
 
    
    



  ];

  let routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      {/* Uncomment this line if you need a Header component */}
      {/* <Header /> */}
      <div className="w-full h-screen flex flex-col">
        {routesElement}
      </div>
    </AuthProvider>
  );
}

export default App;
