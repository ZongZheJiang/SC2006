from flask import Blueprint, jsonify, request
from services.redis_cache import get_carpark_data
from services.distance_search import linear_search
from services.retrieve_lots import retrieve_and_parse_lots
from utils.performance import measure_time

findcarpark_bp = Blueprint('findcarpark', __name__)

redis_instance = None

def load_redis(redis_server):
    global redis_instance
    redis_instance = redis_server

@findcarpark_bp.route('/find')
@measure_time
def carparkfinder():
    carpark_data = get_carpark_data(redis_instance)
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    destination = (lat, lon)

    res = linear_search(destination, carpark_data)
    for r in res:
        r.update({"location": carpark_data[r["id"]][0]})

    retrieve_and_parse_lots(res)
    return jsonify({
         "status": "success",
        "data": res
    })
