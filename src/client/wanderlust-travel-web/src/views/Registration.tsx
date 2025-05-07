// client/src/component/Registration.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Registration.css";
import Axios from 'axios';

const Registration: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [userType, setUserType] = useState('Public'); // default to Public
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return passwordRegex.test(password);
    };

    const checkSignUpCode = async (code: string, userType: string): Promise<boolean> => {
        try {
            const response = await Axios.post('http://localhost:8080/verify-code', { code, userType });
            return response.data.isValid;
        } catch (error) {
            console.error('Error verifying sign-up code:', error);
            return false;
        }
    };

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePassword(password)) {
            setMessage('Password must contain at least 8 characters, including capital letters, small letters, and numbers');
            return;
        }

        const isValidCode = await checkSignUpCode(code, userType);
        if (!isValidCode) {
            setMessage('Invalid sign-up code for selected user type');
            return;
        }

        try {
            const response = await Axios.post('http://localhost:8080/auth/register', { username, email, password, userType, code });
            if (response.status === 201) {
                setMessage('Registration Successful');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setMessage('Registration Failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('Registration Failed');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="registration-page">
            <div className="registration-container">
                <h2>Registration</h2> <br />
                <form onSubmit={handleRegistration}>
                    <div className="form-group">
                        <label htmlFor="userType">I am registering as:</label>
                        <select onChange={(e) => setUserType(e.target.value)} value={userType}>
                            <option value="Public">Public</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username: <span className="required">*</span></label>
                        <input type="text" placeholder="Enter Username" minLength={10} title="Username must be at least 10 characters long" onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email: <span className="required">*</span></label>
                        <input type="email" placeholder="Enter Email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Please enter a valid email address" onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password: <span className="required">*</span></label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={(e) => setPassword(e.target.value)}
                            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                            title="Password must contain at least 8 characters, including capital letters, small letters, and numbers"
                            required
                        />
                        <button type="button" onClick={togglePasswordVisibility}>{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                    <div className="form-group">
                        <label htmlFor="code">Code: <span className="required">*</span></label>
                        <input type="text" placeholder="Enter Code" onChange={(e) => setCode(e.target.value)} required />
                    </div>

                    <button className="btn-registration" type="submit">Register</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default Registration;
