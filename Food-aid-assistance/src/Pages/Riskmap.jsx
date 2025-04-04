import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Dummy coordinates for TN districts
const districtCoordinates = {
    Chennai: [13.0827, 80.2707],
    Madurai: [9.9252, 78.1198],
    Coimbatore: [11.0168, 76.9558],
    Trichy: [10.7905, 78.7047],
    Salem: [11.6643, 78.1460],
    Sivagangai: [9.8472, 78.4806],
    Erode: [11.3410, 77.7172],
    Thanjavur: [10.7867, 79.1378],
    Dindigul: [10.3673, 77.9803],
    Tirunelveli: [8.7139, 77.7567],
};

const ChangeMapView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 10); // Zoom level 10
        }
    }, [center, map]);
    return null;
};

const RiskMap = ({ selectedDistrict }) => {
    const center = districtCoordinates[selectedDistrict] || [10.7905, 78.7047]; // Default: Trichy

    return (
        <div style={{ height: "400px", marginTop: "30px", borderRadius: "10px", overflow: "hidden" }}>
            <MapContainer center={center} zoom={7} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeMapView center={center} />
                {selectedDistrict && (
                    <Marker position={center}>
                        <Popup>{selectedDistrict}</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default RiskMap;
    