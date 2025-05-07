// client/src/components/Navbar.tsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/AuthContext';
import '../../styles/Navbar.css';
import logo from '../../assets/react.svg'

const Navbar: React.FC = () => {
    const { isAuthenticated, username, role, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={logo} className='navbar-logo' />
                <Link to="/" className="navbar-brand">
                    Wanderlust Travel
                </Link>
            </div>
            <div className="navbar-right">
                {isAuthenticated ? (
                    <>
                        {role === 'charityWorker' ? (
                            <>
                                <Link to="/DogsForCharityWorker" className="navbar-link">
                                    Dogs (CW)
                                </Link>
                                <Link to="/Messages" className="navbar-link">
                                    Messages
                                </Link>
                            </>
                        ) : role === 'publicUser' ? (
                            <>
                                <Link to="/DogsForLoginPublic" className="navbar-link">
                                    Dogs (PU)
                                </Link>
                                <Link to="/MyFavourites" className="navbar-link">
                                    My Favourites
                                </Link>
                                <Link to="/Messages" className="navbar-link">
                                    Messages
                                </Link>
                            </>
                        ) : null}
                        <div className="navbar-user">
                            <button className="navbar-logout" onClick={handleLogout}>
                                Logout
                            </button>
                            <span className="navbar-username">{username}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/Hotal" className="navbar-link">
                            Hotal
                        </Link>
                        <Link to="/Messages" className="navbar-link">
                            Messages
                        </Link>
                        <Link to="/Regist" className="navbar-link">
                            Register
                        </Link>
                        <Link to="/Login" className="navbar-link">
                            Login
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
