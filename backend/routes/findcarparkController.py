from flask import Blueprint, jsonify, request
import requests
from services.redis_cache import get_carpark_data
from services.retrieve_lots import update_result_with_LTA_lots, update_result_with_HDB_lots
from services.sort_methods import sort_by_dist, sort_by_lots, sort_by_price
from utils.performance import measure_time
from dotenv import load_dotenv
import os

load_dotenv()
BACKEND_URL=os.getenv("BACKEND_URL")

findcarpark_bp = Blueprint('findcarpark', __name__)

redis_instance = None

def load_redis(redis_server):
    global redis_instance
    redis_instance = redis_server

@measure_time
@findcarpark_bp.route('/find')
def carparkfinder():
    carpark_data = get_carpark_data(redis_instance)
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    destination = (lat, lon)

    res = sort_by_dist(destination, carpark_data)
    update_result_with_HDB_lots(res)
    update_result_with_LTA_lots(res)

    sort_type= requests.get(BACKEND_URL + "sort").json()
    print(sort_type)

    if sort_type=="price":
        sort_by_price(res)
    elif sort_type=="availability":
        sort_by_lots(res)
    return jsonify({
         "status": "success",
        "data": res
    })
