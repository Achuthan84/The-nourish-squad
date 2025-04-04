import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import "leaflet/dist/leaflet.css";

const RiskMap = () => {
    const [mapData, setMapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/get-risk-map")
            .then((response) => response.json())
            .then((data) => {
                console.log("Map API Response:", data);  // ✅ Debugging
                if (data.error) {
                    throw new Error(data.error);
                }
                setMapData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching map data:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);


    return (
        <div className="map-container">
            <h2>Food Insecurity Risk Map</h2>
            {loading ? (
                <p>Loading Map...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : mapData && mapData.data && mapData.layout ? (
                <Plot data={mapData.data} layout={mapData.layout} />
            ) : (
                <p>No map data available.</p>
            )}
        </div>
    );
};

export default RiskMap;
