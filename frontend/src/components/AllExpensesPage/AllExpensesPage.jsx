import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { getExpenses } from "../../redux/expenses";
import { thunkCreateComment } from "../../redux/comments"
import './AllExpensesPage.css';

const Expenses = () => {
    const dispatch = useDispatch()
    const [activeId, setActiveId] = useState(null)
    const [commentContent, setCommentContent] = useState("");
    const [selectedExpenseId, setSelectedExpenseId] = useState(null); // Tracking the currently selected expense or share


    useEffect(() => {
        dispatch(getExpenses())
    }, [])

    const expensesState = useSelector((state) => {
        return Object.values(state.expense)
    })

    // Handle the comment change in state
    const handleCommentChange = (e) => {
        setCommentContent(e.target.value)
    }

    const handleCommentSubmit = (expenseId, shareId = null) => {
        // Prepare the data payload based on whether it's for an expense or a specific share
        const payload = {
            expense_id: expenseId,
            content: commentContent,
        };
        if (shareId) {
            payload.share_id = shareId;
        }

        // Dispatch the create comment action
        dispatch(thunkCreateComment(expenseId, payload));
        setCommentContent(""); // Clear the textarea after submission
    };

    if (expensesState[0]) {
        const expenses = Object.values(expensesState[0])
        const shares = Object.values(expensesState[1])
        return (
            <>
                <div className="expense-content">
                    <div className="expenses-list">
                        <h2>Created Expenses</h2>
                        {expenses.map(expense => {
                            return (
                                <div key={expense.id} className="expense-items hover" onClick={() => activeId !== expense.id ? setActiveId(expense.id) : setActiveId(null)}>
                                    <p> Amount: ${expense.amount}</p>
                                    <p> Description: {expense.description}</p>
                                    <p> Settled: {expense.settled}</p>
                                    <p> Shares: </p>
                                    {expense.expenseShares.map(share => {
                                        return (
                                            <div key={share.id} className={expense.id === activeId ? 'expense-shares' : 'expense-shares hidden'}>
                                                <p>user: {share.username}</p>
                                                <p>amount: {share.amount}</p>
                                                <p>settled: {share.settled}</p>
                                                <textarea
                                                    value={commentContent}
                                                    onChange={handleCommentChange}
                                                    placeholder="Add a comment..."
                                                />
                                                <button onClick={() => handleCommentSubmit(expense.id, share.id)}>
                                                    POST
                                                </button>
                                            </div>
                                        )
                                    })}

                                </div>
                            )
                        })}
                    </div>
                    <div className="shares-list">
                        <h2>Expenses from others</h2>
                        {shares.map(share => {
                            return (
                                <div key={share.id} className="expense-items">
                                    <p> Amount: ${share.amount} </p>
                                    <p> Description: {share.description}</p>
                                    <p> Settled: {share.settled}</p>
                                    <textarea
                                        value={commentContent}
                                        onChange={handleCommentChange}
                                        placeholder="Add a comment..."
                                    />
                                    <button onClick={() => handleCommentSubmit(share.expense_id, share.id)}>
                                        POST
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>
        )
    }

    return (
        <h1>Loading...</h1>
    )
}


export default Expenses
