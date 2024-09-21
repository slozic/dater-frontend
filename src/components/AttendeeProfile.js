import React, { useState, useEffect } from "react";
import { fetchOptionsWithJwtToken } from "../common/auth";
import {Link, useNavigate} from "react-router-dom";
import "../styling/Profile.css";

function AttendeeProfile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let options = fetchOptionsWithJwtToken();
        fetch("http://localhost:8080/users", options)
            .then((response) => response.json())
            .then((data) => setUser(data))
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="profile-container">
            <h1>Attendee Profile</h1>
            {user ? (
                <div>
                    <Link to="/">Back to Home</Link>
                    <hr />
                    <p>
                        <strong> Name:</strong> {user.firstName} {user.lastName}
                    </p>
                    <p>
                        <strong>Username:</strong> {user.username}
                    </p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default AttendeeProfile;
