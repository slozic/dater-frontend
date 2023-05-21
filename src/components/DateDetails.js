import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {fetchJwtToken, fetchOptionsWithJwtToken} from '../common/auth'
import '../styling/DateDetails.css'

function DateDetails() {
    const [dateDetails, setDateDetails] = useState(null);
    const [requestStatus, setRequestStatus] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        let options = fetchOptionsWithJwtToken();
        fetch(`http://localhost:8080/dates/${id}`, options)
            .then((response) => response.json())
            .then((data) => setDateDetails(data))
            .catch((error) => console.log(error));
    }, [id]);

    const handleJoinRequest = () => {
        let options = fetchOptionsWithJwtToken("POST");
        fetch(`http://localhost:8080/dates/${id}/attendees`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json", "Authorization": fetchJwtToken()},
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
            <hr/>
            {dateDetails ? (
                <div className="date-details">
                    <h2>Title: {dateDetails.title}</h2>
                    <p>Description: {dateDetails.description}</p>
                    <p>Location: {dateDetails.location}</p>
                    <p>Creator: {dateDetails.dateOwner}</p>
                    <p>Time: {dateDetails.scheduledTime}</p>
                    <p>Join status: {dateDetails.joinStatus}</p>
                    {dateDetails.joinStatus === "AVAILABLE" ? ( <button onClick={handleJoinRequest}>Request to join</button>) : (<p></p>)}
                    {requestStatus === "error" && <p className="error-message">Failed to send join request.</p>}
                    {requestStatus === "success" && <p className="success-message">Join request sent successfully.</p>}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default DateDetails;
