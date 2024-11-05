from flask import Blueprint, jsonify, request, make_response
from services import database as db

carpark_bp = Blueprint('carpark', __name__)

@carpark_bp.route("/carpark", methods=["GET"])
def get_carparks():
    carpark_data = db.retrieve_carparks()
    if carpark_data:
        return jsonify(carpark_data), 200
    else:
        return make_response(jsonify({"error": "No carpark data found or an error occurred"}), 404)
