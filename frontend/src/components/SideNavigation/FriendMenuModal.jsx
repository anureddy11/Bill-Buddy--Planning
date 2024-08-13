import React from 'react';
import './FriendMenuModal.css';

const FriendMenuModal = ({ friend, onClose, onRemove }) => {
    const handleRemoveFriend = () => {
        onRemove(friend.id);
        onClose(); 
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-modal" onClick={onClose}>×</button>
                <h2>{friend.first_name} {friend.last_name}</h2>
                <p>Would you like to remove this friend?</p>
                <div className="modal-actions">
                    <button onClick={handleRemoveFriend} className="remove-button">Remove Friend</button>
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default FriendMenuModal;
