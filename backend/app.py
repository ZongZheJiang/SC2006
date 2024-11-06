from flask import Flask, jsonify
from flask_cors import CORS
from services import database as db
from routes.bookmarksController import bookmarks_bp
from routes.findcarparkController import findcarpark_bp
from routes.sortController import sort_option_bp

import requests
import os
from dotenv import load_dotenv
app = Flask(__name__)
CORS(app)

db.main()

app.register_blueprint(bookmarks_bp)
app.register_blueprint(findcarpark_bp)
app.register_blueprint(sort_option_bp)

if __name__ == '__main__':
    app.run()
