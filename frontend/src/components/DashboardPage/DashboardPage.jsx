import React from "react";
import './DashboardPage.css';
import { NavLink } from "react-router-dom";
import PaymentFormModal from "../PaymentFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

const DashboardPage = () => {
    return (
        <div className="main-content">

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
