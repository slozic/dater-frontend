import React, { useState, useEffect } from "react";
import { fetchJwtToken, fetchOptionsWithJwtToken, parseJwtToken } from '../common/auth';
import { Link } from "react-router-dom";
import "../styling/Profile.css";
import ProfilePhotos from "./ProfilePhotos"; // Import the photos display component
import ProfilePhotosUpload from "./ProfilePhotosUpload"; // Import the upload component

function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formState, setFormState] = useState({
        firstName: "",
        lastName: "",
        username: "",
        birthday: ""
    });
    const [error, setError] = useState("");
    const loggedInUserId = parseJwtToken(fetchJwtToken())?.sub; // Assuming you have a function to parse JWT

    useEffect(() => {
        let options = fetchOptionsWithJwtToken();
        fetch("http://localhost:8080/users", options)
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
                setFormState({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    username: data.username || "",
                    birthday: data.birthday || ""
                });
            })
            .catch((error) => console.log(error));
    }, []);

    const handleUploadPhoto = () => {
        document.getElementById("photo-upload").click(); // Trigger the hidden input
    };

    const handleUploadComplete = () => {
        // Refresh user photos after upload
        window.location.reload(); // Or trigger a specific refresh without reloading the entire page
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setError("");
        if (user && !isEditing) {
            setFormState({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                username: user.username || "",
                birthday: user.birthday || ""
            });
        }
    };

    const handleProfileSave = (event) => {
        event.preventDefault();
        setError("");
        const options = fetchOptionsWithJwtToken();
        fetch("http://localhost:8080/users/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            },
            body: JSON.stringify(formState)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update profile.");
                }
                return response.json();
            })
            .then((data) => {
                setUser(data);
                setIsEditing(false);
            })
            .catch(() => setError("Could not update profile. Please try again."));
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            {user ? (
                <div>
                    <Link to="/">Back to Home</Link>
                    <hr />
                    {!isEditing ? (
                        <>
                            <p><strong>First Name:</strong> {user.firstName}</p>
                            <p><strong>Last Name:</strong> {user.lastName}</p>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Birthday:</strong> {user.birthday}</p>
                            <button onClick={handleEditToggle}>Edit Profile</button>
                        </>
                    ) : (
                        <form onSubmit={handleProfileSave}>
                            <div className="form-element">
                                <label className="form-label">First Name:</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formState.firstName}
                                    onChange={(event) => setFormState({ ...formState, firstName: event.target.value })}
                                />
                            </div>
                            <div className="form-element">
                                <label className="form-label">Last Name:</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formState.lastName}
                                    onChange={(event) => setFormState({ ...formState, lastName: event.target.value })}
                                />
                            </div>
                            <div className="form-element">
                                <label className="form-label">Username:</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formState.username}
                                    onChange={(event) => setFormState({ ...formState, username: event.target.value })}
                                />
                            </div>
                            <div className="form-element">
                                <label className="form-label">Birthday:</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formState.birthday}
                                    onChange={(event) => setFormState({ ...formState, birthday: event.target.value })}
                                />
                            </div>
                            {error && <div className="error">{error}</div>}
                            <div className="form-buttons">
                                <button type="submit" className="form-button">Save</button>
                                <button type="button" className="form-button" onClick={handleEditToggle}>Cancel</button>
                            </div>
                        </form>
                    )}

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
