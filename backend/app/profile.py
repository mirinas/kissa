"""
Profile module.

For handling profile data, such as profile changes.
"""


from math import radians, sin, cos, sqrt, atan2

from fastapi import APIRouter, HTTPException, File, UploadFile, status, Depends
from database import Database
from auth_ops import get_current_user
from models import CatProfile, UserProfile, user_profile, fake_cat, ConfirmResponse, ConfirmSuggestion, UserData, UserPatch


router = APIRouter(prefix="/profiles", tags=['profiles'])
user_db = Database()


@router.get("/{pid}", status_code=status.HTTP_200_OK, response_model=UserProfile,
            response_model_exclude={'hashed_password'})
async def get_user_profile(pid: str, current_user: UserProfile = Depends(get_current_user)) -> UserProfile:
    """
    Get user profile data
    :param pid: profile id
    :param current_user: authenticated user
    :return: user profile data
    """
    user = user_db.get_user_by_id(pid)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    res = list(filter(lambda u: u.uid == pid, current_user.potentials))
    if len(res) == 0 and current_user.oid != pid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='You do not have permission to request this profile data')

    return user


@router.get("/{pid}/cat", status_code=status.HTTP_200_OK, response_model=CatProfile)
async def get_cat_profile(pid: str, current_user: UserProfile = Depends(get_current_user)) -> CatProfile:
    """
    Get owner's cat profile data
    :param pid: profile id
    :param current_user: authenticated user
    :return: cat profile with owner id
    """
    user = await get_user_profile(pid, current_user)
    cat_dict = user['cat']
    cat = CatProfile(**cat_dict, owner_id=user['oid'])
    return cat


@router.patch("/{pid}", status_code=status.HTTP_200_OK)
async def update_profile(pid: str, profile: UserPatch,
                         current_user: UserProfile = Depends(get_current_user)) -> UserProfile:
    """
    Update profile by patch

    # Note
    `cat` field needs to accept the complete object if present
    """
    user = user_db.get_user_by_id(pid)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    if current_user.oid != pid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='You do not have permission to patch this profile')

    for field, value in profile.dict(exclude_unset=True).items():
        if hasattr(user, field):
            setattr(user, field, value)

    updated_user = user_db.update_user(pid, profile.dict())
    if updated_user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='Patch request was not successful')

    return updated_user


@router.delete("/{pid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(pid: str, current_user: UserProfile = Depends(get_current_user)):
    """
    Delete profile
    :param pid: user id to delete
    :param current_user: authenticated user
    :return: Nothing
    """
    user = user_db.get_user_by_id(pid)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    if current_user.oid != pid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='You do not have permission to patch this profile')

    if not user_db.delete_user(pid):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error during deletion")


