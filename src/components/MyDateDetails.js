import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOptionsWithJwtToken } from '../common/auth'
import { fetchJwtToken } from '../common/auth'
import '../styling/DateDetails.css'

function MyDateDetails() {
    const [dateDetails, setDateDetails] = useState(null);
    const [images, setImages] = useState([]); // Array to store image URLs converted from byte[]
    const [requestStatus, setRequestStatus] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const { id } = useParams();

    // Function to convert Base64 string to data URL
    const base64ToUrl = (base64String, mimeType = "image/jpeg") => {
        return `data:${mimeType};base64,${base64String}`;
    };

    // Fetching date details and images from backend
    useEffect(() => {
        const options = fetchOptionsWithJwtToken();

        // Fetch date details
        fetch(`http://localhost:8080/dates/${id}`, options)
            .then((response) => response.json())
            .then((data) => {
                setDateDetails(data);

                // Fetch images associated with the date
                fetch(`http://localhost:8080/dates/${id}/images`, options)
                    .then(response => response.json()) // Assuming your API sends back JSON data
                    .then(data => {
                        // Assuming `data.dateImageData` is an array of objects with a `image` property containing the Base64 string
                        const imageUrls = data.dateImageData.map(imgData => base64ToUrl(imgData.image, imgData.mimeType || "image/jpeg"));
                        setImages(imageUrls); // Set the URLs for images
                    })
                    .catch(error => console.log("Error fetching images: ", error));
            })
            .catch(error => console.log("Error fetching date details: ", error));
    }, [id]);

    const handleAccept = (userId) => {
        fetch(`http://localhost:8080/dates/${id}/attendees/${userId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json", "Authorization": fetchJwtToken()}
        })
            .then((response) => {
                if (response.ok) {
                    // Refresh the component after successful acceptance
                    window.location.reload();
                } else {
                    // Handle error or display error message
                    console.log('Error accepting user.');
                }
            })
            .catch((error) => console.log(error));
    };

    const handleJoinRequest = () => {
            const options = fetchOptionsWithJwtToken("POST");
            fetch(`http://localhost:8080/dates/${id}/attendees`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": fetchJwtToken(),
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to send join request.");
                    }
                    setRequestStatus("success");
                })
                .catch((error) => {
                    setRequestStatus("error");
                    console.log(error);
                });
        };

    return (
        <div>
            <Link to="/my-dates" className="back-link">Back to My Dates</Link>
            <hr />
            {dateDetails ? (
                <div className="date-details">
                    <h2>Title: {dateDetails.title}</h2>
                    <p>Description: {dateDetails.description}</p>
                    <p>Location: {dateDetails.location}</p>
                    <p>Creator: {dateDetails.dateOwner}</p>
                    <p>Time: {dateDetails.scheduledTime}</p>

                    {/* Render multiple images */}
                    <div className="date-images">
                        {images.length > 0 ? (
                            images.map((imageUrl, index) => (
                                <img key={index} src={imageUrl} alt={`Date Image ${index + 1}`} className="date-image" />
                            ))
                        ) : (
                            <p>No images available.</p>
                        )}
                    </div>

                    <p>Join status: {dateDetails.joinStatus}</p>
                    {dateDetails.joinStatus === "AVAILABLE" ? (
                        <button onClick={handleJoinRequest}>Request to join</button>
                    ) : (
                        <p></p>
                    )}
                    {requestStatus === "error" && (
                        <p className="error-message">Failed to send join request.</p>
                    )}
                    {requestStatus === "success" && (
                        <p className="success-message">Join request sent successfully.</p>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <h2>Date join requests:</h2>
            {attendees.length > 0 ? (
                <ul className="attendees-list">
                    {attendees.map((attendee) => (
                        <li key={attendee.id} className="attendees-item">
                            <span>Username: {attendee.username}</span>
                            {attendee.accepted ? (
                                <label>Accepted</label>
                            ) : (
                                <button onClick={() => handleAccept(attendee.id)}>Accept</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No attendees yet.</p>
            )}
        </div>
    );
}

export default MyDateDetails;
