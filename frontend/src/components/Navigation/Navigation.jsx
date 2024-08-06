import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/" className="nav-link">Home</NavLink>
        </li>
        <li className="nav-item profile-button">
          <ProfileButton />
        </li>
      </ul>
    </nav>
  );

}

export default Navigation;
