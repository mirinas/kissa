"""
Models module.

This module provides all the schema models and their types in the form of pydantic models
"""

from pydantic import BaseModel, EmailStr
import base64

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: str | None = None


class Picture(BaseModel):
    id: str
    data: base64
    owner: str


class UserData(BaseModel):
    email: EmailStr
    # date of birth
    dob: str
    gender: str
    name: str
    surname: str
    # "lat, lon" Used to find matches nearby
    location: str
    profile_pic_url: str

    # list of session ids
    sessions: [str]


class LoginCredentials(BaseModel):
    username: str
    password: str


class RegistrationData(UserData):
    password: str


class CatProfile(BaseModel):
    owner_id: str
    name: str
    age: int
    breed: str
    # false - male
    # true - female
    sex: bool
    bio: str
    # list of image urls
    image_urls: list[str]


class UserProfile(UserData):
    id: str
    # list to ids of matches
    matches: list[str]
    matches_allowed: int
    # profiles that a user selected
    selections: list[str]
    # list of profiles nearby
    potentials: list[str]
    cat_profile: CatProfile


class Message(BaseModel):
    from_u: str
    datetime: str
    message: str


class Match(BaseModel):
    id: str
    user_1: str
    user_2: str
    # list of confirmation who confirmed the meeting
    meeting_confirmation: list[str]
    messages: list[Message]


class MeetingConfirmation(BaseModel):
    uid: str
    picture_url: str


class ConfirmSuggestion(BaseModel):
    id: str


class ConfirmResponse(BaseModel):
    matches_left: int
    is_matched: bool


fake_profile = CatProfile()
fake_profile.name = "Fnuffy"
# age is in months
fake_profile.age = 11
fake_profile.bio = 'He loves flowers'
fake_profile.sex = False
fake_profile.breed = 'N/A'
fake_profile.image_urls = ['https://images.unsplash.com/photo-1561948955-570b270e7c36?q=80&w=3035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']


user_profile = UserProfile()
user_profile.id = 'abscd'
user_profile.name = "German"
user_profile.age = 20
user_profile.email = 'gn2g21@soton.ac.uk'
user_profile.dob = '30/05/2003'
user_profile.location = "26.7674446, 81.109758"
user_profile.matches_allowed = 3
user_profile.cat_profile = fake_profile