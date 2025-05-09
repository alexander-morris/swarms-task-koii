"""Tests for middle server schema and endpoints."""

import pytest
import json
from datetime import datetime, timezone
from typing import Dict, Any

# Test data
VALID_SWARM_SPEC = {
    "name": "Test Swarm",
    "description": "Test swarm for validation",
    "agents": [
        {
            "agent_name": "Test Agent",
            "description": "Test agent for validation",
            "system_prompt": "You are a test agent",
            "model_name": "gpt-4o",
            "max_tokens": 8192,
            "temperature": 0.5,
            "role": "worker",
            "max_loops": 1
        }
    ],
    "max_loops": 1,
    "swarm_type": "SequentialWorkflow",
    "task": "Test task",
    "return_history": True
}

INVALID_SWARM_SPEC = {
    "name": "Test Swarm",
    "description": "Test swarm for validation",
    # Missing required 'agents' field
    "max_loops": 1,
    "swarm_type": "InvalidType",
    "task": "Test task"
}

@pytest.fixture
def mock_middle_server():
    """Mock the middle server responses."""
    with pytest.MonkeyPatch.context() as m:
        m.setenv("MIDDLE_SERVER_URL", "http://localhost:3000")
        yield

def test_swarm_spec_validation(mock_middle_server):
    """Test SwarmSpec validation."""
    from src.server.routes.swarm import SwarmSpec, AgentSpec

    # Test valid spec
    swarm = SwarmSpec(**VALID_SWARM_SPEC)
    assert swarm.name == "Test Swarm"
    assert len(swarm.agents) == 1
    assert swarm.agents[0].agent_name == "Test Agent"
    assert swarm.task == "Test task"

    # Test invalid spec
    with pytest.raises(ValueError):
        SwarmSpec(**INVALID_SWARM_SPEC)

def test_swarm_completion_endpoint(mock_middle_server, test_client):
    """Test swarm completion endpoint."""
    response = test_client.post(
        "/swarm/completions",
        json=VALID_SWARM_SPEC,
        headers={"Content-Type": "application/json"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "job_id" in data
    assert "status" in data
    assert data["status"] == "success"

def test_swarm_types_endpoint(test_client):
    """Test swarm types endpoint."""
    response = test_client.get("/swarm/types")
    
    assert response.status_code == 200
    data = response.json()
    assert "types" in data
    assert isinstance(data["types"], list)
    assert "SequentialWorkflow" in data["types"]
    assert "ConcurrentWorkflow" in data["types"]

def test_swarm_schedule_validation(mock_middle_server):
    """Test schedule validation in SwarmSpec."""
    from src.server.routes.swarm import SwarmSpec, ScheduleSpec

    # Test valid schedule
    spec_with_schedule = {
        **VALID_SWARM_SPEC,
        "schedule": {
            "scheduled_time": datetime.now(timezone.utc).isoformat(),
            "timezone": "UTC"
        }
    }
    swarm = SwarmSpec(**spec_with_schedule)
    assert swarm.schedule is not None
    assert swarm.schedule.timezone == "UTC"

    # Test invalid schedule
    invalid_schedule = {
        **VALID_SWARM_SPEC,
        "schedule": {
            "scheduled_time": "invalid-time",
            "timezone": "Invalid/Timezone"
        }
    }
    with pytest.raises(ValueError):
        SwarmSpec(**invalid_schedule)

def test_swarm_error_handling(mock_middle_server, test_client):
    """Test error handling in swarm endpoints."""
    # Test with invalid swarm type
    invalid_spec = {
        **VALID_SWARM_SPEC,
        "swarm_type": "InvalidType"
    }
    response = test_client.post(
        "/swarm/completions",
        json=invalid_spec,
        headers={"Content-Type": "application/json"}
    )
    
    assert response.status_code == 400
    data = response.json()
    assert "error" in data
    assert "Invalid swarm type" in data["error"]

def test_swarm_agent_validation(mock_middle_server):
    """Test agent configuration validation."""
    from src.server.routes.swarm import SwarmSpec, AgentSpec

    # Test valid agent config
    valid_agent = {
        "agent_name": "Test Agent",
        "model_name": "gpt-4o",
        "max_tokens": 8192
    }
    agent = AgentSpec(**valid_agent)
    assert agent.agent_name == "Test Agent"
    assert agent.model_name == "gpt-4o"

    # Test invalid agent config
    invalid_agent = {
        "agent_name": "Test Agent",
        # Missing required model_name
        "max_tokens": 8192
    }
    with pytest.raises(ValueError):
        AgentSpec(**invalid_agent)

def test_swarm_result_retrieval(mock_middle_server, test_client):
    """Test retrieving swarm execution results."""
    # First create a swarm task
    response = test_client.post(
        "/swarm/completions",
        json=VALID_SWARM_SPEC,
        headers={"Content-Type": "application/json"}
    )
    
    assert response.status_code == 200
    data = response.json()
    job_id = data["job_id"]

    # Then retrieve the result
    response = test_client.get(f"/swarm/result/{job_id}")
    assert response.status_code == 200
    result_data = response.json()
    assert "status" in result_data
    assert "output" in result_data

def test_swarm_status_tracking(mock_middle_server, test_client):
    """Test tracking swarm execution status."""
    # First create a swarm task
    response = test_client.post(
        "/swarm/completions",
        json=VALID_SWARM_SPEC,
        headers={"Content-Type": "application/json"}
    )
    
    assert response.status_code == 200
    data = response.json()
    job_id = data["job_id"]

    # Check status
    response = test_client.get(f"/swarm/status/{job_id}")
    assert response.status_code == 200
    status_data = response.json()
    assert "status" in status_data
    assert "progress" in status_data
    assert "started_at" in status_data 