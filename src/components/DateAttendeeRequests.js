import React, { useState, useEffect } from 'react';
import { fetchOptionsWithJwtToken } from '../common/auth';
import { Link } from "react-router-dom";
import '../styling/DateAttendeeRequests.css';

function DateAttendeeRequests({ dateId }) {
    const [attendees, setAttendees] = useState([]);
    const [acceptedAttendee, setAcceptedAttendee] = useState(null); // Track accepted attendee
    const [rejectedAttendees, setRejectedAttendees] = useState([]); // Track rejected attendees
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch attendee requests when the component is loaded
    useEffect(() => {
        fetchAttendees();
    }, [dateId]);

    const fetchAttendees = () => {
        const options = fetchOptionsWithJwtToken();

        fetch(`http://localhost:8080/dates/${dateId}/attendees`, options)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch attendee requests.");
                }
                return response.json();
            })
            .then((data) => {
                const accepted = data.dateAttendees.find(attendee => attendee.status === "ACCEPTED");
                const activeAttendees = data.dateAttendees.filter(attendee => attendee.status !== "REJECTED" && attendee.status !== "ACCEPTED");
                const rejected = data.dateAttendees.filter(attendee => attendee.status === "REJECTED");

                setAcceptedAttendee(accepted);
                setAttendees(activeAttendees);
                setRejectedAttendees(rejected);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    };

    // Handle accept request
    const handleAccept = (userId) => {
        const options = {
            ...fetchOptionsWithJwtToken(),
            method: "PUT",
        };

        fetch(`http://localhost:8080/dates/${dateId}/attendees/${userId}`, options)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to accept the attendee.");
                }
                return response.json();
            })
            .then(() => {
                fetchAttendees(); // Refetch attendees after acceptance
            })
            .catch((error) => {
                setError("Error accepting the attendee: " + error.message);
            });
    };

    // Handle reject request
    const handleReject = (userId) => {
        const options = {
            ...fetchOptionsWithJwtToken(),
            method: "DELETE",
        };

        fetch(`http://localhost:8080/dates/${dateId}/attendees/${userId}`, options)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to reject the attendee.");
                }
                return response.json();
            })
            .then(() => {
                fetchAttendees(); // Refetch attendees after rejection
            })
            .catch((error) => {
                setError("Error rejecting the attendee: " + error.message);
            });
    };

    if (loading) return <p>Loading attendee requests...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="date-attendee-requests">
            <ul>
                {/* Render the accepted attendee with special styling */}
                {acceptedAttendee && (
                    <li key={acceptedAttendee.id} className="attendee-item accepted-attendee">
                        <p>
                            <strong>Your date for the night:</strong> {acceptedAttendee.username} <br />
                            {/*Date Status: {acceptedAttendee.status.replace('_', ' ')}*/}
                        </p>
                        <p>
                            <Link to={`/public-profile/${acceptedAttendee.id}`}>View Profile</Link>
                        </p>
                    </li>
                )}

                {/* Render the pending requests (non-accepted, non-rejected) */}
                {attendees.length > 0 ? (
                    attendees.map((attendee) => (
                        <li key={attendee.id} className="attendee-item">
                            <p>
                                User request: {attendee.username} <br />
                                {/*{attendee.status.replace('_', ' ')}*/}
                            </p>
                            <p>
                                <Link to={`/public-profile/${attendee.id}`}>View Profile</Link>
                            </p>
                            <div className="attendee-actions">
                                <button
                                    className="accept-button"
                                    onClick={() => handleAccept(attendee.id)}
                                    disabled={!!acceptedAttendee} // Disable if one attendee is already accepted
                                >
                                    Accept
                                </button>
                                <button
                                    className="reject-button"
                                    onClick={() => handleReject(attendee.id)}
                                    disabled={!!acceptedAttendee} // Disable if one attendee is already accepted
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No pending attendees.</p>
                )}
            </ul>

            {/* Render the rejected attendees separately */}
            {rejectedAttendees.length > 0 && (
                <div className="rejected-attendees-section">
                    <h4>Rejected Requests</h4>
                    <ul>
                        {rejectedAttendees.map((attendee) => (
                            <li key={attendee.id} className="attendee-item rejected-attendee">
                                <p>
                                    User request: {attendee.username} <br />
                                    Status: Rejected
                                </p>
                                <p>
                                    <Link to={`/public-profile/${attendee.id}`}>View Profile</Link>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default DateAttendeeRequests;
