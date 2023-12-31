"""
User authentication routes module.

This module contains authentication logic, password hashing, and JWT/JSON token handling.
"""

from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status
from passlib.context import CryptContext

from fastapi import APIRouter, HTTPException, status
from models import LoginCredentials, RegistrationData, Token, UserInDB
from passlib.context import CryptContext
from database import UserDatabase 

SECRET_KEY = "1cd38e0a7004b1694efbf1908bfc32ea0f858bb170e14b73ecc5fc1b412ecd20"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

user_db = UserDatabase()
router = APIRouter(prefix="/profiles")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/profiles/token")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # If user in database, grant token with 30min expiration
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

async def authenticate_user(username: str, password: str):
    user = get_user(username)

    # Return 'None' instead of False as per fastAPI docs
    if not user:
        return None 

    # the password retrieved here from database is hashed, and gets verified
    if not pwd_context.verify(password, user.hashed_password):
        return None

    return user

def get_user(username: str):
    user_dict = user_db.get_user_by_username(username)
    if user_dict:
        return UserInDB(**user_dict)
    else:
        print("User not found.")
        return None

@router.post("/register")
async def register(user_data: RegistrationData):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash(user_data.password)

    user_created = user_db.create_user(username=user_data.username, password=hashed_password, email=user_data.email)
    if user_created:
        return {"message": "User created successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error creating user"
        )
