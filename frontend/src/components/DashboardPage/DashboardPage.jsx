import React from "react";
import './DashboardPage.css';
import { NavLink } from "react-router-dom";
import PaymentFormModal from "../PaymentFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

const DashboardPage = () => {
    return (
        <div className="main-content">
            <nav className="sidebar">
                <ul>
                    <ul>
                        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
                        <li><NavLink to="/recent-activity" className={({ isActive }) => isActive ? "active" : ""}>Recent Activity</NavLink></li>
                        <li><NavLink to="/all-expenses" className={({ isActive }) => isActive ? "active" : ""}>All expenses</NavLink></li>
                        <li><NavLink to="/friends" className={({ isActive }) => isActive ? "active" : ""}>Friends</NavLink></li>
                    </ul>
                </ul>
            </nav>
            <div className="dashboard">
                <h1>Dashboard</h1>
                <div className="button-group">
                    <button className="add-expense-button">Add an expense</button>
                    <OpenModalMenuItem
                        itemText={<button className="settle-up-button">Settle up</button>}
                        modalComponent={<PaymentFormModal />}
                    />
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;
