"""Stage for executing worker tasks."""

import requests
from prometheus_test.utils import create_signature


def prepare(runner, worker):
    """Prepare data for worker task"""
    # Create fetch-todo payload for stakingSignature and publicSignature
    payload = {
        "taskId": runner.get("task_id"),
        "roundNumber": runner.get("current_round"),
        "action": "fetch-todo",
        "githubUsername": worker.get_env("GITHUB_USERNAME"),
        "stakingKey": worker.get_key("staking_public"),
        "pubKey": worker.get_key("main_public"),
    }

    return {
        "taskId": runner.get("task_id"),
        "roundNumber": runner.get("current_round"),
        "stakingKey": worker.get_key("staking_public"),
        "pubKey": worker.get_key("main_public"),
        "stakingSignature": create_signature(
            worker.get_key("staking_signing"), payload
        ),
        "publicSignature": create_signature(worker.get_key("main_signing"), payload),
    }


def execute(runner, worker, data):
    """Execute worker task step"""
    url = f"{runner.get('middle_server_url')}/summarizer/worker/fetch-todo"
    response = requests.post(
        url,
        json={"signature": data["stakingSignature"], "stakingKey": data["stakingKey"]},
    )
    result = response.json()

    # Handle 409 gracefully - no eligible todos is an expected case
    if response.status_code == 409:
        print(
            f"✓ {result.get('message', 'No eligible todos')} for {worker.get('name')} - continuing"
        )
        return {"success": True, "message": result.get("message")}
    else:
        response.raise_for_status()

    if result.get("success"):
        repo_url = f"https://github.com/{result['data']['repo_owner']}/{result['data']['repo_name']}"
        runner.set("repo_url", repo_url, scope="round")

    return result
