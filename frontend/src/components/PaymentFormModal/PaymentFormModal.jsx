import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchFriends } from '../../redux/friends';
import "./PaymentFormModal.css";

const PaymentFormModal = () => {
    const [payeeId, setPayeeId] = useState(''); // Changed variable name to match select value
    const [status, setStatus] = useState('');
    const [amount, setAmount] = useState('');
    const { closeModal } = useModal();

    const dispatch = useDispatch();
    const friends = useSelector(state => state.friends.friends);

    useEffect(() => {
        dispatch(fetchFriends()); // Fetch friends when the component mounts
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Process payment logic here
        console.log({
            payeeId,
            status,
            amount,
        });

        closeModal();
    };

    return (
        <div className="container">
            <h2>Payment Form</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="payeeId">Friend</label>
                <select
                    id="payeeId"
                    value={payeeId}
                    onChange={(e) => setPayeeId(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a friend</option>
                    {friends.map(friend => (
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
