import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { addPayment } from '../../redux/payment';
import "./PaymentFormModal.css";
import { thunkGetFriends } from "../../redux/friends";

const PaymentFormModal = ({ onPaymentSuccess }) => {
    const [status, setStatus] = useState('');
    const [amount, setAmount] = useState('');
    const [friendId, setFriendId] = useState('');
    const { closeModal } = useModal();

    const dispatch = useDispatch();
    const friends = useSelector(state => state.friend.byId);

    useEffect(() => {
        dispatch(thunkGetFriends());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (friendId) {
            await dispatch(addPayment(friendId, status, parseFloat(amount)));
            if (onPaymentSuccess) onPaymentSuccess();
            closeModal();
        } else {
            alert("Please select a friend to make a payment.");
        }
    };

    return (
        <div className="payment-form-container">
            <button className="close-modal" onClick={closeModal}>&times;</button>
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
                {/* <label htmlFor="status">Status</label>
                <input
                    type="text"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                /> */}
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
