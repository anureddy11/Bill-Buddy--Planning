import  { csrfFetch }   from "./csrf"


const LOAD_EXPENSES = "expenses/LOAD_EXPENSES"

const load = (data, type, id) => ({
    data,
    type,
    id
})


const inititialState = {}

export const getExpenses = ()=> async dispatch => {
    const response = await csrfFetch('/api/expenses')
    const data = await response.json()
    dispatch(load(data, LOAD_EXPENSES))
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
    }
}


export default expensesReducer
