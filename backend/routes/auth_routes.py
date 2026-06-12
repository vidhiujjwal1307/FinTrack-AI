from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt

from database import get_db
from models.user import User
from schemas.user_schemas import UserSignup, UserLogin, Token, UserResponse

router = APIRouter()

# Secret key for JWT (in production, use environment variable)
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

def create_access_token(user_id: int):
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode = {"user_id": user_id, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    # Create new user
    hashed_password = User.hash_password(user.password)
    new_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    access_token = create_access_token(new_user.id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "username": new_user.username
        }
    }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Find user by email
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or not User.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate token
    access_token = create_access_token(db_user.id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "username": db_user.username
        }
    }

@router.get("/me")
def get_current_user(token: str, db: Session = Depends(get_db)):
    user_id = verify_token(token)
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username
    }
