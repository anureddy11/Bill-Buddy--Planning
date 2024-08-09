import { csrfFetch } from "./csrf";

// Action types
const GET_COMMENTS = 'comments/getComments'

const CLEAR_COMMENTS = "comments/clearComments"

const CREATE_COMMENT = 'comments/createComment'

const UPDATE_COMMENT = 'comments/updateComment'

const DELETE_COMMENT = 'comments/deleteComment'

// Action Creators

export const getComments = (comments) => {
    return {
        type: GET_COMMENTS,
        payload: comments
    }
}

export const clearComments = () => {
    return {
        type: CLEAR_COMMENTS
    }
}

export const createComment = (newComment) => {
    return {
        type: CREATE_COMMENT,
        payload: newComment
    }
}

export const updateComment = (updatedComment) => {
    return {
        type: UPDATE_COMMENT,
        payload: updatedComment
    }
}

export const deleteComment = (commentId) => {
    return {
        type: DELETE_COMMENT,
        payload: commentId
    }
}

// Thunk Action Creator
export const thunkGetComments = (expenseId) => async (dispatch) => {
    // Clear the previous comments state first
    dispatch(clearComments());

    // Fetch new comments for the specified expenseId
    const response = await csrfFetch(`/api/expenses/${expenseId}/comments`)

    if (response.ok) {
        const data = await response.json();
        dispatch(getComments(data.comments));
    };
}
