import csv
import io
import os
import pickle
import time
import redis
import subprocess
from subprocess import DEVNULL
from utils.performance import measure_time, memory_usage
from dotenv import load_dotenv

load_dotenv()
HOST = os.getenv('REDIS_HOST')
PORT = int(os.getenv('REDIS_PORT'))

@measure_time
@memory_usage
def initialize_cache(redis_client):
    carpark_data = {}

    with open('assets/HDBCarparkInformation.csv', 'r') as file:
        csv_reader = csv.reader(file)
        next(csv_reader)
        for row in csv_reader:
            lat, lon = float(row[2]), float(row[3])
            carpark_data[row[0]] = [row[x] for x in range(1, 11)]

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
