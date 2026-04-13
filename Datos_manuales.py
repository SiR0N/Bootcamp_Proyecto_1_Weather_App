print("=== Registro Meteorológico ===")

from datetime import datetime

fecha_texto = input("Introduce la fecha y hora (dd/mm/yyyy HH:MM): ")
fecha = datetime.strptime(fecha_texto, "%d/%m/%Y %H:%M")
zona = input("Zona: ")
temperatura = float(input("Temperatura (°C): "))
humedad = int(input("Humedad (%): "))
viento = int(input("Viento (km/h): "))


registro = {
    "Fecha": fecha.strftime("%d/%m/%Y %H:%M"),
    "Zona": zona,
    "Temperatura (°C)": temperatura,
    "Humedad (%)": humedad,
    "Viento (km/h)": viento
    }

print("\n--- Registro guardado ---")
for clave, valor in registro.items():
    print(f"{clave}: {valor}")