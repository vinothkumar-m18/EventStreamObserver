import { useEffect, useState } from 'react';
import socket from '../../src/socketClient.js';
import { fetchEvents } from '../api/eventApi.js';
import { Link } from "react-router-dom";
import '../styles/App.css';
import '../styles/Dashboard.css';
import EventCard from './EventCard.jsx';
export default function Dashboard() {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        // load existing events
        fetchEvents().then(data => {
            setEvents(data);
        });

        socket.on('new-event', event => {
            setEvents((prev) => [event, ...prev]);
        });
        return () => {
            socket.off('new-event');
        };
    }, [])
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