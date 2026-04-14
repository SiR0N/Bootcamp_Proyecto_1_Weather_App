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



from datetime import datetime

# Validar fecha
while True:
    fecha = input("Fecha (DD/MM/AAAA): ")
    try:
        datetime.strptime(fecha, "%d/%m/%Y")
        break
    except ValueError:
        print("Formato incorrecto. Usa DD/MM/AAAA")

zona = input("Zona: ")

# Validar temperatura
while True:
    try:
        temperatura = float(input("Temperatura (°C): "))
        if 0 <= temperatura <= 40:
        break
    except ValueError:
        print("La temperatura debe estar entre 0 y 40")

# Validar humedad
while True:
    try:
        humedad = float(input("Humedad (%): "))
        if 0 <= humedad <= 100:
            break
        else:
            print("La humedad debe estar entre 0 y 100")
    except ValueError:
        print("Introduce un número válido")

# Validar viento
while True:
    try:
        viento = float(input("Viento (km/h): "))
        break
    except ValueError:
        print("Introduce un número válido")

# (Opcional) precipitaciones
while True:
    try:
        precipitaciones = float(input("Precipitaciones (mm): "))
        break
    except ValueError:
        print("Introduce un número válido")


# Crear registro
registro = {
    "Fecha": fecha,
    "Zona": zona,
    "Temperatura (°C)": temperatura,
    "Humedad (%)": humedad,
    "Viento (km/h)": viento,
    "Precipitaciones (mm)": precipitaciones
}

# Alertas
print("\n--- ALERTAS ---")

if temperatura > 35:
    print("Alerta: Temperatura muy alta")

if precipitaciones > 50:
    print("Alerta: Lluvia intensa")

if temperatura > 30 and precipitaciones > 30:
    print("Clima extremo: calor + lluvias fuertes")

if viento > 70:
    print("Alerta: Viento muy fuerte")


# Mostrar registro
print("\n--- Registro guardado ---")
for clave, valor in registro.items():
    print(f"{clave}: {valor}")