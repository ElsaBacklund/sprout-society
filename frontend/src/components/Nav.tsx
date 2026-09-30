import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearSession, getStoredUser, isLoggedIn } from "../services/auth";
import "./Nav.css";

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = getStoredUser();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <nav className="site-nav">
      <Link className="site-nav-brand" to="/content">
        🌱 Sprout Society
      </Link>

      <div className="site-nav-links">
        {loggedIn ? (
          <>
            <Link
              className={
                location.pathname.startsWith("/content") ? "active" : ""
              }
              to="/content"
            >
              Växter
            </Link>

            <Link
              className={
                location.pathname.startsWith("/my-plants") ? "active" : ""
              }
              to="/my-plants"
            >
              Min samling
            </Link>

            {user?.isAdmin && (
              <Link
                className={
                  location.pathname.startsWith("/admin") ? "active" : ""
                }
                to="/admin/content"
              >
                Admin
              </Link>
            )}

            <Link
              className={location.pathname === "/account" ? "active" : ""}
              to="/account"
            >
              Mitt konto
            </Link>

            <button className="site-nav-logout" onClick={handleLogout}>
              Logga ut
            </button>
          </>
        ) : (
          <>
            <Link
              className={location.pathname === "/login" ? "active" : ""}
              to="/login"
            >
              Logga in
            </Link>
            <Link
              className={location.pathname === "/register" ? "active" : ""}
              to="/register"
            >
              Registrera dig
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;