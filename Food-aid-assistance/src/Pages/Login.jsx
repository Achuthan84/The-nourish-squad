import React, { useState } from "react";
import "./Login.css";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email.includes("@")) {
            setError("Invalid email address!");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long!");
            return;
        }

        setError("");
        alert("Login Successful!");
    };

    return (
        <div className="login-container">
            <h2 className="fade-in">Login</h2>
            <form onSubmit={handleSubmit} className="slide-in">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                {error && <p className="error">{error}</p>}

                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>
    );
};

export default Login;
