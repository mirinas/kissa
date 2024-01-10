"""
Main module.

This module provides the entry point of the application, instantiates FastAPI app and routes
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from profile import router as profile_router
from pictures import router as picture_router
from match import router as match_router

app = FastAPI()

# CORS settings
origins = [
    "http://localhost",
    "http://localhost:3000",  # Local
    "https://kissa-web.jollymoss-4112728e.uksouth.azurecontainerapps.io"  # Remote
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "api_version": "v1.1",
        "status": "live",
        "documentation_url": "https://kissa-api.jollymoss-4112728e.uksouth.azurecontainerapps.io/docs"
    }

# Authentication routes for login and registering
app.include_router(auth_router) 

# Routes for profile actions
app.include_router(profile_router)

# Routes for match actions
app.include_router(match_router)

# Routes for picture actions
app.include_router(picture_router)

