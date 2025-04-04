import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RiskMap = ({ apiResponse }) => {
    if (!apiResponse || !apiResponse.latitude || !apiResponse.longitude) {
        return <p>Waiting for location data...</p>;
    }

    // ✅ Define marker colors based on risk level
    const getColor = (riskLevel) => {
        if (riskLevel === 0) return "green"; // Low Risk
        if (riskLevel === 1) return "orange"; // Medium Risk
        return "red"; // High Risk
    };

    return (
        <MapContainer center={[apiResponse.latitude, apiResponse.longitude]} zoom={7} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={[apiResponse.latitude, apiResponse.longitude]}>
                <Popup>
                    <strong>{apiResponse.district}</strong> <br />
                    Risk Level: <span style={{ color: getColor(apiResponse.predicted_risk) }}>
                        {apiResponse.predicted_risk === 0 ? "Low" : apiResponse.predicted_risk === 1 ? "Medium" : "High"}
                    </span>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default RiskMap;
