import React, { useState, useEffect } from 'react';
import { fetchOptionsWithJwtToken } from '../common/auth';
import {Link, useNavigate} from "react-router-dom";

function DateAttendeeRequests({ dateId }) {
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch attendee requests when the component is loaded
    useEffect(() => {
        const options = fetchOptionsWithJwtToken();

        fetch(`http://localhost:8080/dates/${dateId}/attendees`, options)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch attendee requests.");
                }
                return response.json();
            })
            .then((data) => {
                setAttendees(data.dateAttendees);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [dateId]);

    if (loading) return <p>Loading attendee requests...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h3>Join Requests</h3>
            <ul>
                {attendees.length > 0 ? (
                    attendees.map((attendee) => (
                        <li key={attendee.id}>
                            <p>
                                User: {attendee.username} <br />
                                Date Status: {attendee.status.replace('_', ' ')}
                            </p>
                            <p>
                                <Link to={`/public-profile/${attendee.id}`}>Link to profile</Link>
                            </p>
                        </li>
                    ))
                ) : (
                    <p>No attendees have requested to join.</p>
                )}
            </ul>
        </div>
    );
}

export default DateAttendeeRequests;
