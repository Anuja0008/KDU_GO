import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase'; // Adjust the path as necessary
import { collection, onSnapshot } from 'firebase/firestore';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import Sidebar from './Sidebar'; // Import the Sidebar component

const BusLocation = () => {
    const [location, setLocation] = useState({ 
        name: null,
        latitude: null, 
        longitude: null 
    });

    // Your Geocoding API key
    const googleMapsApiKey = "AIzaSyAxGKSrgim2jNPp8Zk2VgqgSG-RX-2srzo";

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "busLocation"), (snapshot) => {
            snapshot.forEach((doc) => {
                const data = doc.data();
                const lat = data.latitude;
                const lng = data.longitude;
                
                setLocation({
                    latitude: lat,
                    longitude: lng,
                    name: null, // Initial name is null
                });

                // Fetch location name using Geocoding API
                fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.results && data.results.length > 0) {
                            setLocation(prevState => ({
                                ...prevState,
                                name: data.results[0].formatted_address // Get the formatted address
                            }));
                        } else {
                            setLocation(prevState => ({
                                ...prevState,
                                name: "" // Set it as an empty string if location is not found
                            }));
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching location name:', error);
                        setLocation(prevState => ({
                            ...prevState,
                            name: "" // Set it as an empty string if there's an error
                        }));
                    });
            });
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [googleMapsApiKey]);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar /> {/* Include the Sidebar */}

            <div style={{ flex: 1, marginLeft: '250px', display: 'flex', flexDirection: 'column' }}> {/* Adjust main content here */}
                {/* Header */}
                <header style={{ background: '#263043', padding: '10px', textAlign: 'center', fontSize: '26px', fontWeight: '600' }}>
                    <h1>Bus Location</h1>
                </header>

                {/* Main Content */}
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    {location.latitude && location.longitude ? (
                        <>
                            {/* Google Map */}
                            <LoadScript googleMapsApiKey={googleMapsApiKey}>
                                <GoogleMap
                                    mapContainerStyle={{ height: "400px", width: "100%", borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                                    center={{ lat: location.latitude, lng: location.longitude }}
                                    zoom={15}
                                >
                                    <Marker position={{ lat: location.latitude, lng: location.longitude }} />
                                </GoogleMap>
                            </LoadScript>
                        </>
                    ) : (
                        <h2 style={{ fontSize: '24px', color: '#555' }}>Loading...</h2> // Display loading state while the location is being fetched
                    )}
                </main>

                {/* Footer */}
                {/* <footer style={{ padding: '10px', background: '#263043', textAlign: 'center' }}>
                    <p>© 2024 Your Company Name</p>
                </footer> */}
            </div>
        </div>
    );
};

export default BusLocation;
