"""
Profile module.

For handling profile data, such as profile changes.
"""

from fastapi import APIRouter, HTTPException, File, UploadFile, status
from database import UserDatabase 
from models import CatProfile

router = APIRouter(prefix="/profile")


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_profile(profile: CatProfile):
    # TODO: Logic to save profile data to the database
    # perhaps after registering, the user is taken to a screen to fill in their info?

    pass


@router.get("/{id}", status_code=status.HTTP_200_OK)
async def get_profile(pid: str):
    pass


@router.put("/{id}", status_code=status.HTTP_200_OK)
async def put_profile(pid: str, profile: CatProfile):
    pass


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(pid: str):
    pass

