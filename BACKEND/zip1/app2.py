# Flask Backend - app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import joblib
import plotly.express as px
import json

app = Flask(__name__)
CORS(app)

# Load trained model and dataset
model = joblib.load("random_forest_model.pkl")
DATA_FILE = "modified_csv_file.csv"
df = pd.read_csv(DATA_FILE)

# Ensure required columns exist in dataset
required_columns = ["District", "Latitude", "Longitude"]
for col in required_columns:
    if col not in df.columns:
        raise ValueError(f"Missing required column: {col}")

# Define features
features = [
    "Crop_Production (Tonnes)", "Food_Price_Index", "Malnutrition_Rate (%)",
    "Income_Per_Capita (INR)", "Employment_in_Agri (%)", "Undernourishment (%)",
    "Dietary_Diversity_Score"
]

# Predict risk levels and add to DataFrame
df["Predicted_Risk"] = model.predict(df[features])

# ✅ Set Mapbox token
px.set_mapbox_access_token("YOUR_MAPBOX_ACCESS_TOKEN")

@app.route('/')
def home():
    return "✅ Risk Prediction API is running!"

@app.route('/get-predicted-data', methods=['GET'])
def get_predicted_data():
    try:
        result = df[["District", "Predicted_Risk", "Latitude", "Longitude"]].to_dict(orient="records")
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/get-risk-map', methods=['GET'])
def get_risk_map():
    try:
        print("Generating risk map...")  # ✅ Debugging Step 1
        fig = px.scatter_mapbox(
            df,
            lat="Latitude",
            lon="Longitude",
            text="District",
            color="Predicted_Risk",
            size="Predicted_Risk",
            size_max=15,
            zoom=6,
            mapbox_style="carto-positron"
        )
        graph_json = json.loads(fig.to_json())
        print("Map Data Sent:", graph_json)  # ✅ Debugging Step 2
        return jsonify(graph_json)
    except Exception as e:
        print("Error:", e)  # ✅ Debugging Step 3
        return jsonify({"error": str(e)})

@app.route('/predict-risk', methods=['POST'])
def predict_risk():
    try:
        data = request.get_json()
        district = data.get("District", "").strip()

        # ✅ Find Latitude & Longitude for the given district
        district_data = df[df["District"].str.lower() == district.lower()]
        if district_data.empty:
            return jsonify({"error": "District not found!"})

        latitude = district_data["Latitude"].values[0]
        longitude = district_data["Longitude"].values[0]

        # ✅ Predict risk level
        input_data = [float(data[feature]) for feature in features]
        predicted_risk = model.predict([input_data])[0]

        return jsonify({
            "district": district,
            "predicted_risk": int(predicted_risk),
            "latitude": latitude,
            "longitude": longitude
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
