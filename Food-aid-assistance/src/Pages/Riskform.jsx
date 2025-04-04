import React, { useState } from 'react';
import './Riskform.css';

function Riskform() {
    const [formData, setFormData] = useState({
        age: '',
        family_size: '',
        monthly_income: '',
        health_status: '',
        past_aid: '',
        meals_per_day: '',
        job_lost: '',
        children_under_5: '',
        elderly_above_60: '',
        own_land: '',
        received_pds: '',
        occupation: ''
    });

    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://127.0.0.1:5000/predict-risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            setResult(data.predicted_risk);
        } catch (err) {
            console.error("API error:", err);
        }
    };

    return (
        <div className="form-container">
            <h2>Risk Prediction System</h2>

            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key, i) => (
                    <div className="form-group" key={i}>
                        <label>{key.replace(/_/g, ' ')}:</label>
                        <input
                            type="text"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}

                <button type="submit">Predict</button>
            </form>

            {result && (
                <div className="result-section">
                    <h3>Predicted Risk Level:</h3>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
}

export default Riskform;
