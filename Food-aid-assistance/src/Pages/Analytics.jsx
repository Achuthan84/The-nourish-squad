import React, { useState } from "react";
import "./Analytics.css";
import RiskMap from "./Riskmap";

const Analytics = () => {
    const [formData, setFormData] = useState({
        "Crop_Production (Tonnes)": "",
        "Food_Price_Index": "",
        "Malnutrition_Rate (%)": "",
        "Income_Per_Capita (INR)": "",
        "Employment_in_Agri (%)": "",
        "Undernourishment (%)": "",
        "Dietary_Diversity_Score": "",
    });

    const [submittedData, setSubmittedData] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmittedData(formData);

        try {
            const response = await fetch("http://127.0.0.1:5000/predict-risk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setApiResponse(data);
        } catch (error) {
            console.error("Error fetching API:", error);
        }
    };

    return (
        <div className="container">
            <h2>Risk Prediction System</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key, index) => (
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

            {submittedData && (
                <div className="submitted-section">
                    <h2>Submitted Data</h2>
                    <ul>
                        {Object.entries(submittedData).map(([key, value], index) => (
                            <li key={index}>
                                <strong>{key}:</strong> {value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {apiResponse && (
                <div className="response-section">
                    <h2>API Response</h2>
                    <p>Predicted Risk Level: <strong>{apiResponse.predicted_risk}</strong></p>
                </div>
            )}
            <RiskMap />

        </div>
    );
};

export default Analytics;
