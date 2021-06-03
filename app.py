import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/earthquakes.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Earthquakes = Base.classes.earthquake_data

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def index():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"<a href='/api/v1.0/earthquakes'>Earthquakes</a><br/>"
    )


@app.route("/api/v1.0/earthquakes")
def earthquakes():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = session.query(Earthquakes)

    session.close()

    earthquakesList = []
    for earthquake in results:
        earthquake_dict = {}
        earthquake_dict["location"] = {"lat":earthquake.Latitude, "lon": earthquake.Longitude }
        earthquake_dict["date"] = earthquake.Date
        earthquake_dict["depth"] = earthquake.Depth
        earthquake_dict["mag"] = earthquake.Magnitude
        earthquake_dict["source"] = earthquake.Source
        earthquake_dict["id"] = earthquake.ID
        earthquakesList.append(earthquake_dict)

    wrapper = {"earthquakes": earthquakesList }
    return jsonify(wrapper)




if __name__ == '__main__':
    app.run(debug=True)