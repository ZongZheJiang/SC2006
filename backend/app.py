from flask import Flask
from flask_cors import CORS
from services.redis_cache import redis_startup, initialize_cache
from services import database as db
from routes.bookmarks import bookmarks_bp
from routes.findcarpark import findcarpark_bp, load_redis

app = Flask(__name__)
CORS(app)

db.main()
redis_server = redis_startup()
initialize_cache(redis_server)
load_redis(redis_server)

app.register_blueprint(bookmarks_bp)
app.register_blueprint(findcarpark_bp)

if __name__ == '__main__':
    app.run()
