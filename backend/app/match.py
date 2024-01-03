"""
Profile matching module.

"""
from math import radians, cos, sin, atan2, sqrt

from fastapi import APIRouter, HTTPException, File, UploadFile, status, Depends

from auth_ops import get_current_user
from database import Database
from models import Match, Message, MeetingConfirmation, ConfirmResponse, ConfirmSuggestion, UserProfile, fake_cat, \
    CatProfile
from typing import Any

router = APIRouter(prefix="/match", tags=["match"])


@router.get("/suggest", status_code=status.HTTP_200_OK)
async def get_suggestion(current_user: UserProfile = Depends(get_current_user)) -> CatProfile:
    """
    Get next matched cat profile for user
    :param current_user: authenticated user
    :return: matching cat's profile
    """
    # TODO: return the next suggestion for the given profile
    return fake_cat


@router.post("/confirm", status_code=status.HTTP_200_OK)
async def confirm_suggestion(confirmation: ConfirmSuggestion,
                             current_user: UserProfile = Depends(get_current_user)) -> ConfirmResponse:
    """
    Confirm that the user liked the suggestion
    :param confirmation: the confirmation of choice details
    :param current_user: authenticated user
    :return: confirmation response with details for the date
    """
    r = ConfirmResponse()
    r.matches_left = 3
    r.is_matched = False
    return r


@router.get("/{mid}", status_code=status.HTTP_200_OK, response_model=Match, response_model_exclude_unset=True)
def get_match(mid: int) -> Any:
    m = Match()
    m.id = "12"
    m.user_1 = 'u1'
    m.user_2 = 'u2'
    m.meeting_confirmation = list()
    m.messages = list()
    return m


@router.post("/{mid}/message", status_code=status.HTTP_201_CREATED)
def post_message(mid: int, msg: Message):
    pass


@router.post("/{mid}/confirm", status_code=status.HTTP_200_OK)
def confirm_meeting(mid: int, confirmation: MeetingConfirmation):
    pass


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
