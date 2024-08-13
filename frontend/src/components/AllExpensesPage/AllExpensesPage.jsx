import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getExpenses } from "../../redux/expenses";
import { thunkCreateComment, thunkGetComments } from "../../redux/comments";

import './AllExpensesPage.css';

const Expenses = () => {
    const dispatch = useDispatch();
    const [activeId, setActiveId] = useState(null);
    const [commentContent, setCommentContent] = useState({}); // Store content of comments by shareId


    // Grabbing states
    const expensesState = useSelector((state) => {
        return Object.values(state.expense);
    });

    const expenseId = expensesState[0]
    console.log(expenseId)

    const commentsState = useSelector((state) => {
        return Object.values(state.comments.comments)
    })


    useEffect(() => {
        dispatch(getExpenses());
        dispatch(thunkGetComments(expenseId))
    }, [dispatch]);

    // Handle the comment change in state 
    const handleCommentChange = (shareId, content) => {
        setCommentContent({
            ...commentContent,
            [shareId]: content, // Store comment content specific to each share
        });
    };

    const handleCommentSubmit = (expenseId, shareId = null) => {
        // Prepare the data payload based on whether it's for an expense or a specific share
        const payload = {
            expense_id: expenseId,
            content: commentContent[shareId] || "", // Retrieve content for the specific share
        };
        if (shareId) {
            payload.share_id = shareId;
        }

        // Dispatch the create comment action
        dispatch(thunkCreateComment(expenseId, payload));
        setCommentContent({ ...commentContent, [shareId]: "" }); // Clear the specific textarea after submission
    };

    // Filter comments based on expenseId
    const getCommentsForExpense = (expenseId) => {
        return Object.values(commentsState).filter(comment => comment.expense_id === expenseId)
    }

    if (expensesState[0]) {
        const expenses = Object.values(expensesState[0]);
        const shares = Object.values(expensesState[1]);
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
                                                <p>User: {share.username}</p>
                                                <p>Amount: {share.amount}</p>
                                                <p>Settled: {share.settled}</p>
                                                <textarea
                                                    value={commentContent[share.id] || ""} // Bind the specific comment content to the textarea
                                                    onChange={(e) => handleCommentChange(share.id, e.target.value)} // Update the comment content
                                                    placeholder="Add a comment..."
                                                />
                                                <button onClick={() => handleCommentSubmit(expense.id, share.id)}>
                                                    POST
                                                </button>
                                                <div className="comments-list">
                                                    {getCommentsForExpense(expense.id).map(comment => (
                                                        <div key={comment.id} className="comment-item">
                                                            <p><strong>{comment.user.first_name} {comment.user.last_name}</strong>: {comment.content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
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
                                        value={commentContent[share.id] || ""} // Bind the specific comment content to the textarea
                                        onChange={(e) => handleCommentChange(share.id, e.target.value)} // Update the comment content
                                        placeholder="Add a comment..."
                                    />
                                    <button onClick={() => handleCommentSubmit(share.expense_id, share.id)}>
                                        POST
                                    </button>
                                    <div className="comments-list">
                                        {getCommentsForExpense(share.expense_id).map(comment => (
                                            <div key={comment.id} className="comment-item">
                                                <p><strong>{comment.user.first_name} {comment.user.last_name}</strong>: {comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }

    return (
        <h1>Loading...</h1>
    );
};

export default Expenses;
