import { useState, useEffect } from "react";
import api from '../services/api.js';
import { Link } from 'react-router-dom';
import '../styles/App.css';
import '../styles/Sources.css';
export default function Sources() {
    const [sources, setSources] = useState([]);
    const [service, setService] = useState('');
    const [eventInput, setEventInput] = useState('');
    const [eventsAccepted, setEventsAccepted] = useState([]);
    const fetchSources = async () => {
        try {
            const res = await api.get('/sources/all');
            setSources(res.data);
        } catch (error) {
            console.log('error fetching sources inside sources.jsx: ', error);
        }
    };
    const createSource = async () => {
        try {
            await api.post('/sources', { service, eventsAccepted });
            fetchSources();
        } catch (error) {
            console.log('error creating source inside sources.jsx: ', error);
        }
    }
    useEffect(() => {
        fetchSources();
    }, []);

    return (
        <>
            <nav className="navbar">
                <h3>EventStream Observer</h3>
                <div className="navbar-links">
                    <Link to="/">Dashboard</Link>
                    <Link to="/sources">Sources</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </nav>
            <div className="page">
                <h2>Register Webhook Source</h2>                
                <select onChange={e => setService(e.target.value)}>
                    <option value="custom">custom</option>
                    <option value="github">github</option>
                    <option value="stripe">stripe</option>
                </select>
                <input placeholder="Enter event name"
                    value={eventInput}
                    onChange={e => setEventInput(e.target.value)}
                />
                <button onClick={() => {
                    if (eventInput.trim()) {
                        setEventsAccepted(prev => [...prev, eventInput.trim()]);
                        setEventInput('');
                    }
                }}
                >Add accepted events</button>
                <button style = {{"marginLeft":"10px"}}onClick={createSource}>Create Source</button>
                {/* rendering sources */}
                <h3>Registered Sources</h3>
                <ul>
                    {
                        sources.map(src => (
                            <ul key={src._id} className = "source-card">
                                <div>
                                    <b>Service:</b> {src.service}
                                </div>                                                              
                                <div className = "events-container">
                                    <b>Events Accepted:</b>
                                    <ul className = "events-accepted-list">
                                        {src.eventsAccepted.map((data, index) => (
                                            <ul key={index}>
                                                {data}
                                            </ul>
                                        ))}
                                    </ul>
                                </div>
                            </ul>
                        ))
                    }
                </ul>
            </div>
        </>
    );
}
