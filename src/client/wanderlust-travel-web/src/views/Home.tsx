// Greeting.tsx
import React from "react";
import '../styles/Home.css'


const Home: React.FC<any> = () => {
    return (
        <div className="hero">
            <div className="hero-content">
                <h1 className="hero-text">Wanderlust Travel</h1>
                <p className="hero-description">
                    A good helper for traveling
                </p>
            </div>
            <div className="hero-image"></div>
        </div>
    );
}

export default Home;
