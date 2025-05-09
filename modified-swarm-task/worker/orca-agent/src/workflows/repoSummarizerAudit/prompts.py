"""Prompts for the repository summarization workflow."""

PROMPTS = {
    "system_prompt": (
        "You are an expert software architect and technical lead specializing in summarizing "
        "repositories into comprehensive documentation. You excel at analyzing codebases "
        "and creating clear, structured documentation."
    ),
    "check_readme_file": (
        "Review the README_Prometheus.md in the repository and evaluate its quality and "
        "relevance to the repository.\n\n"
        "Please analyze:\n"
        "1. Is the README_Prometheus.md file related to this specific repository? (Does it describe the actual code "
        "and purpose of this repo?)\n"
        "2. Does it correctly explain the repository's purpose, features, and functionality?\n"
        "3. Is it comprehensive enough to help users understand and use the repository?\n"
        "4. Does it follow best practices for README documentation?\n\n"
        "Use the `review_readme_file` tool to submit your findings.\n"
        # "IMPORTANT: Do not assume that an existing README is correct. "
        "Evaluate README_Prometheus.md against the codebase.\n"
        "DO NOT consider the filename in your analysis, only the content.\n"
        "STOP after submitting the review report."
    ),
}
