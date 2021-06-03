import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///../../Resources/volcanos.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Volcanos = Base.classes.volcano_data

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"<a href='/api/v1.0/countries'>countries</a><br/>"
    )

# Returns a list of all affected countries
@app.route("/api/v1.0/countries")
def countries():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all Countries affeted by volcanos
    results = session.query(Volcanos.Country).group_by(Volcanos.Country).all()

    session.close()

    # Convert list of tuples into normal list
    all_countries = list(np.ravel(results))

    return jsonify(all_countries)

@app.route("/api/v1.0/volcano_data")
def volcano_data():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = session.query(Volcanos)

    session.close()

    volcanosList = []
    for volcano in results:
        volcano_dict = {}
        volcano_dict["name"] = volcano.Name
        volcano_dict["location"] = volcano.Location
        volcano_dict["country"] = volcano.Country
        volcano_dict["lat"] = volcano.Latitude
        volcano_dict["lon"] = volcano.Longitude
        volcano_dict["date"] = f'{volcano.Month}/{volcano.Day}/{volcano.Year}'
        if(volcano.) 
        volcanosList.append(volcano_dict)

    wrapper = {"eruptions": volcanosList }
    return jsonify(wrapper)




if __name__ == '__main__':
    app.run(debug=True)