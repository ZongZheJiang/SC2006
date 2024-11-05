import requests
from flask import Blueprint, jsonify, request, make_response

from services.retrieve_lots import update_result_with_LTA_lots, update_result_with_HDB_lots
from services.sort_methods import sort_by_dist, sort_by_lots, sort_by_price
from utils.performance import measure_time
from services import database as db

import os
from dotenv import load_dotenv

load_dotenv()
BACKEND_URL=os.getenv("BACKEND_URL")

findcarpark_bp = Blueprint('findcarpark', __name__)

@findcarpark_bp.route("/carpark", methods=["GET"])
def get_carparks():
    carpark_data = db.retrieve_carparks()
    if carpark_data:
        return jsonify(carpark_data), 200
    else:
        return make_response(jsonify({"error": "No carpark data found or an error occurred"}), 404)


@findcarpark_bp.route('/find')
@measure_time
def carparkfinder():
    # carpark_data = get_carpark_data(redis_instance)
    carpark_data=requests.get(BACKEND_URL + "carpark").json()
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    destination = (lat, lon)

    res = sort_by_dist(destination, carpark_data)
    update_result_with_HDB_lots(res)
    update_result_with_LTA_lots(res)

    sort_type= requests.get(BACKEND_URL + "sort").json()["sort_type"]

    if sort_type=="price":
        sort_by_price(res)
    elif sort_type=="lots":
        sort_by_lots(res)
    return jsonify({
         "status": "success",
        "data": res
    })
