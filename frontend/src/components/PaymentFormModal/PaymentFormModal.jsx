import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchFriends } from '../../redux/friends';
import { addPayment } from '../../redux/payment'; // Import addPayment thunk
import "./PaymentFormModal.css";

const PaymentFormModal = () => {
    const [selectedFriendName, setSelectedFriendName] = useState(''); // Changed to selectedFriendName
    const [status, setStatus] = useState('');
    const [amount, setAmount] = useState('');
    const { closeModal } = useModal();

    const dispatch = useDispatch();
    const friends = useSelector(state => state.friends.friends);

    useEffect(() => {
        dispatch(fetchFriends()); // Fetch friends when the component mounts
    }, [dispatch]);

    // Function to find the payeeId based on the selected friend's name
    const getPayeeId = (name) => {
        const friend = friends.find(friend => `${friend.first_name} ${friend.last_name}` === name);
        return friend ? friend.id : '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payeeId = getPayeeId(selectedFriendName); // Get payeeId based on selected friend's name
        // console.log(payeeId, status, amount)
        if (payeeId) {
            dispatch(addPayment(payeeId, status, parseFloat(amount))); // Dispatch addPayment thunk with payeeId
        }
        closeModal();
    };

    return (
        <div className="container">
            <h2>Payment Form</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="friend">Friend</label>
                <select
                    id="friend"
                    value={selectedFriendName}
                    onChange={(e) => setSelectedFriendName(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a friend</option>
                    {friends.map(friend => (
                        <option key={friend.id} value={`${friend.first_name} ${friend.last_name}`}>
                            {friend.first_name} {friend.last_name}
                        </option>
                    ))}
                </select>

                <label htmlFor="status">Status</label>
                <input
                    type="text"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                />

                <label htmlFor="amount">Amount</label>
                <input
                    type="number"
                    id="amount"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />

                <div className="form-group">
                    <button type="submit">Submit Payment</button>
                </div>
            </form>
        </div>
    );
};

export default PaymentFormModal;