import pandas as pd
from myLogs import logger

dataframe = None  # Aquí vivirá tu "base de datos"
path = "historico.json"

def load_initial_json(path=path):
    global dataframe
    dataframe = pd.read_json(path)
    print(dataframe.columns)
    print(dataframe.head())
    logger.info(f"JSON inicial cargado desde {path} con {len(dataframe)} registros")
    print("JSON inicial cargado con", len(dataframe), "registros")
    return dataframe

def append_records(new_df):
    global dataframe
    before = len(dataframe)
    dataframe = pd.concat([dataframe, new_df], ignore_index=True)
    after = len(dataframe)

    logger.info(f"Añadidos {len(new_df)} registros. Total antes: {before}, total ahora: {after}")
    print("Nuevos registros añadidos. Total:", after)
    return dataframe

def save_to_disk(path=path):
    global dataframe
    dataframe.to_json(path, orient="records", indent=2)
    logger.info(f"Base de datos guardada en {path} con {len(dataframe)} registros")
    print("Base de datos guardada en disco")