"""
Models module.

This module provides all the schema models and their types in the form of pydantic models
"""


from pydantic import BaseModel, EmailStr
from typing import Optional, List
import base64


class Token(BaseModel):
    access_token: str
    token_type: str


class CatData(BaseModel):
    """Cat data model"""
    name: str
    age: int
    breed: str
    sex: bool  # false = male, true = female
    bio: str
    image_ids: List[str] = []  # list of image ids


class UserData(BaseModel):
    email: EmailStr
    dob: str  # date of birth
    gender: str
    name: str
    surname: str
    bio: str
    location: str  # "lat, lon" Used to find matches nearby
    profile_pic_url: str
    cat: CatData  # User's cat profile


class CatPatch(BaseModel):
    """Cat patch model"""
    name: str = None
    age: int = None
    breed: str = None
    sex: bool = None
    bio: str = None
    image_ids: List[str] = None


# This model can assign attributes to default None as it allows for
# partial patching of db entries
class UserPatch(BaseModel):
    """User patch model"""
    email: Optional[EmailStr] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    profile_pic_url: Optional[str] = None
    cat: Optional[CatPatch] = None


class CatProfile(CatData):
    """Cat profile that is returned separately from the owner"""
    owner_id: str


class LoginCredentials(BaseModel):
    email: EmailStr
    password: str


class UserProfile(UserData):
    oid: str
    hashed_password: str                    # Hashed password
    matches: List[str] = []     # List of IDs of matches
    matches_allowed: int = 3                # Number of matches allowed
    selections: List[str] = []  # Profiles that a user selected
    potentials: List[str] = []  # List of profiles nearby
    search_radius: float = 10.0              # Search radius in km, default is 10.0


class RegisterUser(UserData):
    password: str


class Message(BaseModel):
    from_u: str
    datetime: str
    message: str


class Match(BaseModel):
    oid: str
    user_1: str
    user_2: str
    meeting_confirmation: list[str] # list of confirmation who confirmed the meeting
    messages: list[Message]


class MeetingConfirmation(BaseModel):
    picture_url: str


class ConfirmSuggestion(BaseModel):
    oid: str


class ConfirmResponse(BaseModel):
    """
    Represents a confirmation of matching
    `match_id` is only set if match is bidirectional
    """
    matches_left: int
    match_id: Optional[str]


fake_cat = CatProfile(
    owner_id="0",
    name="Fnuffy",
    age=11,
    breed="N/A",
    sex=False,
    bio="He loves flowers",
    image_ids=['id_1']
)

user_profile = UserProfile(
    oid='some id',
    name="German",
    surname="test",
    bio='I want to find love of my life',
    hashed_password="H1H12D",
    age=20,
    email='gn2g21@soton.ac.uk',
    dob='30/05/2003',
    location="26.7674446, 81.109758",
    gender="male",
    matches=["0", "1", "2"],
    matches_allowed=3,
    selections=["73", "22"],
    potentials=["9", "7"],
    search_radius=12.2,
    cat=fake_cat,
    profile_pic_url="test"
)
