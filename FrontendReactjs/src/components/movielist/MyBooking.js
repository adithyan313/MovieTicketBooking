import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; 
import { Spinner, Alert } from "react-bootstrap"; 
import CheckAuth from "../auth/checkAuth";
import Navbar from "../navebar";

function MyBookings() {
    const user = useSelector((store) => store.auth.user); 
    const [bookings, setBookings] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    

    useEffect(() => {
        if (user) {
            axios
                .get("http://127.0.0.1:8000/my_bookings/", {
                    headers: { Authorization: `Token ${user.token}` }, 
                })
                .then((response) => {
                    setBookings(response.data); 
                    setLoading(false); 
                })
                .catch((err) => {
                    console.error("Failed to fetch bookings:", err);
                    setError("Failed to fetch bookings."); 
                    setLoading(false); 
                });
        }
    }, [user]); 

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>; 
    }

    const downloadBooking = (pk) => {
        if (user) {
            axios
                .get(`http://127.0.0.1:8000/download_ticket/${pk}/`, {
                    headers: { Authorization: `Token ${user.token}` },
                    responseType: "blob", // This is important for downloading files
                })
                .then((response) => {
                    // Create a link to download the file
                    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `booking_${pk}.pdf`); // Set the filename for the download
                    document.body.appendChild(link);
                    link.click(); // Trigger the download
                    document.body.removeChild(link); // Clean up the DOM
                })
                .catch((err) => {
                    console.error("Failed to download booking:", err);
                });
        }
    };

    return (
        <div>
            <Navbar/>
        <div className="container mt-4">
            <center><h2>My Bookings</h2><img src="/popcorn.png" alt="Todo List Icon" style={{ width: "70px", marginRight: "10px" }} /></center><br/><hr/>
            {bookings.length === 0 ? ( 
                <center><p>No bookings found.</p></center>
            ) : (
                <div className="row">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="col-md-4">
                            
                            <div className="card mb-3">
                            <img
            className="card-img-top"
            src={`http://127.0.0.1:8000${booking.movie.poster_image}`}
            alt="ok" style={{width:"100%", height:"100%", borderRadius:"5px"}}
          /> 
                                <div className="card-body">
                                    <h5>Booking ID: {booking.id}</h5>
                                    <p>Movie: {booking.movie.name}</p>
                                    <p>Booking Date: {booking.booking_date}</p> 
                                    <button
                                        className="btn btn-success"
                                        onClick={() => downloadBooking(booking.id)}
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </div>
    );
}

export default CheckAuth(MyBookings);