"""
Profile module.

For handling profile data, such as profile changes.
"""


from math import radians, sin, cos, sqrt, atan2

from fastapi import APIRouter, HTTPException, File, UploadFile, status, Depends
from database import Database
from auth_ops import get_current_user
from models import CatProfile, UserProfile, user_profile, fake_cat, ConfirmResponse, ConfirmSuggestion, UserData, UserPatch
import datetime
from dateutil import relativedelta

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

    return UserProfile(**user)


@router.get("/{pid}/cat", status_code=status.HTTP_200_OK, response_model=CatProfile)
async def get_cat_profile(pid: str, current_user: UserProfile = Depends(get_current_user)) -> CatProfile:
    """
    Get owner's cat profile data
    :param pid: profile id
    :param current_user: authenticated user
    :return: cat profile with owner id
    """
    user = await get_user_profile(pid, current_user)
    cat_dict = user.cat.dict()
    cat = CatProfile(**cat_dict, owner_id=user.oid)
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

    if profile.location is not None:
        user = UserProfile(**user)
        matches_ids = find_matches_within_radius(user, user_db.get_all_users())
        profile = profile.dict()
        profile['potentials'] = matches_ids
    updated_user = user_db.update_user(pid, profile.dict())
    if updated_user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail='Patch request was not successful')

    return UserProfile(**updated_user)


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


def current_age(dob_str: str) -> int:
    dob = datetime.strptime(dob_str, '%m/%d/%Y')
    today = datetime.date.today()
    age = relativedelta.relativedelta(today, dob).years
    return age


def find_matches_within_radius(user: UserProfile, user_profiles: list[UserProfile]):
    matches = []

    max_distance = user.search_radius

    for other_user in user_profiles:
        if user.oid != other_user.oid:
            distance = haversine_distance(
                user.location[0], user.location[1], other_user.location[0], other_user.location[1]
            )

            user_age = current_age(other_user.dob)
            if distance <= max_distance and user.preference == other_user.gender and other_user.oid not in user.skips\
                    and user.age_range[0] <= user_age <= user.age_range[1]\
                    and other_user not in user.selections:
                matches.append(other_user)

    return list(map(lambda u: u.oid, matches))


if __name__ == "__main__":
    from models import user_profile

    user_profile2 = UserProfile(**user_profile.dict())
    user_profile2.oid = 'some other id',
    user_profile2.name = "German 2",
    user_profile2.dob = '30/05/2003',
    user_profile2.location = [26.8674446, 81.109758],
    user_profile2.gender = "female",
    user_profile2.preference = 'male',

    print(user_profile.oid)
    print(user_profile2.oid)

    matches = find_matches_within_radius(user_profile, [user_profile2])
    print(matches)

