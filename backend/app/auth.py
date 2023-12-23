# Contains authentication logic, password hashing, and JWT token handling

from fastapi import APIRouter, HTTPException, status
from models import LoginCredentials, RegistrationData
from passlib.context import CryptContext

# New router for authentication routes
router = APIRouter()

# Make hashed password for newly registered, uses passlib library 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login") 
async def login(credentials: LoginCredentials):
    if credentials.username == "admin" and credentials.password == "secret":
        return {"message": "Login successful", "token": "some_jwt_token"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/register")
async def register(user_data: RegistrationData):
    hashed_password = pwd_context.hash(user_data.password)

    user = create_user(username=user_data.username, password=hashed_password, email=user_data.email)
    if user:
        return {"message": "User created successfully"}
    else:
        raise HTTPException(status_code=400, detail="Error creating user")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_user(username: str, password: str, email: str):
    # TODO: Implement create_user

    return true
