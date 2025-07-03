import { useState, useEffect } from 'react'
import {Route, Routes, Navigate, useLocation} from 'react-router-dom'
import './App.css'
import NavBar from "./Components/NavBar";
import Home from "./Components/Home"
import Login from "./Components/Login";
import Register from "./Components/Register"
import MainPage from "./Components/Mainpage";


function App() {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);
  

  return (
    <>
      <div>
      {location.pathname !== '/' && <NavBar token={token} setToken={setToken}/>}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/Main" element={<MainPage />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </div>
    </>
  )
}

export default App
