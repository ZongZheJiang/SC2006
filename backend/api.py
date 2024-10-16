from flask import Flask, jsonify
import requests
import csv
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)

#global variables
URA_ACCESS_KEY = '2401e0c5-f31d-4434-8261-3db6c18ffcdc'
TOKEN = None
TOKEN_EXPIRY = None
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'


api_url_base= 'https://www.ura.gov.sg/uraDataService/insertNewToken.action'

headers = {
    'AccessKey': URA_ACCESS_KEY,
    'User-Agent': USER_AGENT
    }

def get_token():  
    response = requests.get(api_url_base, headers=headers)

    if response.status_code == 200:
        data = response.json()
        return data.get('Result')
    else:
        return None

@app.route("/get_carpark_nameToNumber")
def get_carpark_nameToNumber():
    carpark_nameToNumber = {}
    csv_file = 'HDBCarparkInformation.csv'
    
    with open(csv_file, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
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
        reader = csv.DictReader(file)
        for row in reader:
            carpark_name = row['address']
            carpark_nameToLongLat[carpark_name] = {
                'long': row['long'],
                'lat': row['lat']
            }
    return carpark_nameToLongLat

@app.route('/carpark-availability')
def get_carpark_availability():
    url = "https://api.data.gov.sg/v1/transport/carpark-availability"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/carpark-rates')
def get_carpark_rates():
    token = get_token()

    url = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details"
    headers = {
        "AccessKey": URA_ACCESS_KEY,
        "Token": token,
        'User-Agent': USER_AGENT
    }

    response = requests.get(url, headers=headers)
    data = response.json()

    if data['Status'] == 'Success':
        return jsonify(data['Result'])
    else:
        return jsonify({'error': 'Failed to fetch car park rates'}), 500