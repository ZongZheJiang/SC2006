from flask import Flask, jsonify
import requests
import csv
from datetime import datetime, timedelta
import urllib3
urllib3.disable_warnings()
import json


#global variables
URA_ACCESS_KEY = '2401e0c5-f31d-4434-8261-3db6c18ffcdc'
TOKEN = None
TOKEN_EXPIRY = None

app = Flask(__name__)

def get_token():
    url = "https://www.ura.gov.sg/uraDataService/insertNewToken.action"
    payload = {}
    headers = {
        'AccessKey': '2401e0c5-f31d-4434-8261-3db6c18ffcdc',
        'Cookie': '__nxquid=SZcRzGjcscZURbYH/M7bNrvVllWh+A==0014',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.ura.gov.sg/',
        'Origin': 'https://www.ura.gov.sg'
    }
    session = requests.Session()
    try:
        response = session.get(url, headers=headers, data=payload)

        if response.headers.get('Content-Type', '').startswith('application/json'):
            try:
                data = response.json()
                if data.get('Status') == 'Success':
                    return data.get('Result')
                else:
                    raise Exception(f"Failed to get token: {data}")
            except requests.exceptions.JSONDecodeError:
                print("Failed to parse JSON response")
                return None
        else:
            print(f"Unexpected content type: {response.headers.get('Content-Type')}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None
    
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/get_carpark_nameToNumber")
def get_carpark_nameToNumber():
    carpark_nameToNumber = {}
    csv_file = 'HDBCarparkInformation.csv'
    
    with open(csv_file, mode='r') as file:
        # Create a CSV reader that returns rows as dictionaries
        reader = csv.DictReader(file)

        # Iterate through each row and store it in the dictionary
        for row in reader:
            # Use Carpark_Name as the key and the rest of the row as the value
            carpark_name = row['address']
            carpark_nameToNumber[carpark_name] = {
                'carpark_number': row['car_park_no']
            }
    return carpark_nameToNumber

@app.route("/get_carpark_nameToLongLat")
def get_carpark_nameToLongLat():
    carpark_nameToLongLat = {}
    csv_file = 'HDBCarparkInformation.csv'
    
    with open(csv_file, mode='r') as file:
        # Create a CSV reader that returns rows as dictionaries
        reader = csv.DictReader(file)

        # Iterate through each row and store it in the dictionary
        for row in reader:
            # Use Carpark_Name as the key and the rest of the row as the value
            carpark_name = row['address']
            carpark_nameToLongLat[carpark_name] = {
                'long': row['long'],
                'lat': row['lat']
            }
    return carpark_nameToLongLat

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
    if not token:
        return jsonify({'error': 'Failed to get token'}), 500

    url = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details"
    payload = {}
    headers = {
        "AccessKey": URA_ACCESS_KEY,
        "Token": token,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.ura.gov.sg/',
        'Origin': 'https://www.ura.gov.sg'
    }

    session = requests.Session()

    try:
        response = session.get(url, headers=headers, data=payload)

        if response.headers.get('Content-Type', '').startswith('application/json'):
            try:
                data = response.json()
                if data.get('Status') == 'Success':
                    return jsonify(data.get('Result'))
                else:
                    return jsonify({'error': f"API returned unsuccessful status: {data.get('Message', 'No message provided')}"}), 500
            except json.JSONDecodeError as e:
                return jsonify({'error': f'Failed to parse JSON response: {str(e)}', 'content': response.text[:1000]}), 500
        else:
            return jsonify({
                'error': f"Unexpected content type: {response.headers.get('Content-Type')}",
                'content': response.text[:1000],
                'status_code': response.status_code
            }), 500

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Request failed: {str(e)}'}), 500