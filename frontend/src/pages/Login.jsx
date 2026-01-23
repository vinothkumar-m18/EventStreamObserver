import { useState } from "react";
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../styles/App.css';
import '../styles/Login.css';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.token) {
                alert('logged in successfully');
            }
            login(res.data.token);
        } catch (error) {
            console.log(error);
        }
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
            <div className = "auth-box">
                <h2>Login</h2>
                <form onSubmit={submit}>
                    <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
                    <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    );
}