import React, { useEffect, useState } from 'react'
import { Tabs } from "antd"
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';

const { TabPane } = Tabs;

function Profilescreen() {
    const user = JSON.parse(localStorage.getItem('currentUser'))

    useEffect(() => {
        if (!user) {
            window.location.href = '/login'
        }
    }, [])

    return (
        <div className='ms-3 mt-3' style={{ textAlign: 'left' }}>
            <Tabs defaultActiveKey='1' style={{ float: "left" }}>
                <TabPane tab='Profile' key='1'>
                    <h2>My Profile</h2>
                    <br />
                    <h1>Name: {user.name}</h1>
                    <br />
                    <h1>Admin: {user.isAdmin ? 'YES' : 'NO'}</h1>
                    <br />
                    <h1>Email: {user.email}</h1>
                </TabPane>
                <TabPane tab='Bookings' key='2'>
                    <MyBookings />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default Profilescreen;

export function MyBookings() {
    const [rooms, setRooms] = useState([]);
    const user = JSON.parse(localStorage.getItem('currentUser'))    
    const [bookings,setbookings] = useState()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        async function fetchBookings() {
            try {
                setLoading(true)
                const response = await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id });
                setRooms(response.data);
                console.log(response.data);
                setbookings(response.data)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error);
                setError(error)
            }
        }
        fetchBookings();
    }, [user._id]);

    return (
        <div>
            <div className='row'>
                <div className='col-md-9'>
                    {loading && (<Loader/>)}
                    {bookings && (bookings.map(booking=>{

                        return <div className="bs">
                            <h1>{booking.room}</h1>
                            <p><b>BookingId</b>: {booking._id}</p>
                            <p><b>CheckIn</b>: {booking.fromdate}</p>
                            <p><b>Checkout</b>: {booking.todate}</p>
                            <p><b>Amount</b>: {booking.totalamount}</p>
                            <p><b>Status</b>: {booking.status== 'booked'?'CONFORMED':'CANCELLED'}</p>
                        </div>
                    }))}
                </div>
            </div>
        </div>
    )
}