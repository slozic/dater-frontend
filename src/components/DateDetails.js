import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJwtToken, fetchOptionsWithJwtToken, parseJwtToken } from '../common/auth';
import '../styling/DateDetails.css';
import DateAttendeeStatus from './DateAttendeeStatus'; // Import attendee status
import DateAttendeeRequests from './DateAttendeeRequests'; // Import attendee requests component
import DateRequest from './DateRequest'; // Import the DateRequest component

function DateDetails() {
    const [dateDetails, setDateDetails] = useState(null);
    const [images, setImages] = useState([]);
    const [isOwner, setIsOwner] = useState(false); // Track if user is the owner
    const [showRequests, setShowRequests] = useState(false); // To show/hide attendee requests
    const { id } = useParams(); // Date ID
    const loggedInUserId = parseJwtToken(fetchJwtToken())?.sub; // Assuming you have a function to parse JWT

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
                setIsOwner(data.dateOwnerId === loggedInUserId); // Check if the user is the owner

                // Fetch images associated with the date
                fetch(`http://localhost:8080/dates/${id}/images`, options)
                    .then(response => response.json())
                    .then(data => {
                        const imageUrls = data.dateImageData.map(imgData => base64ToUrl(imgData.image, imgData.mimeType || "image/jpeg"));
                        setImages(imageUrls);
                    })
                    .catch(error => console.log("Error fetching images: ", error));
            })
            .catch(error => console.log("Error fetching date details: ", error));
    }, [id, loggedInUserId]);

    const handleShowRequests = () => {
        setShowRequests(!showRequests); // Toggle the request list
    };

    return (
        <div className="date-details-container">
            <Link to="/dates" className="back-link">Back to Dates</Link>
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

                    {/* Render DateRequest component to allow users to request to join */}
                    <DateRequest dateId={id} isDateOwner={isOwner} />

                    {/* Only show attendee requests button if the user is the date owner */}
                    {isOwner && (
                        <div>
                            <p>Click to view requests to join your date</p>
                            <button onClick={handleShowRequests}>
                                {showRequests ? "Hide Date Requests" : "Show Date Requests"}
                            </button>
                            {showRequests && <DateAttendeeRequests dateId={id} />}
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default DateDetails;
