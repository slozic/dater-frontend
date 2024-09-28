import React, { useEffect, useState } from "react";
import "../styling/ProfilePhotos.css";

function ProfilePhotos({ userId, onUploadPhoto }) {
    const [photos, setPhotos] = useState([]);

    // Fetch user photos when the component is mounted
    useEffect(() => {
        fetch(`http://localhost:8080/users/images`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // Safely handle if profileImageData is undefined
                const images = data.profileImageData || [];
                setPhotos(images); // Set photos to an empty array if none are found
            })
            .catch((error) => console.log(error));
    }, []);

    const handleDeletePhoto = (photoId) => {
        fetch(`http://localhost:8080/users/photos/${photoId}`, {
            method: "DELETE",
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((response) => {
                if (response.ok) {
                    setPhotos(photos.filter((photo) => photo.id !== photoId));
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="photo-container">
            {photos.length > 0 ? (
                photos.map((photo, index) => (
                    <div key={photo.id} className="photo-box">
                        <img
                            src={`data:image/jpeg;base64,${photo.image}`} // Display base64-encoded image
                            alt="User profile"
                            className="user-photo"
                            onClick={() => handleDeletePhoto(photo.id)} // Click to delete
                        />
                    </div>
                ))
            ) : (
                <p>No photos uploaded yet.</p>
            )}

            {/* If the user has less than 3 photos, display empty boxes */}
            {photos.length < 3 && (
                Array.from({ length: 3 - photos.length }).map((_, index) => (
                    <div
                        key={index + photos.length}
                        className="photo-box empty"
                        onClick={() => onUploadPhoto()}
                    >
                        <p>Click to Upload</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default ProfilePhotos;
