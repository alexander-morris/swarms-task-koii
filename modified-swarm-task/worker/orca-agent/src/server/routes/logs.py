"""Log forwarding routes for the agent."""

from flask import Blueprint, jsonify, request
import os
import logging
import requests
from datetime import datetime
import json

logger = logging.getLogger(__name__)
bp = Blueprint('logs', __name__, url_prefix='/logs')

def validate_log_data(data):
    """Validate log data structure."""
    required_fields = ['level', 'message', 'timestamp', 'round_number']
    if not all(field in data for field in required_fields):
        return False, "Missing required fields"
    
    if not isinstance(data['message'], str):
        return False, "Message must be a string"
    
    valid_levels = ['INFO', 'WARNING', 'ERROR', 'DEBUG']
    if data['level'] not in valid_levels:
        return False, f"Invalid log level. Must be one of {valid_levels}"
    
    try:
        datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
    except ValueError:
        return False, "Invalid timestamp format"
    
    if not isinstance(data['round_number'], int):
        return False, "Round number must be an integer"
    
    return True, None

def forward_log_to_middle_server(log_data):
    """Forward log to middle server."""
    middle_server_url = os.getenv('MIDDLE_SERVER_URL')
    task_id = os.getenv('TASK_ID')
    
    if not middle_server_url or not task_id:
        raise ValueError("Missing required configuration: MIDDLE_SERVER_URL or TASK_ID")
    
    # Add task_id to log data
    log_data['task_id'] = task_id
    
    # Forward to middle server
    response = requests.post(
        f"{middle_server_url}/logs",
        json=log_data,
        headers={'Content-Type': 'application/json'}
    )
    
    if response.status_code != 200:
        raise Exception(f"Middle server returned error: {response.text}")
    
    return response.json()

@bp.route('', methods=['POST'])
@bp.route('/', methods=['POST'])
def forward_log():
    """Forward a single log to the middle server."""
    try:
        log_data = request.get_json()
        
        # Validate log data
        is_valid, error_message = validate_log_data(log_data)
        if not is_valid:
            return jsonify({
                'status': 'error',
                'message': f'Invalid log data: {error_message}'
            }), 400
        
        # Forward log
        result = forward_log_to_middle_server(log_data)
        
        return jsonify({
            'status': 'success',
            'data': result
        })
        
    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    except Exception as e:
        logger.error(f"Error forwarding log: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to forward log: {str(e)}'
        }), 500

@bp.route('/batch', methods=['POST'])
def forward_log_batch():
    """Forward multiple logs to the middle server."""
    try:
        batch_data = request.get_json()
        
        if 'logs' not in batch_data or not isinstance(batch_data['logs'], list):
            return jsonify({
                'status': 'error',
                'message': 'Invalid batch data: missing or invalid logs array'
            }), 400
        
        # Validate each log in the batch
        for log_data in batch_data['logs']:
            is_valid, error_message = validate_log_data(log_data)
            if not is_valid:
                return jsonify({
                    'status': 'error',
                    'message': f'Invalid log data in batch: {error_message}'
                }), 400
        
        # Forward each log
        results = []
        for log_data in batch_data['logs']:
            try:
                result = forward_log_to_middle_server(log_data)
                results.append(result)
            except Exception as e:
                logger.error(f"Error forwarding log in batch: {str(e)}")
                results.append({
                    'status': 'error',
                    'message': str(e)
                })
        
        return jsonify({
            'status': 'success',
            'data': results
        })
        
    except Exception as e:
        logger.error(f"Error forwarding log batch: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to forward log batch: {str(e)}'
        }), 500 