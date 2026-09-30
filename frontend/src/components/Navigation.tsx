import { NavLink } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navigation">
      <div className="navigation-inner">
        <NavLink to="/" className="navigation-brand">
          🌱 Sprout Society
        </NavLink>

        <div className="navigation-links">
          <NavLink
            to="/content"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            Växter
          </NavLink>
          <NavLink
            to="/my-plants"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            Min samling
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;