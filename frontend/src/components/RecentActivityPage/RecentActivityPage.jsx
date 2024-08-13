import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayments, updatePayment, deletePayment } from '../../redux/payment';
import './RecentActivityPage.css';

function RecentActivityPage() {
    const dispatch = useDispatch();
    const payments = useSelector(state => state.payments.payments);
    const error = useSelector(state => state.payments.error);
    const current_user = useSelector(state => state.session.user);

    // State for managing the editing form
    const [editingPaymentId, setEditingPaymentId] = useState(null); // ID of the payment currently being edited
    const [updatedAmount, setUpdatedAmount] = useState(''); // Amount for the payment being edited
    const [updatedStatus, setUpdatedStatus] = useState(''); // Status for the payment being edited
    const [payeeId, setPayeeId] = useState(null); // Payee ID for the payment being edited

    // Fetch all payments on component mount
    useEffect(() => {
        dispatch(fetchPayments());
    }, [dispatch]);

    // Handle payment deletion with confirmation
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this payment?')) {
            dispatch(deletePayment(id));
        }
    };

    // Set the editing state when clicking on edit
    const handleEditClick = (payment) => {
        setEditingPaymentId(payment.id);
        setUpdatedAmount(payment.amount);
        setUpdatedStatus(payment.status);
        setPayeeId(payment.payee_id); // Set payee_id for editing
    };

    // Handle updating the payment
    const handleUpdate = (id) => {
        dispatch(updatePayment(id, payeeId, updatedAmount, updatedStatus)); // Include payee_id
        setEditingPaymentId(null); // Reset editing state
    };

    if (error) {
        return <div>Error: {error}</div>; // Display error if any
    }

    // Filter payments by payee_id and payer_id for the current user
    const receivedPayments = payments.filter(payment => payment.payee_id === current_user.id); // Payments received
    const givenPayments = payments.filter(payment => payment.payer_id === current_user.id); // Payments given

    // Sort payments by created_at in descending order
    const sortedPayments = (payments) =>
        payments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className="recent-activity">
            <h1>Recent Activity</h1>

            {/* Section for Payments Received */}
            <div className="payment-section">
                <h2>Payments Received</h2>
                <div className="payment-cards">
                    {sortedPayments(receivedPayments).map(payment => (
                        <div key={payment.id} className="payment-card">
                            {editingPaymentId === payment.id ? (
                                <>
                                    <div className="payment-details">
                                        <input
                                            type="number"
                                            value={updatedAmount}
                                            onChange={(e) => setUpdatedAmount(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={updatedStatus}
                                            onChange={(e) => setUpdatedStatus(e.target.value)}
                                        />
                                    </div>
                                    <div className="payment-actions">
                                        <button onClick={() => handleUpdate(payment.id)}>Save</button>
                                        <button onClick={() => setEditingPaymentId(null)}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="payment-details">
                                        <p>Amount: {payment.amount}</p> {/* Payment amount */}
                                        <p>Status: {payment.status}</p> {/* Payment status */}
                                        <p>Payer: {payment.payer_id}</p> {/* ID of the payer */}
                                        <p>Comments: {payment.comments && payment.comments.content ? payment.comments.content : 'None'}</p>
                                        <p>Created At: {new Date(payment.created_at).toLocaleDateString()}</p> {/* Payment creation date */}
                                    </div>
                                    <div className="payment-actions">
                                        <button onClick={() => handleEditClick(payment)}>Update</button>
                                        <button onClick={() => handleDelete(payment.id)} className="delete-btn">Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Section for Payments Given */}
            <div className="payment-section">
                <h2>Payments Given</h2>
                <div className="payment-cards">
                    {sortedPayments(givenPayments).map(payment => (
                        <div key={payment.id} className="payment-card">
                            {editingPaymentId === payment.id ? (
                                <>
                                    <div className="payment-details">
                                        <input
                                            type="number"
                                            value={updatedAmount}
                                            onChange={(e) => setUpdatedAmount(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={updatedStatus}
                                            onChange={(e) => setUpdatedStatus(e.target.value)}
                                        />
                                    </div>
                                    <div className="payment-actions">
                                        <button onClick={() => handleUpdate(payment.id)}>Save</button>
                                        <button onClick={() => setEditingPaymentId(null)}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="payment-details">
                                        <p>Amount: {payment.amount}</p> {/* Payment amount */}
                                        <p>Status: {payment.status}</p> {/* Payment status */}
                                        <p>Payee: {payment.payee_id}</p> {/* ID of the payee */}
                                        <p>Comments: {payment.comments && payment.comments.content ? payment.comments.content : 'None'}</p>
                                        <p>Created At: {new Date(payment.created_at).toLocaleDateString()}</p> {/* Payment creation date */}
                                    </div>
                                    <div className="payment-actions">
                                        <button onClick={() => handleEditClick(payment)}>Update</button>
                                        <button onClick={() => handleDelete(payment.id)} className="delete-btn">Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RecentActivityPage;
