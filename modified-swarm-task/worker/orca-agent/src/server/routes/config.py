"""Configuration routes for the agent."""

from flask import Blueprint, jsonify, request
import os
import logging

logger = logging.getLogger(__name__)
bp = Blueprint('config', __name__, url_prefix='/config')

@bp.route('/env', methods=['GET'])
def get_env():
    """Get environment variables."""
    try:
        # Get all environment variables
        env_vars = {k: v for k, v in os.environ.items()}
        
        # Remove sensitive information
        sensitive_keys = ['API_KEY', 'SECRET', 'PASSWORD', 'TOKEN']
        for key in sensitive_keys:
            if key in env_vars:
                env_vars[key] = '********'
        
        return jsonify({
            'status': 'success',
            'data': env_vars
        })
    except Exception as e:
        logger.error(f"Error getting environment variables: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to get environment variables'
        }), 500

@bp.route('/container', methods=['GET'])
def get_container_info():
    """Get container information."""
    try:
        container_info = {
            'hostname': os.uname().nodename,
            'platform': os.uname().sysname,
            'architecture': os.uname().machine,
            'python_version': os.sys.version,
            'memory_limit': os.getenv('MEMORY_LIMIT', 'Not set'),
            'cpu_limit': os.getenv('CPU_LIMIT', 'Not set')
        }
        
        return jsonify({
            'status': 'success',
            'data': container_info
        })
    except Exception as e:
        logger.error(f"Error getting container information: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to get container information'
        }), 500

@bp.route('/health', methods=['GET'])
def get_health():
    """Get health status of the container."""
    try:
        health_info = {
            'status': 'healthy',
            'timestamp': os.time(),
            'memory_usage': os.getenv('MEMORY_USAGE', 'Not available'),
            'cpu_usage': os.getenv('CPU_USAGE', 'Not available')
        }
        
        return jsonify({
            'status': 'success',
            'data': health_info
        })
    except Exception as e:
        logger.error(f"Error getting health status: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to get health status'
        }), 500 