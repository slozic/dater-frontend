import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchJwtToken } from "../common/auth";
import "../styling/DateForm.css";

function DateForm() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [error, setError] = useState("");
    const [dateCreated, setDateCreated] = useState(false); // Tracks if the date was created
    const [dateId, setDateId] = useState(null); // Stores the created date's ID
    const [images, setImages] = useState([]); // Stores the uploaded images
    const navigation = useNavigate();

    // Submit date form
    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = {
            title,
            location,
            description,
            scheduledTime,
        };

        fetch("http://localhost:8080/dates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": fetchJwtToken(),
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error creating date event");
                }
                return response.json(); // Assuming the backend returns the created date with the ID
            })
            .then((data) => {
                setDateId(data); // Set the newly created date ID
                setDateCreated(true); // Set date created flag
            })
            .catch((error) => {
                console.error(error);
                setError("Error creating date event");
            });
    };

    // Handle image upload form
    const handleImageUpload = (event) => {
        event.preventDefault();

        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append(`files`, image); // Append multiple images to FormData
        });

        fetch(`http://localhost:8080/dates/${dateId}/images`, {
            method: "POST",
            headers: {
                "Authorization": fetchJwtToken(),
            },
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error uploading images");
                }
                alert("Images uploaded successfully");
                navigation("/my-dates"); // Redirect to "my-dates" after success
            })
            .catch((error) => {
                console.error(error);
                setError("Error uploading images");
            });
    };

    // Handle multiple image selection
    const handleFileChange = (event) => {
        setImages(Array.from(event.target.files)); // Converts FileList to an array
    };

    return (
        <div className="form-container">
            <Link to="/dates">Back to Dates</Link>
            <hr />
            <h1 className="form-heading">New Date Form</h1>
            {!dateCreated ? (
                // Show the date creation form
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
                        {error && <div className="error">{error}</div>}
                        <button type="submit" className="form-button">Submit</button>
                        <button onClick={() => navigation("/")} className="form-button">Cancel</button>
                    </div>
                </form>
            ) : (
                // Show the image upload form after date creation
                <div>
                    <h2>Upload Images for Date</h2>
                    <form onSubmit={handleImageUpload}>
                        <div className="form-element">
                            <label className="form-label">Select Images (up to 3):</label>
                            <input
                                type="file"
                                className="form-input"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="form-button">Upload Images</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default DateForm;
