import React, { useState, useEffect } from "react";
import { fetchOptionsWithJwtToken } from "../common/auth";
import {Link, useNavigate} from "react-router-dom";
import "../styling/Profile.css";

function Profile() {
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
            <h1>Profile</h1>
            {user ? (
                <div>
                    <Link to="/">Back to Home</Link>
                    <hr />
                    <p>
                        <strong>First Name:</strong> {user.firstName}
                    </p>
                    <p>
                        <strong>Last Name:</strong> {user.lastName}
                    </p>
                    <p>
                        <strong>Username:</strong> {user.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Birthday:</strong> {user.birthday}
                    </p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Profile;
