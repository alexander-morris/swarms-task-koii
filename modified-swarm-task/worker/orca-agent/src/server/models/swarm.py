"""Models for swarm-related data structures."""

from datetime import datetime
from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field, validator
from enum import Enum

class SwarmStatusEnum(str, Enum):
    """Valid status values for swarm jobs."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class AgentConfig(BaseModel):
    """Configuration for a single agent in a swarm."""
    agent_name: str
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    model_name: str
    max_tokens: int = 8192
    temperature: float = 0.7
    role: str = "worker"
    max_loops: int = 1

    @validator('temperature')
    def validate_temperature(cls, v):
        """Validate temperature is between 0 and 1."""
        if not 0 <= v <= 1:
            raise ValueError('Temperature must be between 0 and 1')
        return v

    @validator('max_tokens')
    def validate_max_tokens(cls, v):
        """Validate max_tokens is positive."""
        if v <= 0:
            raise ValueError('max_tokens must be positive')
        return v

class ScheduleConfig(BaseModel):
    """Configuration for scheduling a swarm execution."""
    scheduled_time: datetime
    timezone: str = "UTC"

    @validator('timezone')
    def validate_timezone(cls, v):
        """Validate timezone is a valid IANA timezone."""
        try:
            from zoneinfo import ZoneInfo
            ZoneInfo(v)
            return v
        except Exception:
            raise ValueError('Invalid timezone')

class SwarmSpec(BaseModel):
    """Specification for a swarm execution."""
    name: str
    description: Optional[str] = None
    agents: List[AgentConfig]
    max_loops: int = 1
    swarm_type: str = "default"
    task: str
    schedule: Optional[ScheduleConfig] = None

    @validator('agents')
    def validate_agents(cls, v):
        """Validate at least one agent is specified."""
        if not v:
            raise ValueError('At least one agent must be specified')
        return v

class SwarmJob(BaseModel):
    """A swarm job record."""
    job_id: str
    status: SwarmStatusEnum
    swarm_spec: SwarmSpec
    created_at: datetime
    updated_at: datetime
    metadata: Optional[Dict[str, Any]] = None

class SwarmStatus(BaseModel):
    """Status information for a swarm job."""
    job_id: str
    status: SwarmStatusEnum
    progress: float = Field(ge=0, le=1)
    started_at: datetime
    updated_at: datetime
    error: Optional[str] = None

    @validator('progress')
    def validate_progress(cls, v):
        """Validate progress is between 0 and 1."""
        if not 0 <= v <= 1:
            raise ValueError('Progress must be between 0 and 1')
        return v

class SwarmResult(BaseModel):
    """Result of a completed swarm job."""
    job_id: str
    status: SwarmStatusEnum
    output: Dict[str, Any]
    completed_at: datetime
    metadata: Optional[Dict[str, Any]] = None

    @validator('status')
    def validate_status(cls, v):
        """Validate status is a terminal state."""
        if v not in [SwarmStatusEnum.COMPLETED, SwarmStatusEnum.FAILED]:
            raise ValueError('Result status must be completed or failed')
        return v 