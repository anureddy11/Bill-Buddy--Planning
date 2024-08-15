// Action Types
const ADD_PAYMENT_SUCCESS = 'payments/ADD_PAYMENT_SUCCESS';
const ADD_PAYMENT_FAILURE = 'payments/ADD_PAYMENT_FAILURE';
const UPDATE_PAYMENT_SUCCESS = 'payments/UPDATE_PAYMENT_SUCCESS';
const UPDATE_PAYMENT_FAILURE = 'payments/UPDATE_PAYMENT_FAILURE';
const DELETE_PAYMENT_SUCCESS = 'payments/DELETE_PAYMENT_SUCCESS';
const DELETE_PAYMENT_FAILURE = 'payments/DELETE_PAYMENT_FAILURE';
const FETCH_PAYMENTS_SUCCESS = 'payments/FETCH_PAYMENTS_SUCCESS';
const FETCH_PAYMENTS_FAILURE = 'payments/FETCH_PAYMENTS_FAILURE';
const FETCH_PAYMENTS_MADE_SUCCESS = 'payments/FETCH_PAYMENTS_MADE_SUCCESS';
const FETCH_PAYMENTS_RECEIVED_SUCCESS = 'payments/FETCH_PAYMENTS_RECEIVED_SUCCESS';

// Action Creators

const fetchPaymentsSuccess = (payments) => ({
    type: FETCH_PAYMENTS_SUCCESS,
    payload: payments,
});

const fetchPaymentsFailure = (error) => ({
    type: FETCH_PAYMENTS_FAILURE,
    payload: error,
});

const fetchPaymentsMadeSuccess = (payments) => ({
    type: FETCH_PAYMENTS_MADE_SUCCESS,
    payload: payments,
});

const fetchPaymentsReceivedSuccess = (payments) => ({
    type: FETCH_PAYMENTS_RECEIVED_SUCCESS,
    payload: payments,
});

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
    payload: payment.payment,
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

// Thunk Action to Fetch All Payments
export const fetchPayments = () => async (dispatch) => {
    try {
        const response = await fetch('/api/payments/all');
        if (!response.ok) {
            throw new Error('Failed to fetch payments');
        }

        const payments = await response.json();
        dispatch(fetchPaymentsSuccess(payments));
    } catch (error) {
        dispatch(fetchPaymentsFailure(error.toString()));
    }
};

// Thunk Action to Fetch Payments Made by the Current User
export const fetchPaymentsMade = () => async (dispatch) => {
    try {
        const response = await fetch('/api/payments/made');
        if (!response.ok) {
            throw new Error('Failed to fetch payments made');
        }

        const payments = await response.json();
        dispatch(fetchPaymentsMadeSuccess(payments));
    } catch (error) {
        dispatch(fetchPaymentsFailure(error.toString()));
    }
};

// Thunk Action to Fetch Payments Received by the Current User
export const fetchPaymentsReceived = () => async (dispatch) => {
    try {
        const response = await fetch('/api/payments/received');
        if (!response.ok) {
            throw new Error('Failed to fetch payments received');
        }

        const payments = await response.json();
        dispatch(fetchPaymentsReceivedSuccess(payments));
    } catch (error) {
        dispatch(fetchPaymentsFailure(error.toString()));
    }
};

// Thunk Action to Add Payment
export const addPayment = (payee_id, status, amount) => async (dispatch) => {
    try {
        const response = await fetch('/api/payments/create', {
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
export const updatePayment = (id, payee_id, amount, status) => async (dispatch) => {
    try {
        const response = await fetch(`/api/payments/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payee_id, amount, status }),
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
    payments: [],
    paymentsMade: [],
    paymentsReceived: [],
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
        case FETCH_PAYMENTS_SUCCESS:
            return {
                ...state,
                payments: action.payload,
                message: 'Payments fetched successfully',
                error: null,
            };
        case FETCH_PAYMENTS_MADE_SUCCESS:
            return {
                ...state,
                paymentsMade: action.payload,
                message: 'Payments made fetched successfully',
                error: null,
            };
        case FETCH_PAYMENTS_RECEIVED_SUCCESS:
            return {
                ...state,
                paymentsReceived: action.payload,
                message: 'Payments received fetched successfully',
                error: null,
            };
        case FETCH_PAYMENTS_FAILURE:
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
