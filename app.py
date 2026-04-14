from flask import Flask, request,render_template
import pandas as pd
import json

import data_store
from data_store import append_records, save_to_disk, load_initial_csv
from myLogs import logger

import atexit

app = Flask(__name__)
logger.info("Flask iniciado correctamente")

# Cargar CSV al iniciar la app
load_initial_csv()
#http://127.0.0.1:5000/

@app.route("/")
def home():
    return render_template("index.html", active="dashboard")

@app.route("/añadir-datos")
def añadir_datos():
    return render_template("anadir_datos.html", active="add")

@app.route("/informes")
def informes():
    return render_template("informes.html", active="informes")


@app.route("/get_data")
def get_data():
    # Acceder SIEMPRE al dataframe desde el módulo
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


from flask import jsonify
import data_store

@app.route("/api/dashboard")
def api_dashboard():
    df = data_store.dataframe

    # Cargar estaciones con lat/lon
    with open("static/stations.json", "r", encoding="utf-8") as f:
        estaciones_geo = json.load(f)

    geo_dict = {e["id"]: e for e in estaciones_geo}

    estaciones_resultado = []

    # --- Recorrer estaciones y preparar datos para el mapa ---
    for estacion_id, grupo in df.groupby("ESTACION"):
        if estacion_id not in geo_dict:
            continue

        grupo["FECHA_HORA"] = pd.to_datetime(grupo["FECHA_HORA"], errors="coerce")
        ultimo = grupo.sort_values("FECHA_HORA").iloc[-1]

        estaciones_resultado.append({
            "id": int(estacion_id),
            "fecha": ultimo["FECHA_HORA"].strftime("%Y-%m-%d %H:%M:%S"),
            "name": ultimo["ESTACION_NOMBRE"],
            "lat": geo_dict[estacion_id]["lat"],
            "lon": geo_dict[estacion_id]["lon"],
            "temperature": float(ultimo["Temperatura"]) if pd.notna(ultimo["Temperatura"]) else None,
            "humidity": float(ultimo["Humedad relativa"]) if pd.notna(ultimo["Humedad relativa"]) else None,
            "wind_speed": float(ultimo["Velocidad del viento"]) if pd.notna(ultimo["Velocidad del viento"]) else None,
        })

    # Convertir a DataFrame para cálculos
    df_est = pd.DataFrame(estaciones_resultado)

    # --- MEDIAS ---
    medias = {
        "avg_temp": float(df_est["temperature"].dropna().mean()) if df_est["temperature"].notna().any() else None,
        "avg_hum": float(df_est["humidity"].dropna().mean()) if df_est["humidity"].notna().any() else None,
        "avg_wind": float(df_est["wind_speed"].dropna().mean()) if df_est["wind_speed"].notna().any() else None,
    }

    # --- RANKING ---
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



@atexit.register
def shutdown_log():
    save_to_disk()
    logger.info("Aplicación cerrada. Datos guardados correctamente.")