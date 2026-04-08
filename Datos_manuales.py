print("=== Registro Meteorológico ===")

fecha = input("Fecha (DD/MM/AAAA): ")
zona = input("Zona: ")
temperatura = input("Temperatura (°C): ")
humedad = input("Humedad (%): ")
viento = input("Viento (km/h): ")


registro = {
    "Fecha": fecha,
    "Zona": zona,
    "Temperatura (°C)": temperatura,
    "Humedad (%)": humedad,
    "Viento (km/h)": viento
    }

print("\n--- Registro guardado ---")
for clave, valor in registro.items():
    print(f"{clave}: {valor}")