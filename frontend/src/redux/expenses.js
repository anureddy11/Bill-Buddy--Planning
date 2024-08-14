const GET_EXPENSES = 'expenses/GET_EXPENSES';
const ADD_EXPENSE = 'expenses/ADD_EXPENSE';
const UPDATE_EXPENSE = 'expenses/UPDATE_EXPENSE';
const DELETE_EXPENSE = 'expenses/DELETE_EXPENSE';
const EXPENSE_ERROR = 'expenses/EXPENSE_ERROR';
const CLEAR_EXPENSE = 'expenses/CLEAR_EXPENSE'

const getExpenses = (expenses) => ({
    type: GET_EXPENSES,
    payload: expenses,
});

const addExpense = (expense) => ({
    type: ADD_EXPENSE,
    payload: expense,
});

const updateExpense = (expense) => ({
    type: UPDATE_EXPENSE,
    payload: expense,
});

const deleteExpense = (expenseId) => ({
    type: DELETE_EXPENSE,
    payload: expenseId,
});

const expenseError = (error) => ({
    type: EXPENSE_ERROR,
    payload: error,
});

const clearExpense = () => {
    return {
        type: CLEAR_EXPENSE
    }
}

// Thunks
export const thunkGetExpenses = () => async (dispatch) => {
    try {
        // Clear the expense redux state 
        dispatch(clearExpense());

        const response = await fetch('/api/expenses/all');
        const data = await response.json();
        if (response.ok) {
            dispatch(getExpenses(data.expenses));
        } else {
            dispatch(expenseError(data.message));
        }
    } catch (error) {
        dispatch(expenseError(error.toString()));
    }
};


export const thunkCreateExpense = (expenseData) => async (dispatch) => {
    try {
        const response = await fetch('/api/expenses/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(addExpense(data.expense));
        } else {
            dispatch(expenseError(data.message));
        }
    } catch (error) {
        dispatch(expenseError(error.toString()));
    }
};

export const thunkUpdateExpense = (expenseId, expenseData) => async (dispatch) => {
    try {
        const response = await fetch(`/api/expenses/${expenseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(updateExpense(data.expense));
        } else {
            dispatch(expenseError(data.message));
        }
    } catch (error) {
        dispatch(expenseError(error.toString()));
    }
};

export const thunkDeleteExpense = (expenseId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/expenses/${expenseId}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(deleteExpense(expenseId));
        } else {
            dispatch(expenseError(data.message));
        }
    } catch (error) {
        dispatch(expenseError(error.toString()));
    }
};

const initialState = {
    byId: {},
    allIds: [],
    error: null,
};

const expensesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EXPENSES:
            const normalizedData = action.payload.reduce((acc, expense) => {
                acc.byId[expense.id] = expense;
                acc.allIds.push(expense.id);
                return acc;
            }, { byId: {}, allIds: [] });

            return {
                ...state,
                byId: { ...state.byId, ...normalizedData.byId },
                allIds: [...new Set([...state.allIds, ...normalizedData.allIds])],
                error: null,
            };

        case ADD_EXPENSE:
        case UPDATE_EXPENSE:
            return {
                ...state,
                byId: { ...state.byId, [action.payload.id]: action.payload },
                allIds: state.allIds.includes(action.payload.id)
                    ? state.allIds
                    : [...state.allIds, action.payload.id],
                error: null,
            };

        case DELETE_EXPENSE:
            const { [action.payload]: _, ...remainingById } = state.byId;
            return {
                ...state,
                byId: remainingById,
                allIds: state.allIds.filter(id => id !== action.payload),
                error: null,
            };

        case EXPENSE_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        case CLEAR_EXPENSE:
            const initialState = {
                byId: {},
                allIds: [],
                error: null,
            }
            return initialState;

        default:
            return state;
    }
};

export default expensesReducer;
