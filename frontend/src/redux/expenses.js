import  { csrfFetch }   from "./csrf"


const LOAD_EXPENSES = "expenses/LOAD_EXPENSES"

const loadExpense = (data, type, id) => ({
    data,
    type,
    id
})


const initialState = {}

export const getExpenses = ()=> async dispatch => {
    const response = await csrfFetch('/api/expenses')
    const data = await response.json()
    dispatch(loadExpense(data, LOAD_EXPENSES))
    return data
}


const expensesReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_EXPENSES: {
            const newExpenses = {}
            action.data.Expenses.forEach(expense => {
                newExpenses[expense.id] = expense
            })
            return {
                ...state,
                ...newExpenses
            }
        }
        default:
            return state;
    }
}


export default expensesReducer
