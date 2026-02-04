import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJwtToken, fetchOptionsWithJwtToken, parseJwtToken } from '../common/auth';
import '../styling/DateDetails.css';
/*import '../styling/DeleteDateEvent.css';*/
import DateAttendeeRequests from './DateAttendeeRequests'; // Import attendee requests component
import DateRequest from './DateRequest'; // Import the DateRequest component
import DateImageUpload from './DateImageUpload'; // Import the DateImageUpload component
import DeleteDateEvent from './DeleteDateEvent'; // Import the DeleteDateEvent component

function DateDetails() {
    const [dateDetails, setDateDetails] = useState(null);
    const [images, setImages] = useState([]); // Define the `images` state
    const [isOwner, setIsOwner] = useState(false); // Track if user is the owner
    const [showRequests, setShowRequests] = useState(false); // To show/hide attendee requests
    const { id } = useParams(); // Date ID
    const loggedInUserId = parseJwtToken(fetchJwtToken())?.sub; // Assuming you have a function to parse JWT

    const formatDateTime = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Ensure 24-hour clock
        };
        const date = new Date(dateString); // Assuming `scheduledTime` is an ISO string
        return new Intl.DateTimeFormat('en-GB', options).format(date);
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
                        const imageUrls = data.dateImageData || [];
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
        <div className="date-details-container centered-container">
            <Link to="/dates" className="back-link">Back to Dates</Link>
            <hr />
            {dateDetails ? (
                <div className="date-details">
                    <h2>Title: {dateDetails.title}</h2>
                    <p>Description: {dateDetails.description}</p>
                    <p>Location: {dateDetails.location}</p>
                    <p>Creator: {dateDetails.dateOwner}</p>
                    <p>Date: {formatDateTime(dateDetails.scheduledTime)}h</p>

                    {/* Render the DateImageUpload component and pass the `images` and `dateId` */}
                    <DateImageUpload dateId={id} initialImages={images} isOwner={isOwner} />

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

                            {/* Render DeleteDateEvent button for the owner */}
                            <DeleteDateEvent dateId={id} />
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
