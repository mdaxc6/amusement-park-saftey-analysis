import numpy as np
import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask_cors import CORS

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/park_accidents.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Accidents = Base.classes.accident_data

# save reference to state counts csv
state_counts_csv = 'Resources/raw/state_counts.csv'
state_counts_df = pd.read_csv(state_counts_csv)
#################################################
# Flask Setup
#################################################
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

#################################################
# Flask Routes
#################################################

@app.route("/")
def index():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"<a href='/api/v1.0/all_accidents'>All Accidents</a><br/>"
        f"<a href='/api/v1.0/accident_location_state'>Accident Location by State</a><br/>"
        f"<a href='/api/v1.0/accident_location_city'>Accident Location by City</a><br/>"
    )


@app.route("/api/v1.0/all_accidents")
def all_accidents():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = session.query(Accidents)

    session.close()

    accidentList = []
    for accident in results:
        accident_dict = {}
        accident_dict["date"] = accident.acc_date
        accident_dict["state"] = accident.acc_state
        accident_dict["state_location"] = {"lat": accident.state_lat, "lng": accident.state_lng }
        accident_dict["bus_type"] = accident.bus_type
        accident_dict["device_category"] = accident.device_category
        accident_dict["industry_sector"] = accident.industry_sector
        accident_dict["device_type"] = accident.device_type
        accident_dict["tradename_or_generic"] = accident.tradename_or_generic
        accident_dict["num_injured"] = accident.num_injured
        accident_dict["acc_desc"] = accident.acc_desc
        accident_dict["injury_desc"] = accident.injury_desc
        accident_dict["category"] = accident.category
        if(accident.acc_city):
            accident_dict["acc_city"] = accident.acc_city
            accident_dict["city_location"] = {"lat":accident.city_lat, "lng": accident.city_lng }
        if(accident.manufacturer):
            accident_dict["manufacturer"] = accident.manufacturer
        accident_dict["mech_failure"] = True if accident.mechanical else False
        accident_dict["operator_error"] = True if accident.op_error else False
        accidentList.append(accident_dict)

    wrapper = {"accidents": accidentList }
    return jsonify(wrapper)


@app.route("/api/v1.0/accident_location_state")
def accident_location_state():

    geoJson = {
        "type": "FeatureCollection",
        "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [row["state_lng"], row["state_lat"]],    
            },
            "properties": {
                   "state" : row["acc_state"],
                   "num_accidents": row["count"]
            }
        } for index, row in state_counts_df.iterrows()]
    }

    return geoJson


@app.route("/api/v1.0/accident_location_city")
def accident_location_city():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = session.query(Accidents).filter(Accidents.city_lat != "null");

    session.close()

    geoJson = {
        "type": "FeatureCollection",
        "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [accident.city_lng, accident.city_lat],    
            },
            "properties": {
                   "city": accident.acc_city,
                   "state" : accident.acc_state,
                   "date": accident.acc_date,
                   "num_injured": accident.num_injured,
                   "device_type": accident.device_type,
                   "injury_desc": accident.injury_desc,
                   "acc_desc" : accident.acc_desc,
                   "bus_type" : accident.bus_type
            }
        } for accident in results]
    }
    return geoJson

if __name__ == '__main__':
    app.run(debug=True)