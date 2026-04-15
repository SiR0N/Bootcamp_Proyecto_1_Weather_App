import pandas as pd
import os
from myLogs import logger

# Inicializamos el dataframe como vacío para poder mezclar los datos sin que dé error
dataframe = pd.DataFrame() 

json_path = "historico.json"
csv_path = "historico.csv"  # Asegúrate de que este sea el nombre real de tu archivo CSV

def load_initial_json(path=json_path):
    global dataframe
    if os.path.exists(path):
        new_df = pd.read_json(path)
        dataframe = pd.concat([dataframe, new_df], ignore_index=True)
        
        logger.info(f"JSON inicial cargado desde {path} con {len(new_df)} registros")
        print("JSON inicial cargado. Total de registros ahora:", len(dataframe))
    else:
        logger.warning(f"No se encontró el archivo JSON en {path}")
        print("Aviso: No se encontró", path)
    return dataframe

def load_initial_csv(path=csv_path):
    global dataframe
    if os.path.exists(path):
        new_df = pd.read_csv(path)
        dataframe = pd.concat([dataframe, new_df], ignore_index=True)
        
        logger.info(f"CSV inicial cargado desde {path} con {len(new_df)} registros")
        print("CSV inicial cargado. Total de registros ahora:", len(dataframe))
    else:
        logger.warning(f"No se encontró el archivo CSV en {path}")
        print("Aviso: No se encontró", path)
    return dataframe

def append_records(new_df):
    global dataframe
    before = len(dataframe)
    
    # Verificamos si el dataframe global está vacío
    if dataframe.empty:
        dataframe = new_df
    else:
        dataframe = pd.concat([dataframe, new_df], ignore_index=True)
        
    after = len(dataframe)

    logger.info(f"Añadidos {len(new_df)} registros. Total antes: {before}, total ahora: {after}")
    print("Nuevos registros añadidos. Total:", after)
    return dataframe

def save_to_disk(path=json_path):
    global dataframe
    if not dataframe.empty:
        # Nota: Guardamos TODA la mezcla en el archivo JSON para unificar la base de datos
        dataframe.to_json(path, orient="records", indent=2)
        logger.info(f"Base de datos guardada unificada en {path} con {len(dataframe)} registros")
        print("Base de datos guardada en disco")
