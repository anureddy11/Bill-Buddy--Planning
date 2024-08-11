


const LOAD_EXPENSES = "expenses/LOAD_EXPENSES"

const loadExpense = (data, type, id) => ({
    data,
    type,
    id
})


const initialState = {}

export const getExpenses = ()=> async dispatch => {
    const response = await fetch('/api/expenses/')
    const data = await response.json()
    dispatch(loadExpense(data, LOAD_EXPENSES))
    return data
}


const expensesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_EXPENSES: {
            const newExpenses = {'expenses': {}, 'shares': {}}
            action.data.expenses.forEach(expense => {
                newExpenses.expenses[expense.id] = expense
            })
            action.data.shares.forEach(share => {
                newExpenses.shares[share.id] = share
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
