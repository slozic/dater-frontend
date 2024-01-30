import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {fetchJwtToken} from '../common/auth'
import "../styling/DateForm.css";

function DateForm() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");
    const navigation = useNavigate();

/*    const onDrop = (acceptedFiles) => {
        // Handle the dropped files, you may want to upload them to your server
        setImages(acceptedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image*//*",
        maxFiles: 3,
    });*/

    const handleImageChange = (event) => {
        const selectedImages = Array.from(event.target.files);
        setImages(selectedImages);
    };


    const handleSubmit = (event) => {
      event.preventDefault();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("scheduledTime", scheduledTime);

      // Append each image to the formData
      images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });

      fetch("http://localhost:8080/dates", {
        method: "POST",
        headers: {
          // No need to set Content-Type because it's automatically set by FormData
          "Authorization": fetchJwtToken(),
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error creating date event");
          }
          navigation("/my-dates");
        })
        .catch((error) => {
          console.error(error);
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
                {/* Dropzone for images */}
                <div className="dropzone">
                    <label>Upload Images:</label>
                        <input
                            type="file"
                            accept="image"
                            multiple
                            onChange={handleImageChange}
                        />
                 </div>
                <div className="form-buttons">
                    <button type="submit" className="form-button">Submit</button>
                    <button onClick={() => navigation("/my-dates")} className="form-button">Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default DateForm;
