"""
Profile module.

For handling profile data, such as profile changes.
"""

from fastapi import APIRouter, HTTPException, File, UploadFile, status
from database import UserDatabase 
from models import CatProfile, UserProfile, user_profile, fake_profile, ConfirmResponse, ConfirmSuggestion

router = APIRouter(prefix="/profile")


@router.post("/{pid}", status_code=status.HTTP_201_CREATED)
async def create_profile(pid: str, profile: CatProfile) -> UserProfile:
    # TODO: Remove this? Registering does the same thing as this

    return user_profile


@router.get("/{pid}", status_code=status.HTTP_200_OK)
async def get_user_profile(pid: str) -> UserProfile:
    return user_profile


@router.get("/{pid}/cat", status_code=status.HTTP_200_OK)
async def get_cat_profile(pid: str) -> CatProfile:
    return fake_profile


@router.patch("/{pid}", status_code=status.HTTP_200_OK)
async def update_profile(pid: str, profile: UserProfile) -> UserProfile:
    return profile


@router.delete("/{pid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(pid: str):
    return pid


@router.get("/{pid}/suggest", status_code=status.HTTP_200_OK)
async def get_suggestion(pid: str) -> CatProfile:
    # TODO: return the next suggestion for the given profile
    return fake_profile


@router.post("/{pid}/suggest", status_code=status.HTTP_200_OK)
async def confirm_suggestion(pid: str, confirmation: ConfirmSuggestion) -> ConfirmResponse:
    r = ConfirmResponse()
    r.matches_left = 3
    r.is_matched = False
    return r
