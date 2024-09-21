import React, { useState, useEffect } from "react";
import { fetchOptionsWithJwtToken } from '../common/auth';

function DateAttendeeStatus({ dateId }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAttendeeStatus();
    }, []);

    // Function to fetch the attendee status
    const fetchAttendeeStatus = () => {
        setLoading(true);
        setError(null);

        const options = fetchOptionsWithJwtToken();
        fetch(`http://localhost:8080/dates/${dateId}/attendees/status`, options)
            .then((response) => response.json())
            .then((data) => {
                setStatus(data.joinDateStatus);
                setLoading(false);
            })
            .catch((error) => {
                setError("Error fetching status.");
                setLoading(false);
                console.log(error);
            });
    };

    // Convert status to a more user-friendly format
    const formatStatus = (status) => {
        if (status) {
            return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
        }
        return "Unknown Status";
    };

    return (
        <div className="attendee-status">
            {loading && <p>Loading status...</p>}
            {error && <p className="error-message">{error}</p>}
            {status && !loading && <p>Date request status: {formatStatus(status)}</p>}
            {!status && !loading && (
                <button onClick={fetchAttendeeStatus}>Check Status</button>
            )}
        </div>
    );
}

export default DateAttendeeStatus;
