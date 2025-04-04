import React, { useState } from "react";
import "./RiskForm.css";

const RiskForm = () => {
    const [formData, setFormData] = useState({
        CropProduction: "",
        DietaryDiversity: "",
        EmploymentAgriculture: "",
        FoodPriceIndex: "",
        IncomePerCapita: "",
        MalnutritionRate: "",
        Undernourishment: "",
    });

    const [submittedData, setSubmittedData] = useState(null); // Store submitted data

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ Save form data into submittedData state
        setSubmittedData(formData);

        // ✅ Reset form after submit
        setFormData({
            CropProduction: "",
            DietaryDiversity: "",
            EmploymentAgriculture: "",
            FoodPriceIndex: "",
            IncomePerCapita: "",
            MalnutritionRate: "",
            Undernourishment: "",
        });
    };

    return (
        <div className="container">
            <h2>Risk Prediction System</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key, index) => (
                    <div className="form-group" key={index}>
                        <label>{key.replace(/([A-Z])/g, " $1").trim()}:</label>
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

            {/* ✅ Display submitted data instantly */}
            {submittedData && (
                <div className="submitted-section">
                    <h2>Submitted Data</h2>
                    <ul>
                        {Object.entries(submittedData).map(([key, value], index) => (
                            <li key={index}>
                                <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong> {value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RiskForm;
