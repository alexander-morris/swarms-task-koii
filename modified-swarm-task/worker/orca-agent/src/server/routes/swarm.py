from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import requests
from loguru import logger

router = APIRouter(prefix="/swarm", tags=["swarm"])

class AgentSpec(BaseModel):
    agent_name: str = Field(..., description="Name of the agent")
    description: Optional[str] = Field(None, description="Agent's purpose description")
    system_prompt: Optional[str] = Field(None, description="System prompt for the agent")
    model_name: str = Field(..., description="AI model to use (e.g., 'gpt-4o', 'claude-3-opus')")
    auto_generate_prompt: Optional[bool] = Field(False, description="Generate prompts automatically")
    max_tokens: Optional[int] = Field(8192, description="Maximum tokens for responses")
    temperature: Optional[float] = Field(0.5, description="Response randomness")
    role: Optional[str] = Field("worker", description="Agent's role")
    max_loops: Optional[int] = Field(1, description="Maximum loops for this agent")

class ScheduleSpec(BaseModel):
    scheduled_time: str = Field(..., description="When to execute the task (in UTC)")
    timezone: Optional[str] = Field("UTC", description="Timezone for scheduling")

class SwarmSpec(BaseModel):
    name: Optional[str] = Field(None, description="Name of the swarm")
    description: Optional[str] = Field(None, description="Description of the swarm's purpose")
    agents: List[AgentSpec] = Field(..., description="Array of agent configurations")
    max_loops: Optional[int] = Field(1, description="Maximum iteration loops")
    swarm_type: Optional[str] = Field(None, description="Type of workflow")
    rearrange_flow: Optional[str] = Field(None, description="Instructions to rearrange workflow")
    task: str = Field(..., description="The task to be performed")
    img: Optional[str] = Field(None, description="Optional image URL")
    return_history: Optional[bool] = Field(True, description="Include conversation history")
    rules: Optional[str] = Field(None, description="Guidelines for agent behavior")
    schedule: Optional[ScheduleSpec] = Field(None, description="Scheduling details")

@router.post("/completions")
async def run_swarm(swarm: SwarmSpec):
    """
    Run a swarm with the specified task.
    """
    try:
        # Forward the swarm request to the middle server
        middle_server_url = os.getenv('MIDDLE_SERVER_URL')
        if not middle_server_url:
            raise HTTPException(status_code=500, detail="Middle server URL not configured")

        response = requests.post(
            f"{middle_server_url}/summarizer/worker/swarm-completion",
            json=swarm.model_dump(),
            headers={'Content-Type': 'application/json'}
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Middle server error: {response.text}"
            )

        return response.json()

    except Exception as e:
        logger.error(f"Error running swarm: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to run swarm: {str(e)}"
        )

@router.get("/types")
async def get_swarm_types():
    """
    Get the list of supported swarm types.
    """
    return {
        "types": [
            "AgentRearrange",
            "MixtureOfAgents",
            "SpreadSheetSwarm",
            "SequentialWorkflow",
            "ConcurrentWorkflow",
            "GroupChat",
            "MultiAgentRouter",
            "AutoSwarmBuilder",
            "HiearchicalSwarm",
            "auto",
            "MajorityVoting"
        ]
    } 