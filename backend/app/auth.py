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
from models import LoginCredentials, RegistrationData, Token, UserInDB, UserProfile
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
    login_credentials = LoginCredentials(username=form_data.username, password=form_data.password)
    user = await authenticate_user(login_credentials)

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

async def authenticate_user(login_credentials: LoginCredentials):
    user = get_user(login_credentials.username)

    # Return 'None' instead of False as per fastAPI docs
    if not user:
        return None 

    # the password retrieved here from database is hashed, and gets verified
    if not pwd_context.verify(login_credentials.password, user.hashed_password):
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
async def register(user_data: UserProfile):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash(user_data.hashed_password)

    # Update hashed password and remove plain one
    user_dict = user_data.model_dump()
    user_dict['hashed_password'] = hashed_password

    user_created = user_db.create_user(user_dict)

    if user_created:
        return {"message": "User created successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error creating user"
        )
