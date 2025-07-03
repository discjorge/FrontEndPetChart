import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import landingpage from "../assets/images/landingpage.png"

const Home = ()  => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("homepage");

        return () => {
            document.body.classList.remove("homepage");
        };
    }, []);
  
return (
    <div className="landing-page">
      <img
        src={landingpage} alt="PetChart Logo" />
      <h1>
        Your Pet’s Health, One Click Away
      </h1>
      <p>
        PetChart helps you manage your pet's medical history, vaccinations, and appointments with ease—just like MyChart, but for pets.
      </p>
      <div className="button-group">
  <button onClick={() => navigate("/register")}>
    Get Started
  </button>
  <button onClick={() => navigate("/login")}>
    Log In
  </button>
</div>
    </div>
  );
};

export default Home;
