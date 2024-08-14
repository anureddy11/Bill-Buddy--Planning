import './DashboardPage.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PaymentFormModal from "../PaymentFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { thunkGetExpenses } from "../../redux/expenses";
import { fetchPayments } from "../../redux/payment";

const DashboardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.session.user);
    const expenses = useSelector(state => state.expense.allIds.map(id => state.expense.byId[id]));

    useEffect(() => {
        dispatch(thunkGetExpenses());
        dispatch(fetchPayments());
    }, [dispatch]);

    // Calculate the balance overview
    const balance = expenses.reduce(
        (acc, expense) => {
            expense.expenseShares.forEach(share => {
                // Exclude shares where the user is the owner of the expense
                if (share.user_id === user.id && user.id !== expense.owner_id) {
                    acc.owes += parseFloat(share.amount);
                } else if (share.user_id !== user.id && expense.ownerUsername === user.username) {
                    acc.owed += parseFloat(share.amount);
                }
            });
            return acc;
        },
        { owes: 0, owed: 0 }
    );

    // Calculate the "You Owe" and "You Are Owed" lists
    const youOwe = expenses.filter(expense =>
        expense.ownerUsername !== user.username && // Exclude expenses where the user is the owner
        expense.expenseShares.some(share => share.user_id === user.id)
    );

    const youAreOwed = expenses.filter(expense =>
        expense.ownerUsername === user.username && // Include only expenses where the user is the owner
        expense.expenseShares.some(share => share.user_id !== user.id)
    );

    return (
        <div className="Dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="buttons">
                    <button className="add-expense-button" onClick={() => navigate("/create-expense")}>Add an expense</button>
                    <OpenModalMenuItem
                        itemText={<button className="settle-up-button">Settle up</button>}
                        modalComponent={<PaymentFormModal />}
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
                        {youOwe.length > 0 ? youOwe.map(expense => {
                            const amountOwed = expense.expenseShares.find(share => share.user_id === user.id).amount;
                            return (
                                <li key={expense.id} className="balance-item">
                                    <div>
                                        <p>{expense.ownerUsername}</p>
                                        <p className="amount-owe">you owe ${amountOwed}</p>
                                    </div>
                                </li>
                            );
                        }) : <p>You don't owe anything</p>}
                    </ul>
                </div>
                <div className="you-are-owed-section">
                    <h2>YOU ARE OWED</h2>
                    <ul className="balances-list">
                        {youAreOwed.length > 0 ? youAreOwed.map(expense => {
                            const totalAmountOwed = expense.expenseShares
                                .filter(share => share.user_id !== user.id)
                                .reduce((acc, share) => acc + parseFloat(share.amount), 0);
                            return (
                                <li key={expense.id} className="balance-item">
                                    <div>
                                        <p>{expense.ownerUsername}</p>
                                        <p className="amount-owed">you are owed ${totalAmountOwed.toFixed(2)}</p>
                                    </div>
                                </li>
                            );
                        }) : <p>You are not owed anything</p>}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;
