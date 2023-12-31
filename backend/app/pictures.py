"""
Pictures module.

For handling picture data, such as cat pictures.
"""

from fastapi import APIRouter, HTTPException, File, UploadFile, status
from database import UserDatabase
from models import CatProfile

router = APIRouter(prefix="pictures")


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_picture(file: UploadFile = File(...)) -> str:
    # TODO: Logic to upload picture and return the URL

    return "todo"


@router.get("/{pid}", status_code=status.HTTP_200_OK)
async def get_picture(pid: str):
    return 'base64 blob'


@router.delete("/{pid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_picture(pid: str):
    pass
