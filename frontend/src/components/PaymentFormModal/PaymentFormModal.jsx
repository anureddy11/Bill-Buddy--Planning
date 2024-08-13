import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { addPayment } from '../../redux/payment'; // Import addPayment thunk
import "./PaymentFormModal.css";
import { thunkGetFriends } from "../../redux/friends";

const PaymentFormModal = () => {
    const [status, setStatus] = useState('');
    const [amount, setAmount] = useState('');
    const [friendId, setFriendId] = useState(''); // State to hold the selected friend ID
    const { closeModal } = useModal();

    const dispatch = useDispatch();
    const friends = useSelector(state => state.friend.byId);

    useEffect(() => {
        dispatch(thunkGetFriends()); // Fetch the friends list when the component mounts
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (friendId) {
            dispatch(addPayment(friendId, status, parseFloat(amount))); // Dispatch addPayment thunk with friendId
            closeModal();
        } else {
            alert("Please select a friend to make a payment.");
        }
    };

    return (
        <div className="container">
            <h2>Payment Form</h2>
            <form onSubmit={handleSubmit}>

                <label htmlFor="friendId">Friend</label>
                <select
                    id="friendId"
                    value={friendId}
                    onChange={(e) => setFriendId(e.target.value)}
                    required
                >
                    <option value="">Select a friend</option>
                    {Object.values(friends).map(friend => (
                        <option key={friend.id} value={friend.id}>
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
