from flask import Flask
from .config import Config
from .extensions import mongo, oauth
from flask_session import Session

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.secret_key = Config.SECRET_KEY
    Session(app)

    from .routes import bp
    app.register_blueprint(bp)

    mongo.init_app(app, uri=Config.MONGO_URI)
    oauth.init_app(app)

    return app
