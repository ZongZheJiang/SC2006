from flask import Flask, jsonify
from flask_cors import CORS
from services import database as db
from routes.bookmarksController import bookmarks_bp
from routes.findcarparkController import findcarpark_bp
from routes.sortController import sort_option_bp

import requests
import os
from dotenv import load_dotenv
app = Flask(__name__)
CORS(app)

db.main()

app.register_blueprint(bookmarks_bp)
app.register_blueprint(findcarpark_bp)
app.register_blueprint(sort_option_bp)

@app.route("/sss")
def function():
    try:
        response = requests.get("https://api.data.gov.sg/v1/transport/carpark-availability")
        response.raise_for_status()
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        return None

@app.route("/ttt")
def retrieve_LTA_lots():
    headers = {
        'AccountKey': "pTDfKV74SOWJSo3vyY+BiA==",
        'Accept': 'application/json'
    }
    try:
        response = requests.get(
            "https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2",
            headers=headers
        )
        return [data for data in response.json()['value'] if data['Agency']!="HDB"] # dictionary
    except requests.exceptions.RequestException as e:
        return None


if __name__ == '__main__':
    app.run()
