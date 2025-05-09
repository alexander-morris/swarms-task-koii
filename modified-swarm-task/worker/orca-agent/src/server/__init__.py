"""Flask application initialization."""

from flask import Flask, request
from .routes import healthz, config, logs
import os
import uuid
import logging

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    logger = logging.getLogger(__name__)

    # Add request ID middleware
    @app.before_request
    def before_request():
        request.id = str(uuid.uuid4())
        request.start_time = request.environ.get("REQUEST_TIME", 0)

    @app.after_request
    def after_request(response):
        # Calculate request duration
        duration = (request.environ.get("REQUEST_TIME", 0) - request.start_time) * 1000
        
        # Log the request
        status_color = '\033[92m' if response.status_code < 400 else '\033[91m'
        logger.info(
            f"REQ {request.method} {request.path} "
            f"{status_color}{response.status_code}\033[0m {duration}ms"
        )
        return response

    # Register blueprints
    app.register_blueprint(healthz.bp)
    app.register_blueprint(config.bp)
    app.register_blueprint(logs.bp)

    # Log startup information
    logger.info("SERVER STARTUP")
    logger.info(f"Host: 0.0.0.0:{os.getenv('PORT', '8080')}")
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")

    return app
