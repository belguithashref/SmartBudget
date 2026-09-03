from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    ForeignKey,
    Date,
    UniqueConstraint
)
from sqlalchemy.orm import relationship

from database import Base


class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    language = Column(String, nullable=False, default="en")

    expenses = relationship("ExpenseDB", back_populates="user")


class ExpenseDB(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    expense_date = Column(Date, nullable=False)

    user = relationship("UserDB", back_populates="expenses")


class IncomeDB(Base):
    __tablename__ = "income"

    id = Column(Integer, primary_key=True)
    amount = Column(Float, nullable=False)
    source = Column(String, nullable=False)
    description = Column(String, nullable=False)
    income_date = Column(Date, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)


class BudgetDB(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True)
    amount = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "month",
            "year",
            name="unique_user_month_budget"
        ),
    )