from flask import Flask, jsonify
import requests
import csv

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/initialise-carpark-table")
def get_carpark_list():
    carpark_dict = {}
    csv_file = 'HDBCarparkInformation.csv'
    
    with open(csv_file, mode='r') as file:
        # Create a CSV reader that returns rows as dictionaries
        reader = csv.DictReader(file)

        # Iterate through each row and store it in the dictionary
        for row in reader:
            # Use Carpark_Name as the key and the rest of the row as the value
            carpark_name = row['address']
            carpark_dict[carpark_name] = {
                'carpark_number': row['car_park_no']
            }
    return carpark_dict

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