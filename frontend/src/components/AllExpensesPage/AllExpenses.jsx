import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState} from "react"
import { useSelector, useDispatch } from 'react-redux';
import { getExpenses } from "../../redux/expenses";
import './AllExpenses.css';

const Expenses = () =>{
    const dispatch = useDispatch()
    const [activeId, setActiveId] = useState(null)

    useEffect(() => {
        dispatch(getExpenses())
    }, [])

    const expensesState = useSelector((state) => {
        return Object.values(state.expense)
    })

    const hiddenClass = () => {
        if (isHidden === true) {
            return 'expense-shares hidden'
        }
        return 'expense-shares'
    }

    if (expensesState[0]) {
        const expenses = Object.values(expensesState[0])
        const shares = Object.values(expensesState[1])
        return (
            <>
            <div className="expense-content">
            <div className="expenses-list">
                <h2>Created Expenses</h2>
            {expenses.map(expense => {
                return (
                    <div key={expense.id} className="expense-items" onClick={() => activeId !== expense.id ? setActiveId(expense.id): setActiveId(null)}>
                        <p> amount: ${expense.amount}</p>
                        <p> description: {expense.description}</p>
                        <p> settled: {expense.settled}</p>
                        <p> shares: </p>
                        {expense.expenseShares.map(share => {
                            return (
                                <div key={share.id} className={expense.id === activeId ? 'expense-shares' : 'expense-shares hidden'}>
                                    <p>user: {share.username}</p>
                                    <p>amount: {share.amount}</p>
                                    <p>settled: {share.settled}</p>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
            </div>
            <div className="shares-list">
                <h2>Expenses from others</h2>
            {shares.map(share => {
                return (
                    <div key={share.id} className="expense-items">
                        <p> amount: ${share.amount} </p>
                        <p> description: {share.description}</p>
                        <p> settled: {share.settled}</p>
                    </div>
                )
            })}
            </div>
            </div>
            </>
        )
    }

    return (
        <h1>loading</h1>
    )
}


export default Expenses
