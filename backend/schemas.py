from datetime import date

from pydantic import BaseModel, Field , EmailStr

from typing import Literal


class ExpenseCreate(BaseModel):
    amount: float = Field(gt=0)
    category: str
    description: str
    expense_date: date


class ExpenseResponse(BaseModel):
    id: int
    amount: float
    category: str
    description: str
    expense_date: date

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    language: Literal["en", "fr"] = "en"


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    language: str

    class Config:
        from_attributes = True


class LanguageUpdate(BaseModel):
    language: str        


class UserLogin(BaseModel):
    email: str
    password: str


class BudgetCreate(BaseModel):
    amount: float = Field(gt=0)
    month: int = Field(ge=1, le=12)
    year: int = Field(ge=2000, le=2100)


class BudgetResponse(BaseModel):
    id: int
    amount: float
    month: int
    year: int

    class Config:
        from_attributes = True



class IncomeCreate(BaseModel):
    amount: float = Field(gt=0)
    source: str
    description: str
    income_date: date


class IncomeResponse(BaseModel):
    id: int
    amount: float
    source: str
    description: str
    income_date: date

    class Config:
        from_attributes = True


class RegisterResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str            