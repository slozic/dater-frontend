import React, { useState } from "react";
import "../styling/Registration.css";
import {fetchJwtToken} from "../common/auth";
import {Link, useNavigate} from "react-router-dom";

function Registration() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setDateOfBirth] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigation = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform registration logic here
        const registration = {
            firstName,
            lastName,
            username,
            password,
            email,
            birthday,
        };
        fetch("http://localhost:8080/users/registration", {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": fetchJwtToken()},
            body: JSON.stringify(registration),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error creating new registration");
                }
                // Reset the form fields after successful registration
                setFirstName("");
                setLastName("");
                setUsername("");
                setPassword("");
                setEmail("");
                setDateOfBirth("");
                setMessage("Registration successful!")
            })
            .catch((error) => {
                console.log(error);
                setError("Error creating registration!");
            });
    };

    return (
        <div className="registration-container">
            <Link to="/">Back to Home</Link>
            <hr />
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        value={birthday}
                        onChange={(event) => setDateOfBirth(event.target.value)}
                    />
                </div>
                {error && <div className="error">{error}</div>}
                {message && <div className="message">{message}</div>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Registration;
