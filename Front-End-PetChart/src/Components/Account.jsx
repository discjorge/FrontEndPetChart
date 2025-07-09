import React from "react";
import { useEffect } from "react";
import { useAuth } from "./AuthContent.jsx";
import { useNavigate } from "react-router-dom"


export default function Account() {
    const { user, token, } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }
)


}