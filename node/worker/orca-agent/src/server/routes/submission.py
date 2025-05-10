from flask import Blueprint, jsonify
from prometheus_swarm.database import get_db
from src.database.models import Submission
import logging
import os

logger = logging.getLogger(__name__)

bp = Blueprint("submission", __name__)


@bp.get("/submission/<swarmBountyId>")
def fetch_submission(swarmBountyId):
    logger.info(f"Fetching submission for swarmBountyId: {swarmBountyId}")
    db = get_db()
    submission = (
        db.query(Submission)
        .filter(
            Submission.swarmBountyId == swarmBountyId,
        )
        .first()
    )
    logger.info(f"Submission: {submission}")
    logger.info(f"Submission: {submission}")
    if submission:

        github_username = os.getenv("GITHUB_USERNAME")
        return jsonify(
            {
                "taskId": submission.task_id,
                "swarmBountyId": submission.swarmBountyId,
                "status": submission.status,
                "prUrl": submission.pr_url,
                "githubUsername": github_username,
            }
        )
    else:
        return jsonify({"error": "Submission not found"}), 409
