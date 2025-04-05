import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
import joblib
import pickle

# 📌 Load saved model and scaler
model = joblib.load("food risk model.pkl")
scaler = joblib.load("scaler.pkl")

# Optional: load label encoder if needed for decoding predictions
label_encoder = joblib.load("label_encoder.pkl")  # Only if used in prediction

# 📍 State coordinates
indian_states = {
    "Chennai": (13.0827, 80.2707), "Coimbatore": (11.0168, 76.9558), "Madurai": (9.9252, 78.1198),
    "Tiruchirappalli": (10.7905, 78.7047), "Salem": (11.6643, 78.1460), "Tirunelveli": (8.7139, 77.7567),
    "Vellore": (12.9165, 79.1325), "Erode": (11.3410, 77.7172), "Thoothukudi": (8.7642, 78.1348),
    "Dindigul": (10.3624, 77.9695), "Thanjavur": (10.7867, 79.1378), "Ranipet": (12.9236, 79.3333),
    "Sivaganga": (9.8470, 78.4804), "Virudhunagar": (9.5851, 77.9570), "Nagapattinam": (10.7662, 79.8420),
    "Cuddalore": (11.7447, 79.7680), "Tiruvannamalai": (12.2253, 79.0747), "Namakkal": (11.2189, 78.1675),
    "Pudukkottai": (10.3833, 78.8000), "Krishnagiri": (12.5192, 78.2120), "Ariyalur": (11.1360, 79.0758),
    "Perambalur": (11.2333, 78.8833), "Tenkasi": (8.9591, 77.3152), "Tirupattur": (12.4963, 78.5600),
    "Nilgiris": (11.4102, 76.6950),
}

# 📌 Database setup
def create_db():
    conn = sqlite3.connect("risk_data.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS risk_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        aadhaar TEXT,
        age INTEGER,
        family_size INTEGER,
        monthly_income REAL,
        health_status INTEGER,
        past_aid INTEGER,
        risk_prediction REAL,
        place TEXT,
        latitude REAL,
        longitude REAL)''')
    conn.commit()
    conn.close()

create_db()

def insert_record(name, aadhaar, features, risk, place, lat, lon):
    try:
        conn = sqlite3.connect("risk_data.db")
        cursor = conn.cursor()
        cursor.execute("""INSERT INTO risk_records 
            (name, aadhaar, age, family_size, monthly_income, health_status, past_aid, risk_prediction, place, latitude, longitude) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (name, aadhaar, *features, float(risk), place, lat, lon))
        conn.commit()
        conn.close()
        print("✅ Record inserted.")
    except sqlite3.Error as e:
        print("❌ DB Error:", e)

def get_data():
    conn = sqlite3.connect("risk_data.db")
    df = pd.read_sql("SELECT * FROM risk_records", conn)
    conn.close()
    df["risk_prediction"] = pd.to_numeric(df["risk_prediction"], errors="coerce")
    return df

def delete_all_records():
    conn = sqlite3.connect("risk_data.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM risk_records")
    conn.commit()
    conn.close()

# 🌟 Streamlit UI
st.title("📊 Food Insecurity Risk Prediction System")

st.sidebar.header("📝 Enter Information")

name = st.sidebar.text_input("Full Name")
aadhaar = st.sidebar.text_input("Aadhaar Number")

features = []
features.append(st.sidebar.number_input("Age", min_value=1, max_value=100, value=25))
features.append(st.sidebar.number_input("Family Size", min_value=1, max_value=20, value=4))
features.append(st.sidebar.number_input("Monthly Income (INR)", min_value=1000, max_value=1000000, value=20000))
features.append(st.sidebar.slider("Health Status (1=Poor, 5=Excellent)", 1, 5, 3))
features.append(st.sidebar.selectbox("Received Past Aid? (0=No, 1=Yes)", [0, 1]))

selected_state = st.sidebar.selectbox("📍 Select State", list(indian_states.keys()))
latitude, longitude = indian_states[selected_state]
st.sidebar.write(f"🗺️ Location: {selected_state} ({latitude}, {longitude})")

# ✅ Predict & Save
if st.sidebar.button("🔍 Predict & Store"):
    if name and aadhaar:
        try:
            features_scaled = scaler.transform([features])
            prediction = model.predict(features_scaled)[0]
            insert_record(name, aadhaar, features, prediction, selected_state, latitude, longitude)
            st.success(f"✅ Risk Prediction for {name}: {prediction:.2f} stored successfully!")
        except Exception as e:
            st.error(f"❌ Prediction Error: {e}")
    else:
        st.warning("⚠️ Please enter both Name and Aadhaar Number.")

# 🧹 Clear DB
if st.sidebar.button("🗑️ Clear Database"):
    delete_all_records()
    st.warning("⚠️ All records deleted.")

# 📊 Data Summary
df = get_data()
if not df.empty:
    avg_risk_df = df.groupby("place").agg(
        count=("risk_prediction", "count"),
        avg_risk=("risk_prediction", "mean")
    ).reset_index()

    st.subheader("📈 Summary by Place")
    st.write(avg_risk_df)

    st.subheader("📋 Full Records")
    st.dataframe(df)

    df = df.merge(avg_risk_df, on="place", how="left")
    df["opacity"] = (df["avg_risk"] - df["avg_risk"].min()) / (df["avg_risk"].max() - df["avg_risk"].min())
    df["opacity"] = df["opacity"] * 0.7 + 0.3

    st.subheader("🗺️ Risk Map")
    fig = px.scatter_mapbox(
        df, lat="latitude", lon="longitude", text="place",
        color="risk_prediction", size="risk_prediction", size_max=15,
        zoom=6, center={"lat": 10.91, "lon": 78.0},
        mapbox_style="carto-positron", color_continuous_scale="Reds",
        opacity=df["opacity"]
    )
    st.plotly_chart(fig)
else:
    st.info("ℹ️ No records found. Please submit a prediction first.")
