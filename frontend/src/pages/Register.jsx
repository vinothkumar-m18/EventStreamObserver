import { useState } from "react";
import api from '../services/api.js';
import { Link } from "react-router-dom";
import '../styles/App.css';
import '../styles/Login.css';
export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const submit = async (e) => {
        e.preventDefault();
        await api.post('/auth/register', { email, password });
        alert('registered successfully. login now');
    }
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
            <div className="auth-box">
                <form onSubmit={submit}>
                    <h2>Register</h2>
                    <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
                    <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    );

}