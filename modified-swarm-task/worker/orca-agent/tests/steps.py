"""Test step definitions."""

from prometheus_test import TestStep
from functools import partial
from .stages import (
    worker_fetch,
    worker_task,
    worker_pr,
    worker_submission,
    worker_check,
    worker_audit,
    update_audit,
)


steps = [
    TestStep(
        name="worker_fetch",
        description="Fetch worker task",
        prepare=worker_fetch.prepare,
        execute=worker_fetch.execute,
        worker="worker1",
    ),
    TestStep(
        name="worker_task",
        description="Execute worker task",
        prepare=worker_task.prepare,
        execute=worker_task.execute,
        worker="worker1",
    ),
    TestStep(
        name="worker_pr",
        description="Add PR to worker",
        prepare=worker_pr.prepare,
        execute=worker_pr.execute,
        worker="worker1",
    ),
    TestStep(
        name="worker_submission",
        description="Submit worker task",
        prepare=worker_submission.prepare,
        execute=worker_submission.execute,
        worker="worker1",
    ),
    TestStep(
        name="worker_check",
        description="Check worker task",
        prepare=worker_check.prepare,
        execute=worker_check.execute,
        worker="worker1",
    ),
    TestStep(
        name="worker_audit",
        description="Worker2 audits Worker1",
        prepare=partial(worker_audit.prepare, target_name="worker1"),
        execute=worker_audit.execute,
        worker="worker2",
    ),
    TestStep(
        name="update_audit",
        description="Update audit results",
        prepare=partial(update_audit.prepare, role="worker"),
        execute=update_audit.execute,
        worker="worker2",
    ),
]
