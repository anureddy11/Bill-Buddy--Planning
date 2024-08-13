import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetExpenses } from '../../redux/expenses';
import { thunkGetComments, thunkCreateComment, thunkDeleteComment } from '../../redux/comments';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AllExpensesPage.css';


const AllExpensesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const expenses = useSelector((state) =>
        state.expense.allIds.map(id => state.expense.byId[id])
    );

    const comments = useSelector((state) => state.comments.comments);

    const currentUserId = useSelector((state) => state.session.user?.id); // Get the current user's ID
    const currentUserName = useSelector((state) => state.session.user?.username)
    const error = useSelector((state) => state.expense.error);

    const [newComment, setNewComment] = useState({});

    const [expandedExpense, setExpandedExpense] = useState(null);

    useEffect(() => {
        dispatch(thunkGetExpenses());
    }, [dispatch]);

    const handleIsHidden = (ownerUsername) => {
        if (ownerUsername === currentUserName) {
            return ""
        }
        return "hidden"
    }

    const handleIsHiddenDelete = (ownerUsername, expenseShares) => {
        if (ownerUsername === currentUserName) {
            for (let i = 0; i < expenseShares; i++) {
                if (expenseShares[i].settled === "yes") {
                    return "hidden"
                }
            }
            return ""
        }
        return "hidden"
    }

    const handleCommentChange = (expenseId, content) => {
        setNewComment({
            ...newComment,
            [expenseId]: content,
        });
    };

    const handleCommentSubmit = async (expenseId) => {
        if (newComment[expenseId]?.trim()) {
            await dispatch(thunkCreateComment(expenseId, { content: newComment[expenseId] }));
            setNewComment({ ...newComment, [expenseId]: '' });
            dispatch(thunkGetComments(expenseId));
        }
    };

    const handleDeleteComment = async (expenseId, commentId) => {
        dispatch(thunkDeleteComment(expenseId, commentId));
        dispatch(thunkGetComments(expenseId));
    }

    const toggleExpense = (expenseId) => {
        if (expandedExpense === expenseId) {
            setExpandedExpense(null);
        } else {
            setExpandedExpense(expenseId);
            dispatch(thunkGetComments(expenseId));
        }
    };

    return (
        <div className="all-expenses-page">
            <h1>All Expenses</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="expenses-list">
                {expenses.length > 0 ? (
                    expenses.map(expense => (
                        <div key={expense.id} className="expense-item">
                            <div className="expense-header" onClick={() => toggleExpense(expense.id)}>
                                <h2>{expense.description}</h2>
                                <p><strong>Amount:</strong> ${parseFloat(expense.amount).toFixed(2)}</p>
                                <p className={`settled-status ${expense.settled === 'yes' ? 'settled' : 'unsettled'}`}>
                                    {expense.settled === 'yes' ? 'Settled' : 'Unsettled'}
                                </p>
                                <span className="chevron-icon">
                                    {expandedExpense === expense.id ? <FaChevronUp /> : <FaChevronDown />}
                                </span>
                            </div>
                            {expandedExpense === expense.id && (
                                <>
                                    <div className="expense-details">
                                        <p><strong>Created by:</strong> {expense.ownerUsername}</p>
                                        {currentUserName === expense.ownerUsername && (
                                            <div className='manage-expense'>
                                                <button
                                                    id='AllExpenses-update-button'
                                                    onClick={() => navigate(`/update-expense/${expense.id}`)}
                                                    className={handleIsHidden(expense.ownerUsername)}>
                                                    Update
                                                </button>
                                                <button
                                                    id='AllExpenses-delete-button'
                                                    className={handleIsHiddenDelete(expense.ownerUsername, expense.expenseShares)}>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="expense-shares">
                                        <h3>Shares:</h3>
                                        {expense.expenseShares.map(share => (
                                            <div key={share.user_id} className="share-item">
                                                <p><strong>{share.username}:</strong> ${parseFloat(share.amount).toFixed(2)} - {share.settled === 'yes' ? 'Settled' : 'Unsettled'}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="expense-comments">
                                        <h3>Comments:</h3>
                                        <div className="comments-list">
                                            {Object.values(comments).filter(comment => comment.expenseId === expense.id).map(comment => (
                                                <div key={comment.id} className="comment-item">
                                                    <p><strong>{comment.user.firstName} {comment.user.lastName}</strong>: {comment.content}</p>
                                                    {
                                                        comment.userId === currentUserId && (
                                                            <button id='delete-comments-button' onClick={() => handleDeleteComment(comment.expenseId, comment.id)}>Delete</button>
                                                        )
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                        <textarea
                                            value={newComment[expense.id] || ''}
                                            onChange={(e) => handleCommentChange(expense.id, e.target.value)}
                                            placeholder="Add a comment..."
                                        />
                                        <button onClick={() => handleCommentSubmit(expense.id)}>Post Comment</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No expenses to show.</p>
                )}
            </div>
        </div>
    );
};

export default AllExpensesPage;
