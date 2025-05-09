"""Main entry point for the orca agent."""

import uvicorn
from src.api.api import app
import os

if __name__ == "__main__":
    uvicorn.run(
        "src.api.api:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8080")),
        reload=True
    )
