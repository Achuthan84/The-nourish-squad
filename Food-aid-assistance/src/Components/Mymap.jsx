import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MyMap = ({ userLocation }) => {
    return (
        <MapContainer center={[10.0, 78.0]} zoom={6} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {userLocation && (
                <Marker position={[userLocation.latitude, userLocation.longitude]}>
                    <Popup>Predicted Risk Level: {userLocation.predicted_risk}</Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default MyMap;