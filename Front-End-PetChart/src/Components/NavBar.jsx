import { Link } from "react-router-dom";
import { useAuth } from "./AuthContent.jsx";
import navbarLogo from "../assets/Images/Navbar-logo.png"

export default function NavBar() {
  const { token, logout, userType } = useAuth();
  console.log("NavBar userType:", userType);

  const homePath = 
  userType === "veterinarian"
  ? "/dashboard/veterinarian"
  : userType === "pet-parent"
  ? "/dashboard/pet-parent"
  : "/";

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={homePath} className="logo-link">
          <img src={navbarLogo} alt="PetChart logo" className="logo-img" />
        </Link>

        <div className="nav-links">
          <Link className="nav-link" to={homePath}>Home</Link>
          {token ? (
            <>
              <Link className="nav-link" to="/account">Account</Link>
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