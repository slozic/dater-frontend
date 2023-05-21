import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {fetchJwtToken} from '../common/auth'
import "../styling/DateForm.css";

function DateForm() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [error, setError] = useState("");
    const navigation = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const newDate = {
            title,
            location,
            description,
            scheduledTime: scheduledTime,
        };
        fetch("http://localhost:8080/dates", {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": fetchJwtToken()},
            body: JSON.stringify(newDate),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error creating date event");
                }
                navigation("/");
            })
            .catch((error) => {
                console.log(error);
                setError("Error creating date event");
            });
    };

    return (
        <div className="form-container">
            <Link to="/dates">Back to Dates</Link>
            <hr/>
            <h1 className="form-heading">New Date Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-element">
                    <label className="form-label">Title:</label>
                    <input
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />
                </div>
                <div className="form-element">
                    <label className="form-label">Location:</label>
                    <input
                        type="text"
                        className="form-input"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        required
                    />
                </div>
                <div className="form-element">
                    <label className="form-label">Description:</label>
                    <textarea
                        className="form-input"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-element">
                    <label className="form-label">Scheduled Time:</label>
                    <input
                        type="datetime-local"
                        className="form-input"
                        value={scheduledTime}
                        onChange={(event) => setScheduledTime(event.target.value)}
                        required
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit" className="form-button">Submit</button>
                    <button onClick={() => navigation("/")} className="form-button">Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default DateForm;
