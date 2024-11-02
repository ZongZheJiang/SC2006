import csv
import io
import os
import pickle
import time
import redis
import subprocess
from subprocess import DEVNULL
from utils.performance import measure_time
from dotenv import load_dotenv

load_dotenv()
HOST = os.getenv('REDIS_HOST')
PORT = int(os.getenv('REDIS_PORT'))

def initialize_cache(redis_client):
    headers = ['agency', 'carpark_id', 'address', 'lat', 'lon', 'price']
    carpark_data = {}

    with open('assets/updated/CarparkInformation_new.csv', 'r') as file:
        csv_reader = csv.reader(file)
        next(csv_reader)
        index=0
        for row in csv_reader:
            carpark_dict = {
                'agency': row[0],
                'carpark_id': row[1],
                'address': row[2],
                'lat': row[3],
                'long': row[4],
                'price': row[5]
            }
            carpark_data[row[1]] = carpark_dict

    carpark_data = pickle.dumps(carpark_data)
    redis_client.set("carpark_data", carpark_data)

def get_carpark_data(redis_client):
    carpark_data = redis_client.get('carpark_data')
    if carpark_data is not None:
        return pickle.loads(carpark_data)
    return None

def redis_startup(host=HOST, port=PORT, db=0):
    redis_server=subprocess.Popen(['redis-server'],stdout=DEVNULL,stderr=DEVNULL)
    redis_client = redis.Redis(host=host, port=port, db=db)
    return redis_client
