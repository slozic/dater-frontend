import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJwtToken, fetchOptionsWithJwtToken } from '../common/auth';
import '../styling/DateDetails.css';
import DateAttendeeStatus from './DateAttendeeStatus'; // Import the status component

function DateDetails() {
    const [dateDetails, setDateDetails] = useState(null);
    const [images, setImages] = useState([]); // Handle multiple images
    const [requestStatus, setRequestStatus] = useState(null);
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

                    {/* Include the DateAttendeeStatus component */}
                    <DateAttendeeStatus dateId={id} />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default DateDetails;
