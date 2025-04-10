import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./Navbar.css"
export const Navbar = () => {
    const navigation = useNavigate();
    return (
        <nav>
            <h1>AI Powered Food Assistance</h1>
            <ul>
                <Link to="/">Home</Link>
                <Link to="">About</Link>
                <Link to="/Login">Login</Link>
                <Link to="/Analytics">Analytics</Link>
                <Link to="/RiskForm">User form</Link>
            </ul>
        </nav>
    )
}
