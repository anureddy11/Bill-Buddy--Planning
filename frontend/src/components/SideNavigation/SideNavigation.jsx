import './SideNavigation.css'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { thunkGetFriends } from '../../redux/friends'
import { useEffect } from 'react'

function SideNavigation() {
    const dispatch = useDispatch()
    const friends = useSelector((state) => state.friend.friends)

    useEffect(() => {
        dispatch(thunkGetFriends())
    })

    return (
        <nav className="sidebar">
            <ul>
                <ul>
                    <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
                    <li><NavLink to="/recent-activity" className={({ isActive }) => isActive ? "active" : ""}>Recent Activity</NavLink></li>
                    <li><NavLink to="/all-expenses" className={({ isActive }) => isActive ? "active" : ""}>All expenses</NavLink></li>
                    <li>Friends:
                        <ul>Friend1</ul>
                        <ul>Friend2</ul>
                    </li>
                </ul>
            </ul>
        </nav>
    )
}

export default SideNavigation
