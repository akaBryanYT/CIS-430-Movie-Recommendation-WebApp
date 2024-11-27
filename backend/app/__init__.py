# app/__init__.py
from flask import Flask

def create_app():
    app = Flask(__name__)

    # Register blueprints or routes
    from .routes import main_bp
    app.register_blueprint(main_bp)

    return app
