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


class TokenData(BaseModel):
    user_id: str | None = None


class Picture(BaseModel):
    id: str
    data: str 
    owner: str


class UserData(BaseModel):
    email: EmailStr
    dob: str # date of birth
    gender: str
    name: str
    surname: str
    location: str # "lat, lon" Used to find matches nearby
    profile_pic_url: str


# This model is used for returning the hashed password of a user after authentication subset of UserData
class UserInDB(UserData):
    email: EmailStr
    hashed_password: str


class LoginCredentials(BaseModel):
    email: EmailStr
    password: str


class CatProfile(BaseModel):
    owner_id: str
    name: str
    age: int
    breed: str
    sex: bool # false = male, true = female
    bio: str
    image_ids: List[str] = [] # list of image ids


class UserProfile(UserData):
    id: str
    matches: Optional[List[str]] = None # list to ids of matches
    matches_allowed: Optional[int] = None
    selections: Optional[List[str]] = None # profiles that a user selected
    potentials: Optional[List[str]] = None # list of profiles nearby
    search_radius: float = 10.0 # search radius in km
    cat_profile: CatProfile
    hashed_password: str


class Message(BaseModel):
    from_u: str
    datetime: str
    message: str


class Match(BaseModel):
    id: str
    user_1: str
    user_2: str
    meeting_confirmation: list[str] # list of confirmation who confirmed the meeting
    messages: list[Message]


class MeetingConfirmation(BaseModel):
    picture_url: str


class ConfirmSuggestion(BaseModel):
    id: str


class ConfirmResponse(BaseModel):
    matches_left: int
    is_matched: bool


fake_profile = CatProfile(
    owner_id="0",
    name="Fnuffy",
    age=11,
    breed="N/A",
    sex=False,
    bio="He loves flowers",
    image_ids=['https://images.unsplash.com/photo-1561948955-570b270e7c36?q=80&w=3035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
)

user_profile = UserProfile(
    id="abscd",
    name="German",
    surname="test",
    hashed_password="",
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
    cat_profile = fake_profile,
    profile_pic_url="test"
)
