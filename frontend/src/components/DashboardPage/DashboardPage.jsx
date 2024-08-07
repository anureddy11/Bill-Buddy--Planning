import React from "react";
import './DashboardPage.css';
import { NavLink } from "react-router-dom";

const DashboardPage = () => {
    return (
        <div className="main-content">

            <div className="dashboard">
                <h1>Dashboard</h1>
                <button className="add-expense-button">Add an expense</button>
                <button className="settle-up-button">Settle up</button>
            </div>
        </div>
    )
}

export default DashboardPage;
