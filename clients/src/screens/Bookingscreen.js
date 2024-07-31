import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2'

function Bookingscreen() {
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { roomid, fromdate, todate } = useParams();

    const from_date = moment(fromdate, 'DD-MM-YYYY');
    const to_date = moment(todate, 'DD-MM-YYYY');
    const [totalamount, setTotalAmount] = useState()

    const totaldays = moment.duration(to_date.diff(from_date)).asDays() + 1;

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                const response = await axios.post("/api/rooms/getroombyid", { roomid });
                setRoom(response.data);
                setTotalAmount(response.data.rentperday * totaldays)
            } catch (error) {
                console.error("Error fetching room:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [roomid, totaldays]);

    async function onToken(token) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser._id) {
            alert("Please login to book a room");
            return;
        }

        const bookingDetails = {
            room,
            userid: currentUser._id,
            fromdate,
            todate,
            totalamount,
            totaldays,
            token
        }

        try {
            setLoading(true);
            const result = await axios.post('/api/bookings/bookroom', bookingDetails);
            setLoading(false);
            Swal.fire('Congratulations','Your Room booked Sucessfully','success').then(result=>{
                window.location.href='/bookings'
            })
            // You might want to redirect the user or update the UI here
        } catch (error) {
            setLoading(false)
            console.error("Error booking room:", error.response?.data || error);
            Swal.fire('oops!', 'Something went wrong','error')
        }
    }

    if (loading) return <Loader />;
    if (error) return <Error />;
    if (!room) return <div>No room data available.</div>;

    return (
        <div className='row justify-content-center m-5 bs'>
            <div className='col-md-6'>
                <h1>{room.name}</h1>
                <img src={room.imageurls[0]} className='bigimg' alt={room.name} />
            </div>
            <div className='col-md-6'>
                <div style={{ textAlign: 'right' }} className="pt-7">
                    <h1 className='text-decoration-underline'>Booking Details</h1>
                    <br />
                    <b>
                        <p>Name:{JSON.parse(localStorage.getItem('currentUser')).name} </p>
                        <p>From Date: {fromdate} </p>
                        <p>To Date: {todate}</p>
                        <p>Max Count: {room.maxcount}</p>
                    </b>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h1 className='text-decoration-underline'>Amount</h1>
                    <br />
                    <b>
                        <p>Total Days: {totaldays} </p>
                        <p>Rent per day: {room.rentperday}</p>
                        <p>Total Amount: {totalamount} </p>
                    </b>
                </div>

                <div style={{float:'right'}}>
                <StripeCheckout
                    amount={totalamount * 100}
                    token={onToken}
                    currency='INR'
                    stripeKey="pk_test_51Phn1KDjO97zto9GRX697mjxKxb3empBDhDxpsdBMyRFlDb037oNnx3AdQ3mXWbRrNTIKdV1MNU6fLAyz5mKLnRF005uSMg8qd"
                  > 
                    <button className="btn btn-primary">Pay Now{" "}</button>
                  </StripeCheckout>  
                  </div>
            </div>
        </div>
    );
}

export default Bookingscreen;