"""
Profile module.

For handling profile data, such as profile changes.
"""
from math import radians, sin, cos, sqrt, atan2

from fastapi import APIRouter, HTTPException, File, UploadFile, status
from database import UserDatabase 
from models import CatProfile, UserProfile, user_profile, fake_profile, ConfirmResponse, ConfirmSuggestion

router = APIRouter(prefix="/profiles")


@router.post("/{pid}", status_code=status.HTTP_201_CREATED)
async def create_profile(pid: str, profile: CatProfile) -> UserProfile:
    # TODO: Logic to save profile data to the database
    # perhaps after registering, the user is taken to a screen to fill in their info?

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


# Function to calculate the Haversine distance between two points
# Source: https://louwersj.medium.com/calculate-geographic-distances-in-python-with-the-haversine-method-ed99b41ff04b
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c
    return distance


def find_matches_within_radius(user_profiles, user, max_distance):
    matches = []

    for other_user in user_profiles:
        if user.user_id != other_user.user_id:
            distance = haversine_distance(
                user.latitude, user.longitude, other_user.latitude, other_user.longitude
            )

            if distance <= max_distance:
                matches.append(other_user)

    return matches
