from flask import Flask, jsonify
from flask_cors import CORS
from services.redis_cache import redis_startup, initialize_cache
from services import database as db
from routes.bookmarks import bookmarks_bp
from routes.findcarpark import findcarpark_bp, load_redis
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

@app.route('/yolo')
def retrieve_LTA_lots():
    load_dotenv()
    LTA_URL=os.getenv("LTA_LOTS_URL")
    ACCESS_KEY=os.getenv("LTA_ACCESS_KEY")
    headers = {
        'AccountKey': ACCESS_KEY,
        'Accept': 'application/json'
    }
    try:
        response = requests.get(
            LTA_URL,
            headers=headers
        )
        data=response.json()['value']
        return [data for data in response.json()['value'] if data['Agency']!="HDB"]
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run()
