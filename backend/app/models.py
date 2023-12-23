# Pydantic models

from pydantic import BaseModel, EmailStr

class LoginCredentials(BaseModel):
    username: str
    password: str

class RegistrationData(BaseModel):
    username: str
    password: str
    email: EmailStr