import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOptionsWithJwtToken } from '../common/auth'
import { fetchJwtToken } from '../common/auth'
import '../styling/DateDetails.css'

function MyDateDetails() {
    const [dateDetails, setDateDetails] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        let options = fetchOptionsWithJwtToken();
        fetch(`http://localhost:8080/dates/${id}`, options)
            .then((response) => response.json())
            .then((data) => setDateDetails(data))
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
                    <p>Creator: {dateDetails.dateOwner}</p>
                    <p>Time: {dateDetails.scheduledTime}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <h2>Attendees:</h2>
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
