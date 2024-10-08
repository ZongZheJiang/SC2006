from flask import Flask, jsonify
import requests
import csv
from datetime import datetime, timedelta

app = Flask(__name__)

#global variables
URA_ACCESS_KEY = '2401e0c5-f31d-4434-8261-3db6c18ffcdc'
TOKEN = None
TOKEN_EXPIRY = None

def get_token():
    '''get token to access ura carpark rates and availability'''
    global TOKEN, TOEN_EXPIRY
    if TOKEN and TOKEN_EXPIRY and datetime.now() < TOKEN_EXPIRY:
        return TOKEN
    
    url = "https://www.ura.gov.sg/uraDataService/insertNewToken.action"
    headers = {'AccessKey': URA_ACCESS_KEY}
    response = requests.get(url, headers=headers)
    data = response.json()

    if data['Status'] == 'Success':
        TOKEN = data['Result']
        TOKEN_EXPIRY = datetime.now() + timedelta(days=1)
        return TOKEN
    else:
        raise Exception("Failed to get token")


# @app.route("/")
# def hello_world():
#     return "<p>Hello, World!</p>"

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
    
@app.route('/carpark-rates')
def get_carpark_rates():
    token = get_token()

    url = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details"
    headers = {
        "AceessKey": URA_ACCESS_KEY,
        "Token": token
    }

    response = requests.get(url, headers=headers)
    data = response.json()

    if data['Status'] == 'Success':
        return jsonify(data['Result'])
    else:
        return jsonify({'error': 'Failed to fetch car park rates'}), 500
