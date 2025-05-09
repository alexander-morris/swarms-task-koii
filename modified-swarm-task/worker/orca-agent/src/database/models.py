"""Database models."""

from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import JSON
from sqlalchemy import Column


class Submission(SQLModel, table=True):
    """Task submission model."""

    task_id: str
    swarmBountyId: str = Field(primary_key=True)
    status: str = "pending"
    pr_url: Optional[str] = None
    username: Optional[str] = None
    repo_urls: Optional[dict] = Field(
        default=None, sa_column=Column(JSON)
    )  # Store as JSON type
    repo_url: Optional[str] = None
