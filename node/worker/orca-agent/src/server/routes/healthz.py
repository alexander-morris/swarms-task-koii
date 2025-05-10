"""Health check routes for the agent."""

from flask import Blueprint, jsonify
import os
import logging

logger = logging.getLogger(__name__)
bp = Blueprint('healthz', __name__, url_prefix='/healthz')

@bp.route('/', methods=['GET'])
def health_check():
    """Basic health check endpoint."""
    try:
        return jsonify({
            'status': 'success',
            'message': 'Service is healthy',
            'version': os.getenv('VERSION', 'unknown')
        })
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Service is unhealthy'
        }), 500
