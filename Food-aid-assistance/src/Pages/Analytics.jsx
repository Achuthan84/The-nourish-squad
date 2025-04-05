import React, { useState } from "react";
import "./Analytics.css";

const districtList = [
    "Chennai", "Madurai", "Coimbatore", "Trichy", "Salem",
    "Sivagangai", "Erode", "Thanjavur", "Dindigul", "Tirunelveli"
];

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
    const [history, setHistory] = useState([]);

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
            setHistory((prev) => [...prev, newEntry]);
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
                    <select
                        name="District"
                        value={formData["District"]}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select District --</option>
                        {districtList.map((district, idx) => (
                            <option key={idx} value={district}>
                                {district}
                            </option>
                        ))}
                    </select>
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
                    <ul className="history-list">
                        {history.map((item, index) => (
                            <li key={index}>
                                <span><strong>District:</strong> {item.district}</span>
                                <span><strong>Risk Level:</strong> {item.predicted_risk}</span>
                                <button onClick={() => handleDelete(index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Power BI Iframe */}
            <div className="powerbi-frame">
                <iframe
                    title="Food Assistance Programs PSNA"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/reportEmbed?reportId=009e6a1b-0c00-4728-8deb-6e1b0af6c6bb&autoAuth=true&ctid=3cb3c705-b71b-48b1-a3b7-13d46af55ff7"
                    frameBorder="0"
                    allowFullScreen={true}
                ></iframe>
            </div>
        </div>
    );
};

export default Analytics;
