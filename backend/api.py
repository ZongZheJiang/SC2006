from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/carpark-availability')
def get_carpark_availability():
    # API endpoint
    url = "https://api.data.gov.sg/v1/transport/carpark-availability"
    
    try:
        # Sending GET request to the API
        response = requests.get(url)
        # Checking if the request was successful
        response.raise_for_status()
        # Parse the response to JSON format
        data = response.json()
        # Returning the data as JSON
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500