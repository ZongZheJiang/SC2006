import os
import requests
from utils.performance import measure_time
from utils.token import get_token
from dotenv import load_dotenv

load_dotenv()
URL=os.getenv("CARPARK_LOTS_URL")

def retrieve_carpark_lots():
    try:
        response = requests.get(URL)
        response.raise_for_status()
        data = response.json()
        return data["items"][0]['carpark_data']
    except requests.exceptions.RequestException as e:
        return None

def search_by_id(lots_data, id):
    for carpark_lots in lots_data:
        if carpark_lots["carpark_number"]==id:
            return carpark_lots["carpark_info"]

@measure_time
def retrieve_and_parse_lots(carparks):
    lots_data = retrieve_carpark_lots()
    for carpark in carparks:
        res=search_by_id(lots_data, carpark["id"])
        carpark.update(res[0]) if res else carpark.update({"lots_type":None})
    return carparks
