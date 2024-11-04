from flask import Flask, jsonify
from flask_cors import CORS
from services.redis_cache import redis_startup, initialize_cache
from services import database as db

from routes.bookmarksController import bookmarks_bp
from routes.findcarparkController import findcarpark_bp, load_redis
from routes.sortController import sort_option_bp

import requests
import os
from dotenv import load_dotenv
app = Flask(__name__)
CORS(app)

db.main()
redis_server = redis_startup()
initialize_cache(redis_server)
load_redis(redis_server)

app.register_blueprint(bookmarks_bp)
app.register_blueprint(findcarpark_bp)
app.register_blueprint(sort_option_bp)

if __name__ == '__main__':
    app.run()
