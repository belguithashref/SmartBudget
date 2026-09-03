from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, Float, String, ForeignKey, Date , func , extract , UniqueConstraint
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, date
from enum import Enum
from pydantic import BaseModel, Field
from database import Base, get_db
from models import UserDB, ExpenseDB, IncomeDB, BudgetDB
from fastapi.middleware.cors import CORSMiddleware
from routers import expenses
from routers import income
from routers import budgets
from routers import dashboard
from schemas import (
    UserCreate,
    UserResponse,
    ExpenseCreate,
    ExpenseResponse,
    IncomeCreate,
    IncomeResponse,
    BudgetCreate,
    BudgetResponse,
    LanguageUpdate,
    RegisterResponse
)
from auth import (
create_access_token,
    verify_access_token,
    get_current_user,
    pwd_context,
    create_refresh_token,
    verify_refresh_token
)




app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://smart-budget-xq75-beta.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS",
    ],
    allow_headers=[
        "Authorization",
        "Content-Type",
    ],
)

app.include_router(expenses.router)

app.include_router(income.router)

app.include_router(budgets.router)

app.include_router(dashboard.router)

@app.get("/test-db")
def test_db():
    with engine.connect() as connection:
        return {"message": "PostgreSQL connection successful!"}


@app.get("/")
def home():
    return {"message": "Hello, SmartBudget!"}


@app.post("/users", response_model=RegisterResponse)
def create_user(user: UserCreate, db=Depends(get_db)):

    # Check if email already exists
    existing_user = db.query(UserDB).filter(
        UserDB.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered"
        )

    password = user.password

    if len(password.encode("utf-8")) > 72:
       raise HTTPException(
          status_code=400,
          detail="Password must not exceed 72 bytes"
    )

    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long"
        )

    if not any(char.isupper() for char in password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one uppercase letter"
        )

    if not any(char.islower() for char in password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one lowercase letter"
        )

    if not any(char.isdigit() for char in password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one number"
        )

    hashed_password = pwd_context.hash(user.password)

    new_user = UserDB(
        username=user.username,
        email=user.email,
        password=hashed_password,
        language=user.language
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(
        data={"sub": str(new_user.id)}
    )

    return {
        "user": new_user,
        "access_token": access_token,
        "token_type": "bearer"
    }
@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_db)
):

    existing_user = db.query(UserDB).filter(
        UserDB.email == form_data.username
    ).first()

    if existing_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_correct = pwd_context.verify(
        form_data.password,
        existing_user.password
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
    data={"sub": str(existing_user.id)}
)

    refresh_token = create_refresh_token(
    data={"sub": str(existing_user.id)}
)

    return {
      "access_token": access_token,
      "refresh_token": refresh_token,
      "token_type": "bearer"
}

class RefreshTokenRequest(BaseModel):
    refresh_token: str

@app.post("/refresh")
def refresh_access_token(
    request: RefreshTokenRequest,
    db=Depends(get_db)
):
    user_id = verify_refresh_token(request.refresh_token)

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token"
        )

    user = db.query(UserDB).filter(
        UserDB.id == int(user_id)
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    access_token = create_access_token(
        data={"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
}
@app.get("/users/me")
def get_current_user_info(
    current_user: UserDB = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "language": current_user.language
    }


@app.put("/users/me/password")
def change_password(
    current_password: str,
    new_password: str,
    current_user: UserDB = Depends(get_current_user),
    db=Depends(get_db)
):
    # Check current password
    if not pwd_context.verify(
        current_password,
        current_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )


    if len(new_password.encode("utf-8")) > 72:
       raise HTTPException(
         status_code=400,
         detail="Password must not exceed 72 bytes"
    )

    # Check that the new password is different
    if pwd_context.verify(
        new_password,
        current_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="New password must be different from the current password"
        )

    # Validate new password strength
    if len(new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long"
        )

    if not any(char.isupper() for char in new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one uppercase letter"
        )

    if not any(char.islower() for char in new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one lowercase letter"
        )

    if not any(char.isdigit() for char in new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one number"
        )

    # Hash the new password
    current_user.password = pwd_context.hash(new_password)

    db.commit()

    return {
        "message": "Password updated successfully"
    }

@app.put("/users/me/language")
def update_user_language(
    language: str,
    current_user: UserDB = Depends(get_current_user),
    db=Depends(get_db)
):
    if language not in ["en", "fr"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid language"
        )

    current_user.language = language
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Language updated successfully",
        "language": current_user.language
    }

@app.put("/users/me/username")
def update_username(
    username: str,
    current_user: UserDB = Depends(get_current_user),
    db=Depends(get_db)
):
    username = username.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="Username cannot be empty"
        )

    if len(username) < 3:
        raise HTTPException(
            status_code=400,
            detail="Username must be at least 3 characters long"
        )

    current_user.username = username

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Username updated successfully",
        "username": current_user.username
    }

@app.put("/users/me/email")
def update_email(
    email: str,
    current_user: UserDB = Depends(get_current_user),
    db=Depends(get_db)
):
    email = email.strip().lower()

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email cannot be empty"
        )

    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(
            status_code=400,
            detail="Invalid email address"
        )

    existing_user = db.query(UserDB).filter(
        UserDB.email == email,
        UserDB.id != current_user.id
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already in use"
        )

    current_user.email = email

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Email updated successfully",
        "email": current_user.email
    }


@app.put("/users/language")
def update_language(
    data: LanguageUpdate,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if data.language not in ["en", "fr"]:
        raise HTTPException(
            status_code=400,
            detail="Language must be 'en' or 'fr'"
        )

    current_user.language = data.language

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Language updated successfully",
        "language": current_user.language
    }






       

