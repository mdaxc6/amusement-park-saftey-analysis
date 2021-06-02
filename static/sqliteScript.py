import pandas as pd
from sqlalchemy import create_engine

# Declare Variables
# ----------------------------------
volcanoCsv = "../Resources/volcano_data.csv"
table_name = "volcano_data"


# Create Database Connection
# ----------------------------------
# Creates a connection to our DB
engine = create_engine("sqlite:///../Resources/volcanos.sqlite")
conn = engine.connect()

# Read csv as dataframe and convert to sql database
# ----------------------------------
df = pd.read_csv(volcanoCsv)
df.to_sql(table_name, conn, if_exists='append', index=False)