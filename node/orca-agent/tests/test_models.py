"""Tests for database models and schemas."""

import pytest
from datetime import datetime, timezone
from typing import Dict, Any
from src.server.models.swarm import (
    SwarmJob,
    SwarmStatus,
    SwarmResult,
    AgentConfig,
    ScheduleConfig
)

def test_swarm_job_model():
    """Test SwarmJob model creation and validation."""
    # Create a valid swarm job
    job_data = {
        "job_id": "test-job-123",
        "status": "pending",
        "swarm_spec": {
            "name": "Test Swarm",
            "description": "Test swarm",
            "agents": [
                {
                    "agent_name": "Test Agent",
                    "model_name": "gpt-4o",
                    "max_tokens": 8192
                }
            ],
            "task": "Test task"
        },
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    job = SwarmJob(**job_data)
    assert job.job_id == "test-job-123"
    assert job.status == "pending"
    assert len(job.swarm_spec["agents"]) == 1
    assert job.swarm_spec["agents"][0]["agent_name"] == "Test Agent"

    # Test invalid job data
    invalid_job = {
        "job_id": "test-job-123",
        "status": "invalid_status",  # Invalid status
        "swarm_spec": {
            "name": "Test Swarm",
            "task": "Test task"
            # Missing required agents
        }
    }
    
    with pytest.raises(ValueError):
        SwarmJob(**invalid_job)

def test_swarm_status_model():
    """Test SwarmStatus model creation and validation."""
    # Create a valid status
    status_data = {
        "job_id": "test-job-123",
        "status": "in_progress",
        "progress": 0.5,
        "started_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    status = SwarmStatus(**status_data)
    assert status.job_id == "test-job-123"
    assert status.status == "in_progress"
    assert status.progress == 0.5

    # Test invalid status data
    invalid_status = {
        "job_id": "test-job-123",
        "status": "invalid_status",  # Invalid status
        "progress": 1.5  # Invalid progress > 1
    }
    
    with pytest.raises(ValueError):
        SwarmStatus(**invalid_status)

def test_swarm_result_model():
    """Test SwarmResult model creation and validation."""
    # Create a valid result
    result_data = {
        "job_id": "test-job-123",
        "status": "completed",
        "output": {
            "result": "Test result",
            "metadata": {
                "execution_time": 1.5,
                "tokens_used": 100
            }
        },
        "completed_at": datetime.now(timezone.utc)
    }
    
    result = SwarmResult(**result_data)
    assert result.job_id == "test-job-123"
    assert result.status == "completed"
    assert result.output["result"] == "Test result"
    assert result.output["metadata"]["execution_time"] == 1.5

    # Test invalid result data
    invalid_result = {
        "job_id": "test-job-123",
        "status": "invalid_status",  # Invalid status
        "output": None  # Missing required output
    }
    
    with pytest.raises(ValueError):
        SwarmResult(**invalid_result)

def test_agent_config_model():
    """Test AgentConfig model creation and validation."""
    # Create a valid agent config
    agent_data = {
        "agent_name": "Test Agent",
        "description": "Test agent",
        "system_prompt": "You are a test agent",
        "model_name": "gpt-4o",
        "max_tokens": 8192,
        "temperature": 0.5,
        "role": "worker",
        "max_loops": 1
    }
    
    agent = AgentConfig(**agent_data)
    assert agent.agent_name == "Test Agent"
    assert agent.model_name == "gpt-4o"
    assert agent.max_tokens == 8192

    # Test invalid agent config
    invalid_agent = {
        "agent_name": "Test Agent",
        # Missing required model_name
        "max_tokens": 8192
    }
    
    with pytest.raises(ValueError):
        AgentConfig(**invalid_agent)

def test_schedule_config_model():
    """Test ScheduleConfig model creation and validation."""
    # Create a valid schedule config
    schedule_data = {
        "scheduled_time": datetime.now(timezone.utc),
        "timezone": "UTC"
    }
    
    schedule = ScheduleConfig(**schedule_data)
    assert schedule.timezone == "UTC"

    # Test invalid schedule config
    invalid_schedule = {
        "scheduled_time": "invalid-time",  # Invalid time format
        "timezone": "Invalid/Timezone"  # Invalid timezone
    }
    
    with pytest.raises(ValueError):
        ScheduleConfig(**invalid_schedule)

def test_model_relationships():
    """Test relationships between models."""
    # Create a complete swarm job with all related models
    agent = AgentConfig(
        agent_name="Test Agent",
        model_name="gpt-4o",
        max_tokens=8192
    )
    
    schedule = ScheduleConfig(
        scheduled_time=datetime.now(timezone.utc),
        timezone="UTC"
    )
    
    swarm_spec = {
        "name": "Test Swarm",
        "description": "Test swarm",
        "agents": [agent.dict()],
        "task": "Test task",
        "schedule": schedule.dict()
    }
    
    job = SwarmJob(
        job_id="test-job-123",
        status="pending",
        swarm_spec=swarm_spec,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    status = SwarmStatus(
        job_id=job.job_id,
        status="in_progress",
        progress=0.5,
        started_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    result = SwarmResult(
        job_id=job.job_id,
        status="completed",
        output={
            "result": "Test result",
            "metadata": {
                "execution_time": 1.5,
                "tokens_used": 100
            }
        },
        completed_at=datetime.now(timezone.utc)
    )
    
    # Verify relationships
    assert status.job_id == job.job_id
    assert result.job_id == job.job_id
    assert job.swarm_spec["agents"][0]["agent_name"] == agent.agent_name
    assert job.swarm_spec["schedule"]["timezone"] == schedule.timezone 