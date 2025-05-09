"""Acceptance tests for log forwarding functionality."""

import pytest
import requests
import json
import os
from unittest.mock import patch, MagicMock

# Test configuration
TEST_MIDDLE_SERVER_URL = "http://localhost:3000"
TEST_TASK_ID = "test-task-123"
TEST_ROUND_NUMBER = 1

@pytest.fixture
def mock_middle_server():
    """Mock the middle server responses."""
    with patch('requests.post') as mock_post:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"status": "success"}
        mock_post.return_value = mock_response
        yield mock_post

@pytest.fixture
def test_client():
    """Create a test client for the Flask app."""
    from src.server import create_app
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_log_forwarding_success(test_client, mock_middle_server):
    """Test successful log forwarding to middle server."""
    # Set up test environment
    os.environ['MIDDLE_SERVER_URL'] = TEST_MIDDLE_SERVER_URL
    os.environ['TASK_ID'] = TEST_TASK_ID
    
    # Create test log data
    log_data = {
        "level": "INFO",
        "message": "Test log message",
        "timestamp": "2024-03-14T12:00:00Z",
        "round_number": TEST_ROUND_NUMBER
    }
    
    # Send log to the API
    response = test_client.post(
        '/logs/',
        data=json.dumps(log_data),
        content_type='application/json'
    )
    
    # Verify response
    assert response.status_code == 200
    assert response.json['status'] == 'success'
    
    # Verify middle server was called correctly
    mock_middle_server.assert_called_once()
    call_args = mock_middle_server.call_args
    assert call_args[0][0] == f"{TEST_MIDDLE_SERVER_URL}/logs"
    assert call_args[1]['json'] == {
        **log_data,
        "task_id": TEST_TASK_ID
    }

def test_log_forwarding_middle_server_error(test_client, mock_middle_server):
    """Test handling of middle server errors."""
    # Set up test environment
    os.environ['MIDDLE_SERVER_URL'] = TEST_MIDDLE_SERVER_URL
    os.environ['TASK_ID'] = TEST_TASK_ID
    
    # Configure mock to simulate error
    mock_middle_server.return_value.status_code = 500
    mock_middle_server.return_value.json.return_value = {
        "status": "error",
        "message": "Internal server error"
    }
    
    # Create test log data
    log_data = {
        "level": "ERROR",
        "message": "Test error message",
        "timestamp": "2024-03-14T12:00:00Z",
        "round_number": TEST_ROUND_NUMBER
    }
    
    # Send log to the API
    response = test_client.post(
        '/logs/',
        data=json.dumps(log_data),
        content_type='application/json'
    )
    
    # Verify response indicates error
    assert response.status_code == 500
    assert response.json['status'] == 'error'
    assert 'Failed to forward log' in response.json['message']

def test_log_forwarding_invalid_data(test_client):
    """Test handling of invalid log data."""
    # Create invalid log data
    invalid_data = {
        "level": "INVALID_LEVEL",
        "message": 123,  # Should be string
        "timestamp": "invalid-timestamp"
    }
    
    # Send invalid log to the API
    response = test_client.post(
        '/logs/',
        data=json.dumps(invalid_data),
        content_type='application/json'
    )
    
    # Verify response indicates validation error
    assert response.status_code == 400
    assert response.json['status'] == 'error'
    assert 'Invalid log data' in response.json['message']

def test_log_forwarding_missing_environment(test_client):
    """Test handling of missing environment variables."""
    # Remove required environment variables
    if 'MIDDLE_SERVER_URL' in os.environ:
        del os.environ['MIDDLE_SERVER_URL']
    if 'TASK_ID' in os.environ:
        del os.environ['TASK_ID']
    
    # Create test log data
    log_data = {
        "level": "INFO",
        "message": "Test log message",
        "timestamp": "2024-03-14T12:00:00Z",
        "round_number": TEST_ROUND_NUMBER
    }
    
    # Send log to the API
    response = test_client.post(
        '/logs/',
        data=json.dumps(log_data),
        content_type='application/json'
    )
    
    # Verify response indicates configuration error
    assert response.status_code == 500
    assert response.json['status'] == 'error'
    assert 'Missing required configuration' in response.json['message']

def test_log_forwarding_batch(test_client, mock_middle_server):
    """Test batch log forwarding."""
    # Set up test environment
    os.environ['MIDDLE_SERVER_URL'] = TEST_MIDDLE_SERVER_URL
    os.environ['TASK_ID'] = TEST_TASK_ID
    
    # Create batch of test logs
    batch_data = {
        "logs": [
            {
                "level": "INFO",
                "message": "Test log 1",
                "timestamp": "2024-03-14T12:00:00Z",
                "round_number": TEST_ROUND_NUMBER
            },
            {
                "level": "WARNING",
                "message": "Test log 2",
                "timestamp": "2024-03-14T12:00:01Z",
                "round_number": TEST_ROUND_NUMBER
            }
        ]
    }
    
    # Send batch to the API
    response = test_client.post(
        '/logs/batch',
        data=json.dumps(batch_data),
        content_type='application/json'
    )
    
    # Verify response
    assert response.status_code == 200
    assert response.json['status'] == 'success'
    
    # Verify middle server was called for each log
    assert mock_middle_server.call_count == 2 