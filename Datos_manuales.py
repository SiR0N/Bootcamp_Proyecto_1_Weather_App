from datetime import datetime

def leer_registro():

    print("=== Registro Meteorológico ===")

    # Validar fecha
    while True:
        fecha_texto = input("Introduce la fecha y hora (DD/MM/AAAA HH:MM): ")
        try:
            fecha = datetime.strptime(fecha_texto, "%d/%m/%Y %H:%M")
            break
        except ValueError:
            print("Formato incorrecto. Usa DD/MM/AAAA HH:MM")

    estacion = input("Estacion: ")

    # Validar temperatura
    while True:
        try:
            temperatura = float(input("Temperatura (°C): "))
            if -10 <= temperatura <= 42:
                break
        except ValueError:
            print("La temperatura debe estar entre -10 y 42")

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

    registro = {
        "Fecha": fecha.strftime("%d/%m/%Y %H:%M"),
        "Estacion": estacion,
        "Temperatura (°C)": temperatura,
        "Humedad (%)": humedad,
        "Viento (km/h)": viento
        }

    # Alertas
    print("\n--- ALERTAS ---")

    if temperatura > 35:
        print("Alerta: Temperatura muy alta")

    if temperatura < 0:
        print("Alerta: Heladas")

    if viento > 70:
        print("Alerta: Viento muy fuerte")

    # Mostrar registro
    print("\n--- Registro guardado ---")
    for clave, valor in registro.items():
        print(f"{clave}: {valor}")
    
    return registro

if __name__ =="__main__":
    leer_registro()