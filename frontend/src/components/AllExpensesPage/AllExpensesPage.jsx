import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetExpenses } from '../../redux/expenses';
import { thunkGetComments, thunkCreateComment, thunkDeleteComment, thunkUpdateComment } from '../../redux/comments';
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
    const [editCommentId, setEditCommentId] = useState(null)
    const [editCommentContent, setEditCommentContent] = useState('')

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

    const handleEditComment = (comment) => {
        setEditCommentId(comment.id);
        setEditCommentContent(comment.content);
        setNewComment({
            ...newComment,
            [comment.expenseId]: comment.content, // Load the existing comment content into the textarea
        });
    };

    const handleUpdateComment = async (expenseId, commentId) => {
        if (editCommentContent.trim()) {
            const updatedComment = await dispatch(thunkUpdateComment(expenseId, commentId, { content: editCommentContent }));
            if (updatedComment) {
                setEditCommentId(null); // Exit edit mode
                setEditCommentContent(''); // Clear the input
                setNewComment({ ...newComment, [expenseId]: '' })
                dispatch(thunkGetComments(expenseId)); // Refresh comments
            }
        }
    };

    const handleCancelEdit = (expenseId) => {
        setEditCommentId(null);
        setNewComment({ ...newComment, [expenseId]: '' })
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
                                                    {editCommentId === comment.id ? (
                                                        <>
                                                            <textarea
                                                                value={editCommentContent}
                                                                onChange={(e) => setEditCommentContent(e.target.value)}
                                                                placeholder="Edit your comment..."
                                                            />
                                                            <div className='edit-actions'>
                                                                <button onClick={() => handleUpdateComment(expense.id, comment.id)}>Save</button>
                                                                <button className='cancel-button' onClick={() => handleCancelEdit(expense.id)}>Cancel</button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p><strong>{comment.user.firstName} {comment.user.lastName}</strong>: {comment.content}</p>
                                                            {comment.userId === currentUserId && (
                                                                <div className="comment-actions">
                                                                    <button id='AllExpenses-update-button' onClick={() => handleEditComment(comment)}>Update</button>
                                                                    <button id='AllExpenses-delete-button' onClick={() => handleDeleteComment(comment.expenseId, comment.id)}>Delete</button>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {editCommentId === null && (
                                            <>
                                                <textarea
                                                    value={newComment[expense.id] || ''}
                                                    onChange={(e) => handleCommentChange(expense.id, e.target.value)}
                                                    placeholder="Add a comment..."
                                                />
                                                <button onClick={() => handleCommentSubmit(expense.id)}>Post Comment</button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <h2 id="no-expenses-message">No expenses to show.</h2>
                )}
            </div>
        </div>
    );
};

export default AllExpensesPage;
