import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // Using react-modal for showing larger images
import "../styling/ProfilePhotos.css";

// Set the root element for the modal to ensure accessibility when using react-modal
Modal.setAppElement("#root");

function ProfilePhotos({ userId, onUploadPhoto }) {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch user photos when the component is mounted
    useEffect(() => {
        fetch(`http://localhost:8080/users/images`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const images = data.profileImageData || [];
                setPhotos(images); // Set photos to an empty array if none are found
            })
            .catch((error) => console.log(error));
    }, []);

    // Delete photo by ID
    const handleDeletePhoto = (photoId) => {
        fetch(`http://localhost:8080/users/images/${photoId}`, {
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

    // Open modal with selected photo
    const handleOpenModal = (photo) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedPhoto(null);
        setIsModalOpen(false);
    };

    return (
        <div className="photo-container">
            {photos.length > 0 ? (
                photos.map((photo, index) => (
                    <div key={photo.id} className="photo-box">
                        {/* Image display */}
                        <img
                            src={`data:image/jpeg;base64,${photo.image}`}
                            alt="User profile"
                            className="user-photo"
                            onClick={() => handleOpenModal(photo)} // Click to open in larger modal
                        />
                        {/* Delete button */}
                        <button
                            className="profile-photo-delete-button"
                            onClick={() => handleDeletePhoto(photo.id)}
                        >
                            &times;
                        </button>
                    </div>
                ))
            ) : (
                <p>No photos uploaded yet.</p>
            )}

            {/* If the user has less than 3 photos, display empty boxes */}
            {photos.length < 3 &&
                Array.from({ length: 3 - photos.length }).map((_, index) => (
                    <div
                        key={index + photos.length}
                        className="photo-box empty"
                        onClick={() => onUploadPhoto()}
                    >
                        <p>Click to Upload</p>
                    </div>
                ))}

            {/* Modal for full-size photo viewing */}
            {selectedPhoto && (
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    className="modal"
                >
                    <div className="modal-content">
                        <img
                            src={`data:image/jpeg;base64,${selectedPhoto.image}`}
                            alt="Full-size image"
                            className="full-size-image"
                        />
                        <button className="close-modal" onClick={handleCloseModal}>
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default ProfilePhotos;
