import React, { useState } from "react";
import "./Analytics.css";
import RiskMap from "./Riskmap";

const Analytics = () => {
    const [formData, setFormData] = useState({
        "District": "",
        "Crop_Production (Tonnes)": "",
        "Food_Price_Index": "",
        "Malnutrition_Rate (%)": "",
        "Income_Per_Capita (INR)": "",
        "Employment_in_Agri (%)": "",
        "Undernourishment (%)": "",
        "Dietary_Diversity_Score": "",
    });

    const [apiResponse, setApiResponse] = useState(null);
    const [history, setHistory] = useState([]); // ✅ to track previous entries

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:5000/predict-risk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            const newEntry = {
                district: formData["District"],
                ...data,
            };

            setApiResponse(newEntry);
            setHistory((prev) => [...prev, newEntry]); // ✅ Add to history
        } catch (error) {
            console.error("Error fetching API:", error);
        }
    };

    const handleDelete = (indexToDelete) => {
        setHistory(history.filter((_, index) => index !== indexToDelete));
    };

    return (
        <div className="container">
            <h2>Risk Prediction System</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>District Name:</label>
                    <input
                        type="text"
                        name="District"
                        value={formData["District"]}
                        onChange={handleChange}
                        required
                    />
                </div>

                {Object.keys(formData).slice(1).map((key, index) => (
                    <div className="form-group" key={index}>
                        <label>{key}:</label>
                        <input
                            type="number"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}

                <button type="submit">Submit</button>
            </form>

            {apiResponse && (
                <div className="response-section">
                    <h3>Latest Prediction</h3>
                    <p>District: <strong>{apiResponse.district}</strong></p>
                    <p>Predicted Risk Level: <strong>{apiResponse.predicted_risk}</strong></p>
                </div>
            )}

            {history.length > 0 && (
                <div className="history-section">
                    <h3>Submission History</h3>
                    <ul>
                        {history.map((item, index) => (
                            <li key={index}>
                                {item.district} - Risk Level: {item.predicted_risk}
                                <button onClick={() => handleDelete(index)} style={{ marginLeft: "10px" }}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ✅ Map gets the latest prediction */}
            <RiskMap apiResponse={apiResponse} />
        </div>
    );
};

export default Analytics;
