from flask import Flask, request, render_template, jsonify
import pandas as pd
import json
import atexit

# Import your custom modules
import data_store
from data_store import append_records, save_to_disk, load_initial_json, load_initial_csv
from myLogs import logger

# 1. Initialize the Flask App
# This 'app' variable is what Gunicorn looks for!
app = Flask(__name__)

logger.info("Flask iniciado correctamente")

# 2. Load initial data
app = Flask(__name__)
logger.info("Flask iniciado correctamente")

# --- ROUTES: VIEWS ---

@app.route("/")
def home():
    return render_template("index.html", active="dashboard")

@app.route("/añadir-datos")
def añadir_datos():
    return render_template("anadir_datos.html", active="add")

@app.route("/informes")
def informes():
    return render_template("informes.html", active="informes")

@app.route("/settings")
def settings():
    # Adding the route for your new settings page
    return render_template("settings.html", active="settings")

# --- ROUTES: DATA API ---

@app.route("/get_data")
def get_data():
    # Access the dataframe from the data_store module
    return data_store.dataframe.to_json(orient="records")

@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    file = request.files['file']
    new_df = pd.read_csv(file)
    append_records(new_df)
    save_to_disk()
    logger.info(f"Archivo CSV recibido: {file.filename} con {len(new_df)} registros")
    return {"status": "ok", "message": "CSV añadido al general"}

@app.route('/upload_json', methods=['POST'])
def upload_json():
    file = request.files['file']
    data = json.load(file)
    new_df = pd.DataFrame(data)
    append_records(new_df)
    save_to_disk()
    logger.info(f"Archivo JSON recibido: {file.filename} con {len(new_df)} registros")
    return {"status": "ok", "message": "JSON añadido al general"}

@app.route("/api/dashboard")
def api_dashboard():
    df = data_store.dataframe

    # Load stations with lat/lon
    try:
        with open("static/stations.json", "r", encoding="utf-8") as f:
            estaciones_geo = json.load(f)
    except FileNotFoundError:
        return jsonify({"error": "stations.json not found"}), 500

    geo_dict = {e["id"]: e for e in estaciones_geo}
    estaciones_resultado = []

    # Grouping by station to get latest data
    for estacion_id, grupo in df.groupby("ESTACION"):
        if estacion_id not in geo_dict:
            continue

        grupo["FECHA_HORA"] = pd.to_datetime(grupo["FECHA_HORA"], errors="coerce")
        ultimo = grupo.sort_values("FECHA_HORA").iloc[-1]

        estaciones_resultado.append({
            "id": int(estacion_id),
            "fecha": ultimo["FECHA_HORA"].strftime("%Y-%m-%d %H:%M:%S") if pd.notnull(ultimo["FECHA_HORA"]) else "N/A",
            "name": ultimo["ESTACION_NOMBRE"],
            "lat": geo_dict[estacion_id]["lat"],
            "lon": geo_dict[estacion_id]["lon"],
            "temperature": float(ultimo["Temperatura"]) if pd.notna(ultimo["Temperatura"]) else None,
            "humidity": float(ultimo["Humedad relativa"]) if pd.notna(ultimo["Humedad relativa"]) else None,
            "wind_speed": float(ultimo["Velocidad del viento"]) if pd.notna(ultimo["Velocidad del viento"]) else None,
        })

    if not estaciones_resultado:
        return jsonify({"error": "No data available"}), 404

    df_est = pd.DataFrame(estaciones_resultado)

    # Calculate averages
    medias = {
        "avg_temp": float(df_est["temperature"].dropna().mean()) if df_est["temperature"].notna().any() else None,
        "avg_hum": float(df_est["humidity"].dropna().mean()) if df_est["humidity"].notna().any() else None,
        "avg_wind": float(df_est["wind_speed"].dropna().mean()) if df_est["wind_speed"].notna().any() else None,
    }

    # Helper function for Top Rankings
    def top(col):
        valid = df_est.dropna(subset=[col])
        if valid.empty:
            return None
        row = valid.loc[valid[col].idxmax()]
        return {
            "name": row["name"],
            "value": float(row[col]),
            "id": int(row["id"])
        }

    ranking = {
        "top_temp": top("temperature"),
        "top_hum": top("humidity"),
        "top_wind": top("wind_speed"),
    }

    return jsonify({
        "estaciones": estaciones_resultado,
        "medias": medias,
        "ranking": ranking
    })

# 3. Clean shutdown handler
@atexit.register
def shutdown_log():
    save_to_disk()
    logger.info("Aplicación cerrada. Datos guardados correctamente.")

if __name__ == "__main__":
    app.run(debug=True)

load_initial_json()
load_initial_csv()
