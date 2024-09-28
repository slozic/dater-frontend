import React, { useState } from "react";

function ProfilePhotosUpload({ userId, onUploadComplete }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        if (e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = (file) => {
        const formData = new FormData();
        formData.append("files", file);

        fetch(`http://localhost:8080/users/images`, {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("token"),
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                onUploadComplete(); // Notify the parent component to refresh the photo list
            })
            .catch((error) => console.log(error));
    };

    return (
        <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }} // Hide the file input, trigger it programmatically
            id="photo-upload"
        />
    );
}

export default ProfilePhotosUpload;
