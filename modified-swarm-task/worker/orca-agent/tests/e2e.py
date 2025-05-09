"""End-to-end test for the summarizer task."""

from pathlib import Path
from prometheus_test import TestRunner
import dotenv
import argparse


dotenv.load_dotenv()


def parse_args():
    parser = argparse.ArgumentParser(description="Run summarizer test sequence")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Force reset of all databases before running tests",
    )
    return parser.parse_args()


# Global reference to the test runner
runner = None


def main():
    global runner
    args = parse_args()

    # Import steps here to avoid circular imports
    from .steps import steps

    # Create test runner with config from YAML
    base_dir = Path(__file__).parent
    runner = TestRunner(
        steps=steps,
        config_file=base_dir / "config.yaml",
    )

    # Run test sequence
    runner.run(force_reset=args.reset)


if __name__ == "__main__":
    main()
