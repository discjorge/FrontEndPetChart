import { Link } from "react-router-dom";
import { useAuth } from "./AuthContent.jsx";
import logo from "../assets/Images/logo.png"

export default function NavBar() {
  const { token, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="PetChart logo" className="logo-img" />
        </Link>

        <div className="nav-links">
          <Link className="nav-link" to="/">Home</Link>
          {token ? (
            <>
              <Link className="nav-link" to="/account">Account</Link>
              <Link className="nav-link" to="/main">Main Page</Link>
              <button className="nav-link logout-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}