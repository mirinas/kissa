"""
Models module.

This module provides all the schema models and their types in the form of pydantic models
"""

from pydantic import BaseModel, EmailStr

class LoginCredentials(BaseModel):
    username: str
    password: str

class RegistrationData(BaseModel):
    username: str
    password: str
    email: EmailStr
    album: str