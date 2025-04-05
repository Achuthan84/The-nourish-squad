from flask import Flask, request, jsonify
import pandas as pd
import sqlite3
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load models and encoders
with open("food_insecurity_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("health_encoder.pkl", "rb") as f:
    health_encoder = pickle.load(f)

with open("past_aid_encoder.pkl", "rb") as f:
    past_aid_encoder = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Indian States with coordinates
indian_states = {
    "Chennai": (13.0827, 80.2707),
    "Coimbatore": (11.0168, 76.9558),
    "Madurai": (9.9252, 78.1198),
    "Tiruchirappalli": (10.7905, 78.7047),
    "Salem": (11.6643, 78.1460),
    "Tirunelveli": (8.7139, 77.7567),
    "Vellore": (12.9165, 79.1325),
    "Erode": (11.3410, 77.7172),
    "Thoothukudi": (8.7642, 78.1348),
    "Dindigul": (10.3624, 77.9695),
    "Thanjavur": (10.7867, 79.1378),
    "Ranipet": (12.9236, 79.3333),
    "Sivaganga": (9.8470, 78.4804),
    "Virudhunagar": (9.5851, 77.9570),
    "Nagapattinam": (10.7662, 79.8420),
    "Cuddalore": (11.7447, 79.7680),
    "Tiruvannamalai": (12.2253, 79.0747),
    "Namakkal": (11.2189, 78.1675),
    "Pudukkottai": (10.3833, 78.8000),
    "Krishnagiri": (12.5192, 78.2120),
    "Ariyalur": (11.1360, 79.0758),
    "Perambalur": (11.2333, 78.8833),
    "Tenkasi": (8.9591, 77.3152),
    "Tirupattur": (12.4963, 78.5600),
    "Nilgiris": (11.4102, 76.6950),
}


# Database functions
def create_db():
    with sqlite3.connect("risk_data.db") as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS risk_records (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            age INTEGER, family_size INTEGER, 
                            monthly_income REAL, health_status INTEGER,
                            past_aid INTEGER, risk_prediction REAL,
                            place TEXT, latitude REAL, longitude REAL)''')
        conn.commit()


create_db()


def insert_record(features, risk, place, lat, lon):
    with sqlite3.connect("risk_data.db") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO risk_records 
            (age, family_size, monthly_income, health_status, past_aid, risk_prediction, place, latitude, longitude) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (*features, float(risk), place, lat, lon))
        conn.commit()


def get_all_records():
    with sqlite3.connect("risk_data.db") as conn:
        df = pd.read_sql("SELECT * FROM risk_records", conn)
    df["risk_prediction"] = pd.to_numeric(df["risk_prediction"], errors="coerce")
    return df


def delete_all_records():
    with sqlite3.connect("risk_data.db") as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM risk_records")
        conn.commit()


# API Routes

@app.route("/predict", methods=["POST"])
def predict_risk():
    try:
        data = request.json

        # Validate input fields
        required_fields = ["age", "family_size", "monthly_income", "health_status", "past_aid", "place"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        age = int(data["age"])
        family_size = int(data["family_size"])
        monthly_income = float(data["monthly_income"])
        health_status = int(data["health_status"])
        past_aid = int(data["past_aid"])
        place = data["place"]

        if place not in indian_states:
            return jsonify({"error": "Invalid place name"}), 400

        latitude, longitude = indian_states[place]

        features = np.array([age, family_size, monthly_income, health_status, past_aid]).reshape(1, -1)
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]

        insert_record([age, family_size, monthly_income, health_status, past_aid], prediction, place, latitude, longitude)

        return jsonify({
            "prediction": round(prediction, 2),
            "message": "Prediction successful and stored."
        })

    except ValueError:
        return jsonify({"error": "Invalid data format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/records", methods=["GET"])
def get_records():
    df = get_all_records()
    return df.to_json(orient="records")


@app.route("/delete_all", methods=["DELETE"])
def clear_db():
    delete_all_records()
    return jsonify({"message": "All records deleted."})


@app.route("/summary", methods=["GET"])
def risk_summary():
    df = get_all_records()
    if df.empty:
        return jsonify({"message": "No data available."})

    summary = df.groupby("place").agg(
        count=("risk_prediction", "count"),
        avg_risk=("risk_prediction", "mean")
    ).reset_index()

    return summary.to_json(orient="records")


@app.route("/states", methods=["GET"])
def get_states():
    return jsonify(list(indian_states.keys()))


# Run server
if __name__ == "_main_":
    app.run(debug=True)