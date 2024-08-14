import "./DeleteExpense.css"
import { useModal } from "../../context/Modal";
import { thunkDeleteExpense } from "../../redux/expenses";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const DeleteExpense = (expenseId) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { closeModal } = useModal();

    const handleDelete = async () => {
        await dispatch(thunkDeleteExpense(expenseId.expenseId))
        navigate('/all-expenses')
        closeModal()
    }

    console.log(expenseId.expenseId)
    return (
        <section className="delete-expense-container">
            <h1 className="delete-expense-heading">Are you sure you want to delete this expense?</h1>
            <div className="button-group">
                <button className="delete-button" onClick={handleDelete}>Delete</button>
                <button className="cancel-button" onClick={closeModal}>Cancel</button>
            </div>
        </section>
    );
};

export default DeleteExpense;
