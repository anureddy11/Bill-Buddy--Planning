import './SideNavigation.css';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { thunkGetFriends, thunkRequestFriend, thunkAcceptFriend, thunkRejectFriend, thunkRemoveFriend } from '../../redux/friends';
import FriendMenuModal from './FriendMenuModal';

function SideNavigation() {
    const dispatch = useDispatch();
    const friends = useSelector((state) => state.friend.byId);
    const pendingRequests = useSelector((state) => state.friend.pendingById);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedFriend, setSelectedFriend] = useState(null);

    useEffect(() => {
        dispatch(thunkGetFriends());
    }, [dispatch]);

    const openInviteModal = () => {
        setIsModalOpen(true);
    };

    const closeInviteModal = () => {
        setIsModalOpen(false);
        setUsername('');
        setError('');
        setSuccessMessage('');
    };

    const handleInvite = async () => {
        if (username.trim() === '') {
            setError('Username cannot be empty.');
            return;
        }

        const result = await dispatch(thunkRequestFriend(username));

        if (!result.success) {
            setError(result.message);
            setSuccessMessage('');
        } else {
            setError('');
            setSuccessMessage('Friend request sent successfully!');
            setTimeout(() => {
                closeInviteModal();
            }, 1500);
        }
    };

    const handleAccept = async (friendId) => {
        await dispatch(thunkAcceptFriend(friendId));
        dispatch(thunkGetFriends()); // Refresh the friends and pending requests list
    };

    const handleReject = async (friendId) => {
        await dispatch(thunkRejectFriend(friendId));
        dispatch(thunkGetFriends()); // Refresh the friends and pending requests list
    };

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
    };

    const handleRemoveFriend = async (friendId) => {
        await dispatch(thunkRemoveFriend(friendId));
        dispatch(thunkGetFriends()); // Refresh the friends list after removal
    };

    return (
        <>
            <nav className="sidebar">
                <ul>
                    <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
                    <li><NavLink to="/recent-activity" className={({ isActive }) => isActive ? "active" : ""}>Recent Activity</NavLink></li>
                    <li><NavLink to="/all-expenses" className={({ isActive }) => isActive ? "active" : ""}>All expenses</NavLink></li>
                    <div className='SideBar-friends'>Friends<button onClick={openInviteModal}>+ Add</button></div>
                    <ul>
                        {Object.values(friends).map(friend => (
                            <li key={friend.id} onClick={() => handleFriendClick(friend)}>
                                <NavLink to="#" className={({ isActive }) => isActive ? "active" : ""}>
                                    {friend.first_name} {friend.last_name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    {Object.values(pendingRequests).length > 0 && (
                        <div className="pending-requests">
                            <h3>Friend Requests</h3>
                            <ul>
                                {Object.values(pendingRequests).map(request => (
                                    <li key={request.id}>
                                        <span>{request.first_name} {request.last_name}</span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handleAccept(request.id)} className="accept-button">Accept</button>
                            <button onClick={() => handleReject(request.id)} className="reject-button">Reject</button>
                        </div>
                    )}
                </ul>
            </nav>

            {/* Modal for inviting friends */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-modal" onClick={closeInviteModal}>×</button>
                        <h2>Invite friends</h2>
                        <div className="modal-body">
                            <label>To:
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </label>
                            {error && <p className="error-message">{error}</p>}
                            {successMessage && <p className="success-message">{successMessage}</p>}
                        </div>
                        <div className="modal-footer">
                            <button className="send-invites" onClick={handleInvite}>Send invites and add friends</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for managing a friend */}
            {selectedFriend && (
                <FriendMenuModal
                    friend={selectedFriend}
                    onClose={() => setSelectedFriend(null)}
                    onRemove={handleRemoveFriend}
                />
            )}
        </>
    );
}

export default SideNavigation;
