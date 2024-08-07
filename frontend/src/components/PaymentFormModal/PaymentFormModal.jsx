import { useState,useEffect } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useSelector } from 'react-redux';
import "./PaymentFormModal.css"
import { fetchFriends } from '../../redux/friends';


const PaymentFormModal = () => {
    const [payeeid, setPayeeid] = useState('');
    const [status, setStatus] = useState('');
    const [amount, setAmount] = useState('');
    const { closeModal } = useModal();

    const dispatch = useDispatch();
    const currentUser = useSelector(state =>state.session.user)
    const friends = useSelector(state => state.friends.friends);

    useEffect(() => {
        dispatch(fetchFriends()); // Fetch friends when the component mounts
    }, [dispatch]);

    console.log(friends);


    const handleSubmit = (e) => {
        e.preventDefault();
        // Process payment logic here
        console.log({
            payeeid,
            status,
            amount,
            currentUser
        });

        closeModal()
    };

    return (
        <div className="container">
            <h2>Payment Form</h2>
            <form onSubmit={handleSubmit}>

                    <label htmlFor="payeeid">Payee ID</label>
                    <input
                        type="text"
                        id="payeeid"
                        value={payeeid}
                        onChange={(e) => setPayeeid(e.target.value)}
                        required
                    />

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
