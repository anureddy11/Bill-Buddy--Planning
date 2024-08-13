import './DashboardPage.css';
import PaymentFormModal from "../PaymentFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";


const DashboardPage = () => {
    return (
        <div className="main-content">

            <div className="dashboard">
                <h1>Dashboard</h1>
                <button className="add-expense-button">Add an expense</button>
                <OpenModalMenuItem
                        itemText={<button className="settle-up-button">Settle up</button>}
                        modalComponent={<PaymentFormModal />}
                    />
            </div>
        </div>
    )
}

export default DashboardPage;
