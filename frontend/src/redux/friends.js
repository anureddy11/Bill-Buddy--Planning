const GET_FRIENDS = 'GET_FRIENDS';
const ADD_FRIEND = 'ADD_FRIEND';
const ACCEPT_FRIEND = 'ACCEPT_FRIEND';
const REJECT_FRIEND = 'REJECT_FRIEND';
const REMOVE_FRIEND = 'REMOVE_FRIEND';
const FRIEND_ERROR = 'FRIEND_ERROR';

const getFriends = (friends) => ({
    type: GET_FRIENDS,
    payload: friends,
});

const addFriend = (friend) => ({
    type: ADD_FRIEND,
    payload: friend,
});

const acceptFriend = (friend) => ({
    type: ACCEPT_FRIEND,
    payload: friend,
});

const rejectFriend = (friend) => ({
    type: REJECT_FRIEND,
    payload: friend,
});

const removeFriend = (friendId) => ({
    type: REMOVE_FRIEND,
    payload: friendId,
});

const friendError = (error) => ({
    type: FRIEND_ERROR,
    payload: error,
});

export const thunkGetFriends = () => async (dispatch) => {
    try {
        const response = await fetch('/api/friends/');
        const data = await response.json();
        if (response.ok) {
            dispatch(getFriends(data.friends));
        } else {
            dispatch(friendError(data.message));
        }
    } catch (error) {
        dispatch(friendError(error.toString()));
    }
};

export const thunkRequestFriend = (username) => async (dispatch) => {
    try {
        const response = await fetch(`/api/friends/${username}/request`, { method: 'POST' });
        const data = await response.json();

        if (response.ok) {
            dispatch(addFriend(data));
            return { success: true, data }; // Return success response
        } else {
            dispatch(friendError(data.message));
            return { success: false, message: data.message }; // Return error response
        }
    } catch (error) {
        dispatch(friendError(error.toString()));
        return { success: false, message: error.toString() }; // Return error response
    }
};

export const thunkAcceptFriend = (friendId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/friends/${friendId}/accept`, { method: 'PUT' });
        const data = await response.json();
        if (response.ok) {
            dispatch(acceptFriend(data));
        } else {
            dispatch(friendError(data.message));
        }
    } catch (error) {
        dispatch(friendError(error.toString()));
    }
};

export const thunkRejectFriend = (friendId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/friends/${friendId}/reject`, { method: 'PUT' });
        const data = await response.json();
        if (response.ok) {
            dispatch(rejectFriend(data));
        } else {
            dispatch(friendError(data.message));
        }
    } catch (error) {
        dispatch(friendError(error.toString()));
    }
};

export const thunkRemoveFriend = (friendId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/friends/${friendId}`, { method: 'DELETE' });
        const data = await response.json();
        if (response.ok) {
            dispatch(removeFriend(friendId));
        } else {
            dispatch(friendError(data.message));
        }
    } catch (error) {
        dispatch(friendError(error.toString()));
    }
};

const initialState = {
    byId: {},
    allIds: [],
    error: null,
};

const friendsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_FRIENDS:
            const normalizedFriends = action.payload.reduce((acc, friend) => {
                acc.byId[friend.id] = friend;
                acc.allIds.push(friend.id);
                return acc;
            }, { byId: {}, allIds: [] });
            return {
                ...state,
                byId: normalizedFriends.byId,
                allIds: normalizedFriends.allIds,
                error: null,
            };
        case ADD_FRIEND:
            return {
                ...state,
                byId: { ...state.byId, [action.payload.id]: action.payload },
                allIds: [...state.allIds, action.payload.id],
                error: null,
            };
        case ACCEPT_FRIEND:
        case REJECT_FRIEND:
            return {
                ...state,
                byId: { ...state.byId, [action.payload.friendId]: { ...state.byId[action.payload.friendId], status: action.payload.status } },
                error: null,
            };
        case REMOVE_FRIEND:
            const { [action.payload]: _, ...remainingById } = state.byId;
            return {
                ...state,
                byId: remainingById,
                allIds: state.allIds.filter(id => id !== action.payload),
                error: null,
            };
        case FRIEND_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default friendsReducer;
