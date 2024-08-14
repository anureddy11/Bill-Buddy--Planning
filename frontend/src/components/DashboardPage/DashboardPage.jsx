import './DashboardPage.css';
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PaymentFormModal from "../PaymentFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { thunkGetUserShares, thunkGetUserCreatedExpenses } from "../../redux/expenses";
import { fetchPaymentsMade, fetchPaymentsReceived } from "../../redux/payment";

const DashboardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.session.user);
    const userShares = useSelector(state => state.expense.userShares || []);
    const userCreatedExpenses = useSelector(state => state.expense.userCreatedExpenses || []);
    const paymentsMade = useSelector(state => state.payments.paymentsMade || []);
    const paymentsReceived = useSelector(state => state.payments.paymentsReceived || []);

    const refreshData = useCallback(() => {
        dispatch(thunkGetUserShares());
        dispatch(thunkGetUserCreatedExpenses());
        dispatch(fetchPaymentsMade());
        dispatch(fetchPaymentsReceived());
    }, [dispatch]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);


    const balance = {
        owes: 0,
        owed: 0
    };

    const youOweList = userShares.map(share => {
        const totalPaidToOwner = paymentsMade
            .filter(payment => payment.payee_id === share.owner_id)
            .reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
        const amountOwed = parseFloat(share.amount) - totalPaidToOwner;

        if (amountOwed > 0) {
            balance.owes += amountOwed;
            return {
                first_name: share.first_name,
                last_name: share.last_name,
                amountOwed
            };
        }
        return null;
    }).filter(item => item !== null);

    const youAreOwedList = userCreatedExpenses.map(expense => {
        const totalReceivedFromUser = paymentsReceived
            .filter(payment => payment.payer_id === expense.user_id)
            .reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
        const totalOwed = parseFloat(expense.amount) - totalReceivedFromUser;

        if (totalOwed > 0) {
            balance.owed += totalOwed;
            return {
                first_name: expense.first_name,
                last_name: expense.last_name,
                totalOwed
            };
        }
        return null;
    }).filter(item => item !== null);

    return (
        <div className="Dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="buttons-dashboard">
                    <button className="add-expense-button" onClick={() => navigate("/create-expense")}>Add an expense</button>
                    <OpenModalMenuItem
                        itemText={<button className="settle-up-button">Settle up</button>}
                        modalComponent={<PaymentFormModal onPaymentSuccess={refreshData} />}
                    />
                </div>
            </div>

            <div className="balance-overview">
                <div className="balance-item">
                    <p>total balance</p>
                    <h3 className="negative-balance">${(balance.owed - balance.owes).toFixed(2)}</h3>
                </div>
                <div className="balance-item">
                    <p>you owe</p>
                    <h3 className="you-owe">${balance.owes.toFixed(2)}</h3>
                </div>
                <div className="balance-item">
                    <p>you are owed</p>
                    <h3>${balance.owed.toFixed(2)}</h3>
                </div>
            </div>

            <div className="balances">
                <div className="you-owe-section">
                    <h2>YOU OWE</h2>
                    <ul className="balances-list">
                        {youOweList.length > 0 ? youOweList.map((item, index) => (
                            <li key={index} className="balance-item">
                                <div>
                                    <p className='username-balance'>{item.first_name} {item.last_name}</p>
                                    <p className="amount-owe">you owe ${item.amountOwed.toFixed(2)}</p>
                                </div>
                            </li>
                        )) : <p>You don't owe anything</p>}
                    </ul>
                </div>
                <div className="you-are-owed-section">
                    <h2>YOU ARE OWED</h2>
                    <ul className="balances-list">
                        {youAreOwedList.length > 0 ? youAreOwedList.map((item, index) => (
                            <li key={index} className="balance-item">
                                <div>
                                    <p className='username-balance'>{item.first_name} {item.last_name}</p>
                                    <p className="amount-owed">owes you ${item.totalOwed.toFixed(2)}</p>
                                </div>
                            </li>
                        )) : <p>You are not owed anything</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
