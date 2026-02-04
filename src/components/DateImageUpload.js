import React, { useState, useEffect } from "react";
import { fetchOptionsWithJwtToken } from "../common/auth";
import "../styling/DateImageUpload.css";
import Modal from 'react-modal';

function DateImageUpload({ dateId, initialImages, isOwner }) {
    const [images, setImages] = useState(initialImages || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const options = fetchOptionsWithJwtToken();

    useEffect(() => {
        setImages(initialImages || []);
    }, [initialImages]);

    // Function to handle image upload
    const handleImageUpload = async (event) => {
        const files = event.target.files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        try {
            const response = await fetch(`http://localhost:8080/dates/${dateId}/images`, {
                method: "POST",
                headers: {
                    ...options.headers,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setImages(data.dateImageData || []);
                // Reload the page after successful upload
                window.location.reload(); // Reload the page
            } else {
                console.error("Error uploading image");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    // Function to handle image delete
    const handleImageDelete = async (imageId) => {
        try {
            const response = await fetch(`http://localhost:8080/dates/${dateId}/images/${imageId}`, {
                method: "DELETE",
                headers: options.headers,
            });

            if (response.ok) {
                setImages(images.filter((img) => img.id !== imageId));
            } else {
                console.error("Error deleting image");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    // Function to open modal
    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    // Function to close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    // Render the upload boxes (max 3 boxes)
    const renderUploadBoxes = () => {
        const uploadBoxes = [];

        for (let i = 0; i < 3; i++) {
            if (images[i]) {
                // If there is an image, show it with delete option
                const imageSrc = images[i].imageUrl;
                uploadBoxes.push(
                    <div className="image-upload-container" key={images[i].id || i}>
                        <img
                            src={imageSrc}
                            alt={`Date Image ${i + 1}`}
                            className="uploaded-image"
                            onClick={() => openModal(imageSrc)}
                        />
                        {/* Show delete button only if the user is the owner */}
                        {isOwner && (
                            <button
                                className="date-image-upload-delete-button"
                                onClick={() => handleImageDelete(images[i].id)}
                            >
                                &times;
                            </button>
                        )}
                    </div>
                );
            } else if (isOwner) {
                // If there is no image and the user is the owner, show an empty upload box
                uploadBoxes.push(
                    <div className="image-upload-container" key={`upload-box-${i}`}>
                        <label className="upload-box">
                            <span>+</span>
                            <input type="file" onChange={handleImageUpload} />
                        </label>
                    </div>
                );
            }
        }

        return uploadBoxes;
    };

    return (
        <div className="image-upload-grid">
            {renderUploadBoxes()}

            {/* Modal for showing large image */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Zoomed Image"
                className="image-modal"
                overlayClassName="image-modal-overlay"
            >
                <img src={selectedImage} alt="Zoomed" className="modal-image" />
                <button onClick={closeModal} className="close-modal-button">&times;</button>
            </Modal>
        </div>
    );
}

export default DateImageUpload;
