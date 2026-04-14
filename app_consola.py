from Log_in import menu
from Datos_manuales import leer_registro
from data_store import load_initial_json, append_records, save_to_disk
import pandas as pd

def main():
    resultado_login = menu()
    if resultado_login == True:
        dataframe = load_initial_json()

        while True:
            print("\n1. Añadir nuevo registro de datos")
            print("2. Mostrar los datos")
            print("3. Salir")

            opcion = input("Elige una opción: ")
            registro_lista = []
            if opcion == "1":
                registro_lista.append(leer_registro())

                df_registros = pd.DataFrame(registro_lista)
                dataframe = append_records(df_registros)
                save_to_disk()

            if opcion == "2":
                estacion = input("Elige una estación: ")
                df_filtrado = dataframe.loc[dataframe["Estacion"] == estacion]
                print(df_filtrado.to_string())

            if opcion == "3":
                break

if __name__ == "__main__":
    main()
