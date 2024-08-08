// Action Types
const ADD_PAYMENT_SUCCESS = 'payments/ADD_PAYMENT_SUCCESS';
const ADD_PAYMENT_FAILURE = 'payments/ADD_PAYMENT_FAILURE';
const UPDATE_PAYMENT_SUCCESS = 'payments/UPDATE_PAYMENT_SUCCESS';
const UPDATE_PAYMENT_FAILURE = 'payments/UPDATE_PAYMENT_FAILURE';
const DELETE_PAYMENT_SUCCESS = 'payments/DELETE_PAYMENT_SUCCESS';
const DELETE_PAYMENT_FAILURE = 'payments/DELETE_PAYMENT_FAILURE';


// Action Creators
const addPaymentSuccess = (payment) => ({
    type: ADD_PAYMENT_SUCCESS,
    payload: payment,
});

const addPaymentFailure = (error) => ({
    type: ADD_PAYMENT_FAILURE,
    payload: error,
});

const updatePaymentSuccess = (payment) => ({
    type: UPDATE_PAYMENT_SUCCESS,
    payload: payment,
});

const updatePaymentFailure = (error) => ({
    type: UPDATE_PAYMENT_FAILURE,
    payload: error,
});

const deletePaymentSuccess = (id) => ({
    type: DELETE_PAYMENT_SUCCESS,
    payload: id,
});

const deletePaymentFailure = (error) => ({
    type: DELETE_PAYMENT_FAILURE,
    payload: error,
});

// Thunk Action to Add Payment
export const addPayment = (payee_id, status, amount) => async (dispatch) => {
    try {
        const response = await fetch('/api/payments/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payee_id, status, amount }),
        });

        if (!response.ok) {
            throw new Error('Failed to add payment');
        }

        const payment = await response.json();
        dispatch(addPaymentSuccess(payment));
    } catch (error) {
        dispatch(addPaymentFailure(error.toString()));
    }
};

// Thunk Action to Update Payment
export const updatePayment = (id, payeeId, status, amount) => async (dispatch) => {
    try {
        const response = await fetch(`/api/payments/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payeeId, status, amount }),
        });

        if (!response.ok) {
            throw new Error('Failed to update payment');
        }

        const payment = await response.json();
        dispatch(updatePaymentSuccess(payment));
    } catch (error) {
        dispatch(updatePaymentFailure(error.toString()));
    }
};

// Thunk Action to Delete Payment
export const deletePayment = (id) => async (dispatch) => {
    try {
        const response = await fetch(`/api/payments/delete/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete payment');
        }

        dispatch(deletePaymentSuccess(id));
    } catch (error) {
        dispatch(deletePaymentFailure(error.toString()));
    }
};



const initialState = {
    payments: [],  // Assuming you are tracking payments in the state
    message: '',
    error: null,
};

// Payments Reducer
const paymentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PAYMENT_SUCCESS:
            return {
                ...state,
                payments: [...state.payments, action.payload],
                message: 'Payment added successfully',
                error: null,
            };
        case ADD_PAYMENT_FAILURE:
            return {
                ...state,
                message: '',
                error: action.payload,
            };
        case UPDATE_PAYMENT_SUCCESS:
            return {
                ...state,
                payments: state.payments.map(payment =>
                    payment.id === action.payload.id ? action.payload : payment
                ),
                message: 'Payment updated successfully',
                error: null,
            };
        case UPDATE_PAYMENT_FAILURE:
            return {
                ...state,
                message: '',
                error: action.payload,
            };
        case DELETE_PAYMENT_SUCCESS:
            return {
                ...state,
                payments: state.payments.filter(payment => payment.id !== action.payload),
                message: 'Payment deleted successfully',
                error: null,
            };
        case DELETE_PAYMENT_FAILURE:
            return {
                ...state,
                message: '',
                error: action.payload,
            };
        default:
            return state;
    }
};

export default paymentsReducer;
