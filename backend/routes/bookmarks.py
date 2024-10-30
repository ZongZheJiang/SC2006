from flask import Blueprint, jsonify, request
from services import database as db

bookmarks_bp = Blueprint('bookmarks', __name__)

@bookmarks_bp.route("/user", methods=["GET"])
def get_user():
    uid = request.args.get("uid")
    resp = None
    if uid == None:
        resp = db.create_user()
    return jsonify(resp), 200

@bookmarks_bp.route("/bookmarks", methods=["GET"])
def get_bookmarks():
    uid = request.args.get("uid")
    resp = db.retrieve_bookmarks(uid)
    return jsonify(resp), 200

@bookmarks_bp.route("/bookmarks/add", methods=["POST"])
def add_bookmarks():
    data = request.get_json()
    db.insert_bookmark(data.get("uid"), data.get("location"), data.get("coordinates"))
    return jsonify({"message": "Bookmark created successfully"}), 201

@bookmarks_bp.route("/bookmarks/delete", methods=["POST"])
def remove_bookmarks():
    data = request.get_json()
    db.delete_bookmark(data.get("uid"), data.get("location"))
    return jsonify({"message": "Bookmark removed successfully"}), 200
