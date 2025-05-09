"""Tests for database operations."""

import pytest
from datetime import datetime, timezone
from typing import Dict, Any
from src.server.models.swarm import (
    SwarmJob,
    SwarmStatus,
    SwarmResult,
    AgentConfig,
    ScheduleConfig,
    SwarmSpec,
    SwarmStatusEnum
)
from src.server.db.operations import (
    create_swarm_job,
    get_swarm_job,
    update_swarm_status,
    get_swarm_status,
    save_swarm_result,
    get_swarm_result,
    list_swarm_jobs
)

@pytest.fixture
def sample_swarm_job(mock_db) -> Dict[str, Any]:
    """Create a sample swarm job for testing."""
    agent = AgentConfig(
        agent_name="Test Agent",
        model_name="gpt-4o",
        max_tokens=8192
    )
    
    schedule = ScheduleConfig(
        scheduled_time=datetime.now(timezone.utc),
        timezone="UTC"
    )
    
    swarm_spec = SwarmSpec(
        name="Test Swarm",
        description="Test swarm",
        agents=[agent],
        task="Test task",
        schedule=schedule
    )
    
    return {
        "job_id": "test-job-123",
        "status": SwarmStatusEnum.PENDING,
        "swarm_spec": swarm_spec.dict(),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

async def test_create_and_get_swarm_job(mock_db, sample_swarm_job):
    """Test creating and retrieving a swarm job."""
    # Create job
    job = await create_swarm_job(mock_db, sample_swarm_job)
    assert job.job_id == sample_swarm_job["job_id"]
    assert job.status == sample_swarm_job["status"]
    
    # Get job
    retrieved_job = await get_swarm_job(mock_db, sample_swarm_job["job_id"])
    assert retrieved_job.job_id == job.job_id
    assert retrieved_job.status == job.status
    assert retrieved_job.swarm_spec["name"] == job.swarm_spec["name"]

async def test_update_and_get_swarm_status(mock_db, sample_swarm_job):
    """Test updating and retrieving swarm status."""
    # Create initial job
    await create_swarm_job(mock_db, sample_swarm_job)
    
    # Update status
    status_update = {
        "job_id": sample_swarm_job["job_id"],
        "status": SwarmStatusEnum.IN_PROGRESS,
        "progress": 0.5,
        "started_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    status = await update_swarm_status(mock_db, status_update)
    assert status.job_id == sample_swarm_job["job_id"]
    assert status.status == SwarmStatusEnum.IN_PROGRESS
    assert status.progress == 0.5
    
    # Get status
    retrieved_status = await get_swarm_status(mock_db, sample_swarm_job["job_id"])
    assert retrieved_status.job_id == status.job_id
    assert retrieved_status.status == status.status
    assert retrieved_status.progress == status.progress

async def test_save_and_get_swarm_result(mock_db, sample_swarm_job):
    """Test saving and retrieving swarm results."""
    # Create initial job
    await create_swarm_job(mock_db, sample_swarm_job)
    
    # Save result
    result_data = {
        "job_id": sample_swarm_job["job_id"],
        "status": SwarmStatusEnum.COMPLETED,
        "output": {
            "result": "Test result",
            "metadata": {
                "execution_time": 1.5,
                "tokens_used": 100
            }
        },
        "completed_at": datetime.now(timezone.utc)
    }
    
    result = await save_swarm_result(mock_db, result_data)
    assert result.job_id == sample_swarm_job["job_id"]
    assert result.status == SwarmStatusEnum.COMPLETED
    assert result.output["result"] == "Test result"
    
    # Get result
    retrieved_result = await get_swarm_result(mock_db, sample_swarm_job["job_id"])
    assert retrieved_result.job_id == result.job_id
    assert retrieved_result.status == result.status
    assert retrieved_result.output["result"] == result.output["result"]

async def test_list_swarm_jobs(mock_db, sample_swarm_job):
    """Test listing swarm jobs with various filters."""
    # Create multiple jobs
    jobs = []
    for i in range(3):
        job_data = sample_swarm_job.copy()
        job_data["job_id"] = f"test-job-{i}"
        job = await create_swarm_job(mock_db, job_data)
        jobs.append(job)
    
    # List all jobs
    all_jobs = await list_swarm_jobs(mock_db)
    assert len(all_jobs) == 3
    
    # List jobs by status
    pending_jobs = await list_swarm_jobs(mock_db, status=SwarmStatusEnum.PENDING)
    assert len(pending_jobs) == 3
    
    # Update one job status
    status_update = {
        "job_id": jobs[0].job_id,
        "status": SwarmStatusEnum.COMPLETED,
        "progress": 1.0,
        "started_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    await update_swarm_status(mock_db, status_update)
    
    # List completed jobs
    completed_jobs = await list_swarm_jobs(mock_db, status=SwarmStatusEnum.COMPLETED)
    assert len(completed_jobs) == 1
    assert completed_jobs[0].job_id == jobs[0].job_id

async def test_error_handling(mock_db, sample_swarm_job):
    """Test error handling in database operations."""
    # Test getting non-existent job
    with pytest.raises(ValueError):
        await get_swarm_job(mock_db, "non-existent-job")
    
    # Test getting status for non-existent job
    with pytest.raises(ValueError):
        await get_swarm_status(mock_db, "non-existent-job")
    
    # Test getting result for non-existent job
    with pytest.raises(ValueError):
        await get_swarm_result(mock_db, "non-existent-job")
    
    # Test updating status for non-existent job
    status_update = {
        "job_id": "non-existent-job",
        "status": SwarmStatusEnum.IN_PROGRESS,
        "progress": 0.5,
        "started_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    with pytest.raises(ValueError):
        await update_swarm_status(mock_db, status_update)
    
    # Test saving result for non-existent job
    result_data = {
        "job_id": "non-existent-job",
        "status": SwarmStatusEnum.COMPLETED,
        "output": {"result": "Test"},
        "completed_at": datetime.now(timezone.utc)
    }
    with pytest.raises(ValueError):
        await save_swarm_result(mock_db, result_data) 