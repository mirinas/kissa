"""
User authentication routes module.

This module contains authentication logic, password hashing, and JWT/JSON token handling.
"""
from bson import ObjectId
from fastapi import Depends
from fastapi import APIRouter, HTTPException, status
from auth_ops import *
from profile import find_matches_within_radius


user_db = Database()
router = APIRouter(prefix='/profiles', tags=['auth'])


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

    return Token(access_token=access_token, token_type="bearer")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: RegisterUser):
    h_pass = pwd_context.hash(user_data.password)

    # Convert the Pydantic model to a dictionary, to store hash password
    user_dict = user_data.model_dump()
    user_dict['hashed_password'] = h_pass
    user_dict.pop('password', None)
    user_dict.pop('confirm', None)

    if get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='User already exists with given email'
        )

    # we also generate object id here
    user = UserProfile(**user_dict, oid=str(ObjectId()))

    # and find matches
    all_users = list(map(lambda x: UserProfile(**x), user_db.get_all_users()))
    potentials_ids = find_matches_within_radius(user, all_users)
    print('Found {} potentials while registering'.format(len(potentials_ids)))
    user.potentials = potentials_ids

    created_id = user_db.create_user(user.model_dump())

    if created_id is not None:
        # If user in database, grant token with set expiration
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": created_id}, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error creating user"
        )


@router.get("/me", response_model=UserProfile, response_model_exclude={'hashed_password'})
async def read_users_me(current_user: UserProfile = Depends(get_current_user)):
    return current_user
