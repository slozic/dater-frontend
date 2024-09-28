import React, { useState, useEffect } from "react";
import { fetchJwtToken, fetchOptionsWithJwtToken, parseJwtToken } from '../common/auth';
import { Link } from "react-router-dom";
import "../styling/Profile.css";
import ProfilePhotos from "./ProfilePhotos"; // Import the photos display component
import ProfilePhotosUpload from "./ProfilePhotosUpload"; // Import the upload component

function Profile() {
    const [user, setUser] = useState(null);
    const loggedInUserId = parseJwtToken(fetchJwtToken())?.sub; // Assuming you have a function to parse JWT

    useEffect(() => {
        let options = fetchOptionsWithJwtToken();
        fetch("http://localhost:8080/users", options)
            .then((response) => response.json())
            .then((data) => setUser(data))
            .catch((error) => console.log(error));
    }, []);

    const handleUploadPhoto = () => {
        document.getElementById("photo-upload").click(); // Trigger the hidden input
    };

    const handleUploadComplete = () => {
        // Refresh user photos after upload
        window.location.reload(); // Or trigger a specific refresh without reloading the entire page
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            {user ? (
                <div>
                    <Link to="/">Back to Home</Link>
                    <hr />
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Birthday:</strong> {user.birthday}</p>

                    {/* Display user photos */}
                    <ProfilePhotos userId={loggedInUserId} onUploadPhoto={handleUploadPhoto} />

                    {/* Hidden component to upload a photo */}
                    <ProfilePhotosUpload userId={loggedInUserId} onUploadComplete={handleUploadComplete} />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Profile;
