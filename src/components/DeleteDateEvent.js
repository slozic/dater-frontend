import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import '../styling/DeleteDateEvent.css';

function DeleteDateEvent({ dateId }) {
    const [showConfirm, setShowConfirm] = useState(false);  // To show/hide confirmation
    const navigate = useNavigate();  // Use useNavigate for redirection

    // Function to handle date deletion
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/dates/${dateId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Assuming you're storing the JWT in localStorage
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Date successfully deleted.');
                navigate('/dates');  // Redirect user to the list of dates after deletion
            } else {
                alert('Error deleting date. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting date:', error);
            alert('Error deleting date. Please try again.');
        }
    };

    // Confirmation logic
    const confirmDeletion = () => {
        setShowConfirm(true);  // Show the confirmation prompt
    };

    const cancelDeletion = () => {
        setShowConfirm(false);  // Hide the confirmation prompt
    };

    return (
        <div>
            {!showConfirm ? (
                <button className="delete-button" onClick={confirmDeletion}>Delete Date</button>
            ) : (
                <div className="confirmation-dialog">
                    <p>Are you sure you want to delete this date?</p>
                    <button className="confirm-button" onClick={handleDelete}>Yes</button>
                    <button className="cancel-button" onClick={cancelDeletion}>No</button>
                </div>
            )}
        </div>
    );
}

export default DeleteDateEvent;
