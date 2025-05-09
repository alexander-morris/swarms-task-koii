"""Test configuration and fixtures."""

import pytest
from fastapi.testclient import TestClient
from src.api.api import app
import os
from datetime import datetime, timezone
import mongomock
import pytest_asyncio

@pytest.fixture
def test_client():
    """Create a test client for the FastAPI application."""
    return TestClient(app)

@pytest.fixture
def mock_db():
    """Create a mock MongoDB database."""
    return mongomock.MongoClient().db

@pytest.fixture
def mock_env():
    """Set up mock environment variables."""
    env_vars = {
        "MIDDLE_SERVER_URL": "http://localhost:3000",
        "TASK_ID": "test-task-123",
        "MONGODB_URI": "mongodb://localhost:27017/test",
        "API_KEY": "test-api-key"
    }
    for key, value in env_vars.items():
        os.environ[key] = value
    yield
    for key in env_vars:
        os.environ.pop(key, None)

@pytest.fixture
def mock_swarm_job():
    """Create a mock swarm job."""
    return {
        "job_id": "test-job-123",
        "status": "pending",
        "swarm_spec": {
            "name": "Test Swarm",
            "description": "Test swarm for validation",
            "agents": [
                {
                    "agent_name": "Test Agent",
                    "model_name": "gpt-4o",
                    "max_tokens": 8192
                }
            ],
            "task": "Test task"
        },
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

@pytest_asyncio.fixture
async def mock_swarm_execution():
    """Create a mock swarm execution result."""
    return {
        "job_id": "test-job-123",
        "status": "completed",
        "output": {
            "result": "Test result",
            "metadata": {
                "execution_time": 1.5,
                "tokens_used": 100
            }
        },
        "completed_at": datetime.now(timezone.utc).isoformat()
    }

@pytest.fixture
def mock_swarm_status():
    """Create a mock swarm status."""
    return {
        "job_id": "test-job-123",
        "status": "in_progress",
        "progress": 0.5,
        "started_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    } 