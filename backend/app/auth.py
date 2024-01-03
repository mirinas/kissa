"""
User authentication routes module.

This module contains authentication logic, password hashing, and JWT/JSON token handling.
"""


from fastapi import Security
from pydantic import ValidationError
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends
from fastapi import APIRouter, HTTPException, status
from models import LoginCredentials, Token, RegisterUser, UserProfile
from passlib.context import CryptContext
from database import UserDatabase
from bson.objectid import ObjectId

SECRET_KEY = "1cd38e0a7004b1694efbf1908bfc32ea0f858bb170e14b73ecc5fc1b412ecd20"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

user_db = UserDatabase()
router = APIRouter(prefix='/profiles', tags=['auth'])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/profiles/token")


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    login_credentials = LoginCredentials(email=form_data.username, password=form_data.password)
    user = await authenticate_user(login_credentials)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # If user in database, grant token with set expiration
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.oid}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


async def authenticate_user(login_credentials: LoginCredentials):
    user = get_user_by_email(login_credentials.email)

    # Return 'None' instead of False as per fastAPI docs
    if not user:
        return None 

    # the password retrieved here from database is hashed, and gets verified
    if not pwd_context.verify(login_credentials.password, user.hashed_password):
        return None

    return user


def get_user_by_id(user_id: str):
    user_dict = user_db.get_user_by_id(user_id)

    if user_dict:
        return UserProfile(**user_dict)
    else:
        return None


def get_user_by_email(email: str) -> UserProfile | None:
    user_dict = user_db.get_user_by_email(email)

    if user_dict:
        return UserProfile(**user_dict)
    else:
        return None


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: RegisterUser):
    h_pass = pwd_context.hash(user_data.password)

    # Convert the Pydantic model to a dictionary, to store hash password
    user_dict = user_data.dict()
    user_dict['hashed_password'] = h_pass
    # Remove `password` field
    user_dict.pop('password', None)

    exist = user_db.get_user_by_email(user_data.email)
    if exist:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='User already exists with given email'
        )

    # we also generate object id here
    user = UserProfile(**user_dict, oid=str(ObjectId()))

    created_id = user_db.create_user(user.dict())

    if created_id is not None:
        # If user in database, grant token with set expiration
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": created_id}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer", "message": "User created successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error creating user"
        )


# Once the user is provided a token, use this function to access routes with user authentication
async def get_current_user(token: str = Security(oauth2_scheme)) -> UserProfile:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except (JWTError, ValidationError):
        raise credentials_exception

    print('Payload ', payload)
    print('User ', user_id)
    user = get_user_by_id(user_id)
    if user is None:
        raise credentials_exception

    return user


@router.get("/me", response_model=UserProfile, response_model_exclude={'hashed_password'})
async def read_users_me(current_user: UserProfile = Depends(get_current_user)):
    return current_user
