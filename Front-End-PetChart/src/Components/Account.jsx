import React from "react";
import { useEffect } from "react";
import { useAuth } from "./AuthContent.jsx";
import { useNavigate } from "react-router-dom"
import defaultImg from "../assets/images/default.png";


export default function Account() {
    const { user, token, } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
        document.body.classList.add("homepage");
        return () => {
            document.body.classList.remove("homepage");
        };
    }, [token, navigate]);

    if (!user) return <p>Not logged in.</p>

    return (
  <div className="account-page">
    <div className="account-box">
      <h2>Account Info</h2>
      <img
        src={user.profile_image_url || user.pet_image?.url || defaultImg}
        alt="Profile"
        className="profile-img"
      />
      <ul>
        {user.userType === "veterinarian" ? (
          <>
            <li><strong>Name:</strong> {user.first_name} {user.last_name}</li>
            <li><strong>Email:</strong> {user.email}</li>
          </>
        ) : (
          <>
            <li><strong>Pet Name:</strong> {user.pet_name}</li>
            <li><strong>Owner Name:</strong> {user.owner_name}</li>
            <li><strong>Animal:</strong> {user.animal}</li>
            <li><strong>Breed:</strong> {user.breed}</li>
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>Address:</strong> {user.address}</li>
          </>
        )}
      </ul>
    </div>
  </div>
);
}