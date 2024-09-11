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

        // Function to convert byte[] to Blob URL
    const byteArrayToUrl = (byteArray) => {
        const blob = new Blob([new Uint8Array(byteArray)], { type: "image/jpeg" }); // Assuming JPEG; adjust type if needed
        return URL.createObjectURL(blob);
    };

    // Fetch image data from the backend (working with byte[] in DateImageResponse)
    const fetchImageData = () => {
        let imageOptions = fetchOptionsWithJwtToken();
        fetch(`http://localhost:8080/dates/${id}/images`, imageOptions)
            .then(response => response.json())
            .then(data => {
                // Map the byte[] images to URLs
                const imageUrls = data.dateImageData.map(imageData => ({
                    id: imageData.id,
                    url: byteArrayToUrl(imageData.image) // Convert byte[] to URL
                }));
                setImages(imageUrls);
            })
            .catch(error => console.log(error));
    };

    useEffect(() => {
        let options = fetchOptionsWithJwtToken();
        fetch(`http://localhost:8080/dates/${id}`, options)
            .then((response) => response.json())
            .then((data) => {
                setDateDetails(data);
                fetchImageData();
            })
            .catch((error) => console.log(error));

        fetch(`http://localhost:8080/dates/${id}/attendees`, options)
            .then((response) => response.json())
            .then((data) => setAttendees(data))
            .catch((error) => console.log(error));
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

    return (
        <div>
            <Link to="/my-dates" className="back-link">Back to My Dates</Link>
            <hr />
            {dateDetails ? (
                <div>
                    <h2>Title: {dateDetails.title}</h2>
                    <p>Description: {dateDetails.description}</p>
                    <p>Location: {dateDetails.location}</p>
                    <p>Time: {dateDetails.scheduledTime}</p>
                    {/* Render multiple images */}
                    <div className="date-images-container">
                        {images.length > 0 ? (
                            images.map((image) => (
                                <img
                                    key={image.id}
                                    src={image.url}
                                    alt={`Date Image ${image.id}`}
                                    className="date-image"
                                />
                            ))
                        ) : (
                            <p>No images available</p>
                        )}
                    </div>
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
