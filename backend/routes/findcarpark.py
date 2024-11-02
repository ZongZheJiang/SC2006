from flask import Blueprint, jsonify, request
from services.redis_cache import get_carpark_data
from services.search_method import search_dist
from services.retrieve_lots import update_result_with_LTA_lots, update_result_with_HDB_lots
from utils.performance import measure_time
from services.sort_methods import sort_by_lots, sort_by_price

findcarpark_bp = Blueprint('findcarpark', __name__)

redis_instance = None

def load_redis(redis_server):
    global redis_instance
    redis_instance = redis_server

@findcarpark_bp.route('/find')
def carparkfinder():
    carpark_data = get_carpark_data(redis_instance)
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    destination = (lat, lon)

    res = search_dist(destination, carpark_data)
    update_result_with_HDB_lots(res)
    update_result_with_LTA_lots(res)
    sort_by_price(res)
    # sort_by_lots(res)
    return jsonify({
         "status": "success",
        "data": res
    })
