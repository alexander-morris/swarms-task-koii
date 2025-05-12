import os
import requests
from flask import Blueprint, jsonify, request
from src.server.services import repo_summary_service
from concurrent.futures import ThreadPoolExecutor
from prometheus_swarm.database import get_db
from src.server.services.repo_summary_service import logger

bp = Blueprint("task", __name__)
executor = ThreadPoolExecutor(max_workers=2)

# Track in-progress tasks
in_progress_tasks = set()


def post_pr_url(agent_result, task_id, signature, swarmBountyId):
    try:
        result = agent_result.result()  # Get the result from the future
        logger.info(f"Result: {result}")
        result_data = result.get("result", {})
        logger.info(f"Result data: {result_data}")
        # Make a POST request with the result
        response = requests.post(
            f"http://host.docker.internal:30017/task/{task_id}/add-todo-pr",
            json={
                "prUrl": result_data.get("data", {}).get("pr_url"),
                "signature": signature,
                "swarmBountyId": swarmBountyId,
                "success": result.get("success", False),
                "message": result_data.get("error", ""),
            },
        )
        response.raise_for_status()  # Raise an error for bad responses
    except Exception as e:
        # Handle exceptions (e.g., log the error)
        logger.error(f"Failed to send result: {e}")
        logger.error(f"Exception type: {type(e)}")
        if hasattr(e, "__traceback__"):
            import traceback

            logger.error(f"Traceback: {''.join(traceback.format_tb(e.__traceback__))}")


@bp.post("/worker-task")
def start_task():
    logger = repo_summary_service.logger
    # logger.info(f"Task started for bounty: {swarmBountyId}")

    data = request.get_json()
    task_id = data["task_id"]
    podcall_signature = data["podcall_signature"]
    repo_url = data["repo_url"]
    swarmBountyId = data["swarmBountyId"]
    logger.info(f"Task data: {data}")
    required_fields = ["task_id", "swarmBountyId", "repo_url", "podcall_signature"]
    if any(data.get(field) is None for field in required_fields):
        return jsonify({"error": "Missing data"}), 401

    # Check if this swarm bounty is already being processed
    if swarmBountyId in in_progress_tasks:
        return jsonify({"status": "Task is already being processed"}), 200

    # Get db instance in the main thread where we have app context
    db = get_db()

    if os.getenv("TEST_MODE") == "true":
        result = repo_summary_service.handle_task_creation(
            task_id=task_id,
            swarmBountyId=swarmBountyId,
            repo_url=repo_url,
            db=db,  # Pass db instance
        )
        return jsonify(result)
    else:
        # Mark this swarm bounty as in progress
        in_progress_tasks.add(swarmBountyId)
        
        def cleanup_callback(future):
            # Remove from in-progress tasks when done
            in_progress_tasks.discard(swarmBountyId)
            # Call the original callback
            post_pr_url(future, task_id, podcall_signature, swarmBountyId)

        agent_result = executor.submit(
            repo_summary_service.handle_task_creation,
            task_id=task_id,
            swarmBountyId=swarmBountyId,
            repo_url=repo_url,
            db=db,  # Pass db instance
        )
        agent_result.add_done_callback(cleanup_callback)
        return jsonify({"status": "Task is being processed"}), 200


if __name__ == "__main__":
    from flask import Flask

    # Create a Flask app instance
    app = Flask(__name__)
    app.register_blueprint(bp)

    # Test data
    test_data = {
        "taskId": "fake",
        "swarmBountyId": "1",
        "repo_url": "https://github.com/koii-network/docs",
    }

    # Set up test context
    with app.test_client() as client:
        # Make a POST request to the endpoint
        response = client.post("/worker-task", json=test_data)

        # Print the response
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.get_json()}")
