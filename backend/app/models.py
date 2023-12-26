"""
Models module.

This module provides all the schema models and their types in the form of pydantic models
"""

from pydantic import BaseModel, EmailStr

class LoginCredentials(BaseModel):
    username: str
    password: str

class RegistrationData(BaseModel):
    id: int
    username: str
    password: str
    email: EmailStr
    album: str

class CatProfile(BaseModel):
    name: str
    age: int
    breed: str
    bio: str
    image_url: str 
