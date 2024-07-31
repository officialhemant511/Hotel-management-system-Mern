import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { DatePicker, Space } from 'antd';
import moment from 'moment'
const { RangePicker } = DatePicker;

function Homescreen() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [fromdate, setfromdate] = useState(null)
    const [todate, settodate] = useState(null)
    const [duplicaterooms, setduplicaterooms] = useState([])
    const [searchkey,setsearchkey]=useState('')
    const [type,settype] = useState('all')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/rooms/getallrooms');
                setRooms(response.data);
                setduplicaterooms(response.data);
                setLoading(false);
            } catch (error) {
                setError(true);
                console.error('Error fetching rooms:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log('From date state:', fromdate);
        console.log('To date state:', todate);
    }, [fromdate, todate]);

    function filterByDate(dates, dateStrings) {
        if (dates) {
            console.log('Selected dates:', dates);
            console.log('Formatted selected dates:', dateStrings);
            setfromdate(dateStrings[0]);
            settodate(dateStrings[1]);
    
            var temprooms = []
            var availability = false;
    
            for (const room of duplicaterooms) {
                availability = false;
                if (room.currentbookings.length > 0) {
                    for (const booking of room.currentbookings) {
                        if (
                            moment(dateStrings[0], 'DD-MM-YYYY').isBetween(booking.fromdate, booking.todate, null, '[]') ||
                            moment(dateStrings[1], 'DD-MM-YYYY').isBetween(booking.fromdate, booking.todate, null, '[]') ||
                            moment(booking.fromdate, 'DD-MM-YYYY').isBetween(dateStrings[0], dateStrings[1], null, '[]') ||
                            moment(booking.todate, 'DD-MM-YYYY').isBetween(dateStrings[0], dateStrings[1], null, '[]')
                        ) {
                            availability = false;
                            break;
                        } else {
                            availability = true;
                        }
                    }
                } else {
                    availability = true;
                }
                
                if (availability) {
                    temprooms.push(room);
                }
            }
            setRooms(temprooms);
        } else {
            console.log('Date range cleared');
            setfromdate(null);
            settodate(null);
            setRooms(duplicaterooms);
        }
    }

    function filterBySearch(){
        const temprooms = duplicaterooms.filter(room=>room.name.toLowerCase().includes(searchkey.toLowerCase()))
        setRooms(temprooms)
    }
    function filterByType(e){
        settype(e)
        if(e!=='all'){
            const temprooms = duplicaterooms.filter(room=>room.type.toLowerCase()==e.toLowerCase())
        setRooms(temprooms)
        }
        else setRooms(duplicaterooms)
    }

    

    return (
        <div className='container'>
            <div className='row mt-5 bs'>
                <div className='col-md-3'>
                    <RangePicker
                        format='DD-MM-YYYY'
                        onChange={filterByDate}
                    />
                </div>
                <div className='col-md-5'>
                    <input text = 'text' className='form-control' placeholder='search rooms' value={searchkey} onChange={(e)=>{setsearchkey(e.target.value)}} onKeyUp={filterBySearch}/>
                </div>
                <div className='col-md-3'>
                <select className='form-control'value={type} onChange={(e)=>{filterByType(e.target.value)}}>
                    <option value="all">All</option>
                    <option value="delux">Delux</option>
                    <option value="non-delux">Non-Delux</option>
                </select>
                </div>
            </div>
            <div className='row justify-content-center mt-5'>
                {loading ? (
                    <Loader />
                ) : (
                    rooms.map(room => {
                        return(
                        <div className='col-md-9 mt-2' key={room._id}>
                            <Room room={room} fromdate={fromdate} todate={todate} />
                        </div>
                        );
})
                )}
            </div>
        </div>
    );
}

export default Homescreen;