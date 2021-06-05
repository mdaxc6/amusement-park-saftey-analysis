import pandas as pd
from sqlalchemy import create_engine

# Declare Variables
# ----------------------------------
accidents_csv = "../../Resources/raw/Saferparks-dataset-legacy-v2.csv"
table_name = "accident_data"

# Create Database Connection
# ----------------------------------
# Creates a connection to our DB
engine = create_engine("sqlite:///../../Resources/park_accidents.sqlite", encoding="ANSI")
conn = engine.connect()

# Read csv as dataframe and convert to sql database
# ----------------------------------
df = pd.read_csv(accidents_csv, encoding="ANSI")
df.to_sql(table_name, conn, if_exists='append', index=False)


# Uploading the csv to a database in this manner neglects assigning primary keys,
# which is required by SQLalchemy. With this in mind, i used a progam called DB Browser for SQLite,
# and made the Lat, Lon, Year, Month, and Day columns a collective primary key.