"""
Profile module.

For handling profile data, such as profile changes.
"""

from fastapi import APIRouter, HTTPException, File, UploadFile
from database import UserDatabase 
from models import CatProfile

router = APIRouter()

@router.post("/create-profile")
async def create_profile(profile: CatProfile):
    # TODO: Logic to save profile data to the database
    # perhaps after registering, the user is taken to a screen to fill in their info?

    pass

@router.post("/upload-pictures")
async def upload_pictures(file: UploadFile = File(...)):
    # TODO: Logic to upload picture and return the URL
    # handle album creation here and associate with user?

    pass
