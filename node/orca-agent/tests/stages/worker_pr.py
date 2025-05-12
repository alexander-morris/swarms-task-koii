import requests
from prometheus_test.utils import create_signature


def prepare(runner, worker):
    pr_url = runner.get(f"pr_urls.{worker.get('name')}")
    if pr_url is None:
        print(f"✓ No pr_urls.{worker.get('name')} found - continuing")
        return None

    payload = {
        "taskId": runner.get("task_id"),
        "action": "add-todo-pr",
        "roundNumber": runner.get("current_round"),
        "prUrl": pr_url,
        "stakingKey": worker.get_key("staking_public"),
        "pubKey": worker.get_key("main_public"),
    }
    return {
        "signature": create_signature(worker.get_key("staking_signing"), payload),
        "stakingKey": worker.get_key("staking_public"),
    }


def execute(runner, worker, data):
    """Add worker PR URL to middle server"""

    if data is None:
        return {"success": True, "message": "Skipped due to missing PR URL"}

    url = f"{runner.get('middle_server_url')}/summarizer/worker/add-todo-pr"
    response = requests.post(
        url,
        json={"signature": data["signature"], "stakingKey": data["stakingKey"]},
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

    return result
