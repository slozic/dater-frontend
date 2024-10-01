import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styling/PublicProfile.css"; // Assuming you have a CSS file for styling

function PublicProfile() {
    const { userId } = useParams(); // Extract userId from URL params
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch public profile data on mount
    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8080/users/${userId}/public-profile`, {
                headers: {
                    Authorization: localStorage.getItem("token"), // Include token if needed
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching public profile:", error);
                    setError("Unable to load profile.");
                    setLoading(false);
                });
        }
    }, [userId]); // Use userId from useParams

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="public-profile-container">
            <h1>Public Profile</h1>
            <Link to="/dates" className="back-link">Back to Dates</Link>
                        <hr />
            {user ? (
                <div className="profile-info">
                    {/* Display User Information */}
                    <p>
                        <strong>Username:</strong> {user.username}
                    </p>
                    <p>
                        <strong>Full Name:</strong> {user.fullName}
                    </p>
                    <p>
                        <strong>Gender:</strong> {user.gender || "Not specified"}
                    </p>

                    {/* Display Profile Images */}
                    <div className="profile-images">
                        {user.profileImageData && user.profileImageData.length > 0 ? (
                            user.profileImageData.map((imageData, index) => (
                                <div key={index} className="profile-image-box">
                                    <img
                                        src={`data:image/jpeg;base64,${imageData.image}`}
                                        alt={`Profile Image ${index + 1}`}
                                        className="profile-image"
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No profile images available.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p>No profile found.</p>
            )}
        </div>
    );
}

export default PublicProfile;
