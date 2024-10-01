import React, { useState, useEffect } from "react";
import { fetchOptionsWithJwtToken } from '../common/auth';

function DateRequest({ dateId, isDateOwner }) {
    const [status, setStatus] = useState(null); // To hold the join status
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch the current attendee status (if any) for the user
    useEffect(() => {
        const options = fetchOptionsWithJwtToken();

        fetch(`http://localhost:8080/dates/${dateId}/attendees/status`, options)
            .then((response) => response.json())
            .then((data) => {
                setStatus(data.joinDateStatus); // e.g., NOT_REQUESTED, ON_WAITLIST, ACCEPTED
            })
            .catch((error) => {
                setError("Error fetching status.");
                console.error(error);
            });
    }, [dateId]);

    // Function to send a join request
    const handleJoinRequest = () => {
        setLoading(true); // Set loading state
        const options = fetchOptionsWithJwtToken();
        options.method = "POST"; // Set the HTTP method

        fetch(`http://localhost:8080/dates/${dateId}/attendees`, options)
            .then((response) => response.json())
            .then((data) => {
                setStatus(data.joinDateStatus); // Update status based on response
                setLoading(false);
            })
            .catch((error) => {
                setError("Error sending join request.");
                setLoading(false);
                console.error(error);
            });
    };

    if (loading) return <p>Requesting to join...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {/* If user has not requested yet, show the request button */}
            {status === "NOT_REQUESTED" && !isDateOwner && (
                <button onClick={handleJoinRequest}>
                    Request to Join
                </button>
            )}

            {/* Show appropriate feedback based on the status */}
            {!isDateOwner && status === "ON_WAITLIST" && <p>You are on the waitlist for this date.</p>}
            {!isDateOwner && status === "ACCEPTED" && <p>Your request to join has been accepted.</p>}

            {/* Fallback for when the status is unknown or still loading */}
            {status === null && <p>Loading status...</p>}
        </div>
    );
}

export default DateRequest;
