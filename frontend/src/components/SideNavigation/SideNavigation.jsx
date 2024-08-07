import './SideNavigation.css'
import { NavLink } from 'react-router-dom'

function SideNavigation () {
    return (
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
    )
}

export default SideNavigation
