import './DashboardPage.css';
import { NavLink, useNavigate } from "react-router-dom";

const DashboardPage = () => {
    const navigate = useNavigate()
    return (
        <div className="main-content">

            <div className="dashboard">
                <h1>Dashboard</h1>
                <button className="add-expense-button" onClick={() => navigate('/create-expense')}>
                    Add an expense
                    <NavLink to="/create-expense"></NavLink>
                </button>
                <button className="settle-up-button">Settle up</button>
            </div>
        </div>
    )
}

export default DashboardPage;
