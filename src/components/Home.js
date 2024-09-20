import React from "react";
import { Link } from "react-router-dom";
import "../styling/Home.css";

function Home() {

const token = localStorage.getItem("token");

    if(token === null){
        return (
            <div className="home-container">
                <h1>Welcome to the Real Dating App</h1>
                <div className="home-links">
                    <Link to="/login" className="home-link">Login</Link>
                    <Link to="/registration" className="home-link">Registration</Link>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="home-container">
                <h1>Welcome to the Real Dating App</h1>
                <div className="home-links">
                    <Link to="/new-date" className="home-link">Create a new date</Link>
                    <Link to="/dates" className="home-link">Browse dates</Link>
                    <Link to="/profile" className="home-link">Profile</Link>
                </div>
            </div>
        );
    }
}

export default Home;
