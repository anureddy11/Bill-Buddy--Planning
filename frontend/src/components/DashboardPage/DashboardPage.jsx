import './DashboardPage.css';
import PaymentFormModal from "../PaymentFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { useNavigate } from 'react-router-dom';


const DashboardPage = () => {
    const navigate = useNavigate()
    return (
        <div className="main-content">

            <div className="dashboard">
                <h1>Dashboard</h1>
                <button className="add-expense-button" onClick={() => navigate("/create-expense")}>Add an expense</button>
                <OpenModalMenuItem
                        itemText={<button className="settle-up-button">Settle up</button>}
                        modalComponent={<PaymentFormModal />}
                    />
            </div>
        </div>
    )
}

export default DashboardPage;
