// client/src/components/Login.tsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';
import '../styles/Login.css';
import Axios from 'axios';

Axios.defaults.withCredentials = true;

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username');
        const _id = params.get('_id');
        const role = params.get('role');

        if (username && _id && role) {
            login(username, _id, role);
            navigate('/');
        }
    }, [login, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await Axios.post('http://localhost:8080/auth/login', { username, password });
            if (response.status === 200) {
                const { username, _id, role } = response.data;
                login(username, _id, role);
                setMessage(`Welcome Back ${username}`);
                navigate('/');  // Redirect based on role or other conditions if required
            } else {
                setMessage('Login Failed');
            }
        } catch (error) {
            setMessage('Login Failed. Please try again later.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username:<span style={{ color: 'red' }}>*</span></label>
                        <input type="text" id="username" placeholder="Enter Username" minLength={10} title="Username must be at least 10 characters long"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:<span style={{ color: 'red' }}>*</span></label>
                        <input type={showPassword ? "text" : "password"} id="password" placeholder="Enter Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={togglePasswordVisibility} className="btn-show-password">
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <button type="submit" className="btn-login">Login</button>
                    <div>
                        <button onClick={() => window.location.href = 'http://localhost:8080/auth/google'}>
                            Login with Google
                        </button>
                    </div>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default Login;
