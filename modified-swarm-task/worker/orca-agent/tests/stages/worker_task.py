"""Stage for executing worker tasks."""

import requests
from uuid import uuid4
from prometheus_test.utils import create_signature


def prepare(runner, worker):
    """Prepare data for worker task"""
    repo_url = runner.get("repo_url")
    if repo_url is None:
        print("✓ No repo_url found - continuing")
        return None

    # Generate UUID for this round
    uuid = str(uuid4())
    runner.set(f"uuid.{worker.get('name')}", uuid, scope="round")

    # Create podcall payload and signature
    podcall_payload = {
        "taskId": runner.get("task_id"),
        "roundNumber": runner.get("current_round"),
        "uuid": uuid,
    }
    podcall_signature = create_signature(
        worker.get_key("staking_signing"), podcall_payload
    )

    return {
        "task_id": runner.get("task_id"),
        "round_number": str(runner.get("current_round")),
        "repo_url": repo_url,
        "podcall_signature": podcall_signature,
    }


def execute(runner, worker, data):
    """Execute worker task step"""
    if not data:
        return {"success": True, "message": "No repo url found"}
    url = f"{worker.get('url')}/worker-task/{runner.get('current_round')}"
    response = requests.post(url, json=data)
    result = response.json()

    # Handle 409 gracefully - no eligible todos is an expected case
    if response.status_code == 409:
        print(
            f"✓ {result.get('message', 'No eligible todos')} for {worker.get('name')} - continuing"
        )
        return {"success": True, "message": result.get("message")}

    if result.get("success") and "pr_url" in result["result"]["data"]:
        # Store PR URL in state
        runner.set(
            f"pr_urls.{worker.get('name')}",
            result["result"]["data"]["pr_url"],
            scope="round",
        )

    return result
