import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/checkAuth';
import { useNavigate } from 'react-router-dom';

const TicketBooking = () => {
  const user = useSelector((store) => store.auth.user);
  const { movieId } = useParams(); 
  const location = useLocation();
  const [selectedTickets, setSelectedTickets] = useState([]); 
  const [isBooking, setIsBooking] = useState(false); 
  const [responseMessage, setResponseMessage] = useState(null); 
  const [errorMessage, setErrorMessage] = useState(null); 
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const yourDate = searchParams.get('date');

  const ticketOptions = Array.from({ length: 150 }, (_, i) => i + 1);

  const toggleTicketSelection = (ticketNumber) => {
    setSelectedTickets((prev) => {
      if (prev.includes(ticketNumber)) {
        return prev.filter((t) => t !== ticketNumber); 
      } else {
        return [...prev, ticketNumber]; 
      }
    });
  };

  const handleBookTicket = async () => {
    setIsBooking(true);
    setResponseMessage(null);
    setErrorMessage(null);

    try {
      const totalTickets = selectedTickets.length; 
      if (totalTickets === 0) {
        throw new Error("Please select at least one ticket.");
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/bookings/${movieId}/`,
        { 
          tickets: totalTickets,
          your_date: yourDate,
         },
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );

      const { razorpay_order_id, amount } = response.data;

      const options = {
        key: 'rzp_test_oYKWoicTr0HXCT', 
        amount: amount * 100, 
        currency: 'INR',
        order_id: razorpay_order_id,
        name: 'Ticket Booking',
        description: 'Book movie tickets',
        handler: async (paymentResponse) => {
          const { razorpay_payment_id } = paymentResponse;

          await axios.post(
            'http://127.0.0.1:8000/bookings/confirm/',
            {
              razorpay_order_id,
              razorpay_payment_id,
            },
            {
              headers: { Authorization: `Token ${user.token}` },
            }
          );

          alert('Booking Successfully! :) 😂😂');
          navigate('/')
          
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open(); 
    } catch (error) {
      alert(
        error.response?.data?.error || error.message || 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsBooking(false);
    }
    
  };

  return (
    <div className="container">
      <center><h2  className='mb-5'>Book Your Tickets</h2></center>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(15, 45px)', 
          gridAutoRows: '45px', 
          gap: '3px', 
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        {ticketOptions.map((option) => (
          <button
            key={option}
            onClick={() => toggleTicketSelection(option)}
            style={{
              boxShadow: '0 0 10px rgb(0,0,0)',
              borderRadius: '3px',
              color: 'white',
              width: '36px',
              height: '36px',
              backgroundColor: selectedTickets.includes(option) ? 'lightgreen' : 'white', 
              border: '1px solid black',
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <center>
        <button
          onClick={handleBookTicket}
          disabled={isBooking}
          className="btn btn-primary"
          style={{ width: '200px' }}
        >
          {isBooking ? 'Booking...' : 'pay'}
        </button>
      </center>
      {responseMessage && <div className="text-success">{responseMessage}</div>} 
      {errorMessage && <div className="text-danger">{errorMessage}</div>} 
    </div>
  );
};

export default CheckAuth(TicketBooking);
