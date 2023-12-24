"""
User authentication routes module.

This smodule containes authentication logic, password hashing, and JWT/JSON token handling
"""

from fastapi import APIRouter, HTTPException, status
from models import LoginCredentials, RegistrationData
from passlib.context import CryptContext
from database import create_user, get_user

# New router for authentication routes
router = APIRouter()

@router.post("/login") 
async def login(credentials: LoginCredentials):
    user = get_user(credentials.username, credentials.password)
    if user:
        return {"message": "Login successful", "token": "some_token"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/register")
async def register(user_data: RegistrationData):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash(user_data.password)

    user = create_user(username=user_data.username, password=hashed_password, email=user_data.email)
    if user:
        return {"message": "User created successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error creating user"
        )
