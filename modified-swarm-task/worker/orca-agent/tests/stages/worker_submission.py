"""Stage for handling worker submissions."""

import requests
from prometheus_test.utils import create_signature


def prepare(runner, worker):
    """Prepare data for worker submission"""
    pr_url = runner.get(f"pr_urls.{worker.get('name')}")
    if pr_url is None:
        print(f"✓ No pr_urls.{worker.get('name')} found - continuing")
        return None

    # Get submission data from worker
    url = f"{worker.get('url')}/submission/{runner.get('current_round')}"
    response = requests.get(url)
    response.raise_for_status()
    submission_data = response.json()

    # Create signature for the submission
    submitter_payload = {
        "taskId": runner.get("task_id"),
        "roundNumber": runner.get("current_round"),
        "stakingKey": worker.get_key("staking_public"),
        "pubKey": worker.get_key("main_public"),
        "action": "audit",
        **submission_data,
    }

    return {
        **submission_data,
        "signature": create_signature(
            worker.get_key("staking_signing"), submitter_payload
        ),
        "stakingKey": worker.get_key("staking_public"),
        "pubKey": worker.get_key("main_public"),
    }


def execute(runner, worker, data):
    """Store worker submission data"""
    # If prepare returned None, skip this step
    if data is None:
        return {"success": True, "message": "Skipped due to missing PR URL"}

    # Store submission data in state
    runner.set(f"submission_data.{worker.get('name')}", data, scope="round")

    # Return success result
    return {"success": True, "data": data}
