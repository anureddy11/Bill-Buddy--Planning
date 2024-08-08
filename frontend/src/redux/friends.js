// Action Types
const SET_FRIENDS = 'friends/SET_FRIENDS';

// Action Creator
export const setFriends = (friends) => ({
    type: SET_FRIENDS,
    payload: friends,
});

// Thunk action to fetch friends
export const fetchFriends = () => async (dispatch) => {
    try {
        const response = await fetch(`/api/friends/`); // Adjust the endpoint as needed
        const friendsData = await response.json();

        // Dispatch the action to set friends in the store
        dispatch(setFriends(friendsData));
    } catch (error) {
        console.error('Failed to fetch friends:', error);
    }
};


// Example initial state for the friends reducer
const initialState = {
    friends: [],
};


// Friends Reducer
const friendsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FRIENDS:
            return {
                ...state,
                ...action.payload,
            };
        // Handle other friend-related actions
        default:
            return state;
    }
};

export default friendsReducer;
