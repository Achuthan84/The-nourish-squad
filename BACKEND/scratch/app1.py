from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect("risk_data.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            age INTEGER,
            family_size INTEGER,
            monthly_income INTEGER,
            health_status TEXT,
            past_aid TEXT,
            meals_per_day INTEGER,
            job_lost TEXT,
            children_under_5 INTEGER,
            elderly_above_60 INTEGER,
            own_land TEXT,
            received_pds TEXT,
            occupation TEXT,
            predicted_risk TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

def predict_risk(data):
    score = 0

    try:
        score += int(data.get("age", 0)) // 10
        score += int(data.get("family_size", 0))
        score += 0 if int(data.get("monthly_income", 0)) > 5000 else 5
        score += 2 if data.get("job_lost") == "yes" else 0
        score += 2 if data.get("own_land") == "no" else 0
    except:
        pass

    if score > 15:
        return "High"
    elif score > 8:
        return "Medium"
    else:
        return "Low"

@app.route("/predict-risk", methods=["POST"])
def predict():
    data = request.json
    predicted_risk = predict_risk(data)

    try:
        conn = sqlite3.connect("risk_data.db")
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO predictions (
                age, family_size, monthly_income, health_status, past_aid,
                meals_per_day, job_lost, children_under_5, elderly_above_60,
                own_land, received_pds, occupation, predicted_risk
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get("age"),
            data.get("family_size"),
            data.get("monthly_income"),
            data.get("health_status"),
            data.get("past_aid"),
            data.get("meals_per_day"),
            data.get("job_lost"),
            data.get("children_under_5"),
            data.get("elderly_above_60"),
            data.get("own_land"),
            data.get("received_pds"),
            data.get("occupation"),
            predicted_risk
        ))
        conn.commit()
        conn.close()

    except Exception as e:
        return jsonify({"error": str(e)})

    return jsonify({"predicted_risk": predicted_risk})

if __name__ == "__main__":
    app.run(debug=True)
