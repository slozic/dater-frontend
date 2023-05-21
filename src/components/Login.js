import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import "../styling/Login.css";

function Login() {
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigation = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoggingIn(true);

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const token = response.headers.get("Authorization");
                // Store the token in local storage
                localStorage.setItem("token", token);
                // successful login, navigate to home page
                navigation("/");
            } else {
                const error = await response.json();
                setError(error.message);
            }
        } catch (error) {
            console.log(error);
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div>
            <Link to="/">Back to Home</Link>
            <hr />
            <h1>Login</h1>
            <form className="form-container" onSubmit={handleSubmit}>
                <div>
                    <label className="form-label">Email:</label>
                    <input className="form-input"
                        type="email"
                        value={username}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="form-label">Password:</label>
                    <input className="form-input"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button className="form-button" type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? "Logging In..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;
