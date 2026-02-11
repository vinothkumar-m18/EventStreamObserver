import { useEffect, useState } from 'react';
import socket from '../../src/socketClient.js';
import { fetchEvents } from '../api/eventApi.js';
import { Link } from "react-router-dom";
import '../styles/App.css';
import '../styles/Dashboard.css';
import EventCard from './EventCard.jsx';
import {getTime} from '../../../backend/src/utils/getTime.js';
export default function Dashboard() {
    const [events, setEvents] = useState([]);
    useEffect(()=>{
        const handler = (event) => setEvents(prev => [event, ...prev]);
        fetchEvents().then(data => {
            setEvents(data);
        });
        socket.on('new-event', handler);
        console.log(`clients count before connection @${getTime()} id:${socket.id} - ${socket.listenerCount('new-event')}`);

        socket.on('connect', () => {
            console.log(`socket connected frontend id:${socket.id} @${getTime()}`)
            console.log(`clients count after connection @${getTime()} id:${socket.id}- ${socket.listenerCount('new-event')}`);

        });

        socket.on('disconnect', () => {
            console.log(`socket disconnected frontend id:${socket.id} @${getTime()}`)
            console.log(`clients count after disconnect @${getTime()} id:${socket.id}- ${socket.listenerCount('new-event')}`);

        });

        socket.on('connect_error', (err)=>console.log('socket error: ', err.message));
        return ()=>{
            socket.off('new-event', handler);
            console.log(`clients count after handler removed @${getTime()} id:${socket.id}- ${socket.listenerCount('new-event')}`);
        }
    }, []);
    return (

        <div >
            <nav className="navbar">
                <h3>EventStream Observer</h3>
                <div className="navbar-links">
                    <Link to="/">Dashboard</Link>
                    <Link to="/sources">Sources</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </nav>
            <div className = "page">
                <h2>Live Events</h2>
                {events.length === 0 && <p>No events yet</p>}
                <ul className="event-list">
                    {events.map(event => (
                        <EventCard event = {event} key = {event._id}/>
                    ))}
                </ul>
            </div>
        </div>
    );
};