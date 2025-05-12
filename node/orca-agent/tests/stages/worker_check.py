"""Stage for executing worker tasks."""

import requests


def prepare(runner, worker):
    """Prepare data for worker task"""
    pr_url = runner.get(f"pr_urls.{worker.get('name')}")
    if pr_url is None:
        print(f"✓ No pr_urls.{worker.get('name')} found - continuing")
        return None

    return {
        "stakingKey": worker.get_key("staking_public"),
        "roundNumber": runner.get("current_round"),
        "githubUsername": worker.get_env("GITHUB_USERNAME"),
        "prUrl": pr_url,
    }


def execute(runner, worker, data):
    """Execute worker task step"""
    if not data:
        return {"success": True, "message": "No PR URL found"}
    url = f"{runner.get('middle_server_url')}/summarizer/worker/check-todo"
    response = requests.post(
        url,
        json=data,
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
