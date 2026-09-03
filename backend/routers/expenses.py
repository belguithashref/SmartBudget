from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import ExpenseDB
from schemas import ExpenseCreate, ExpenseResponse
from auth import get_current_user
from enum import Enum
from datetime import date


router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


class SortBy(str, Enum):
    date = "date"
    amount = "amount"



class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"
   


@router.get("", response_model=list[ExpenseResponse])
def get_expenses(
    category: str | None = None,
    min_amount: float | None = None,
    max_amount: float | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    sort_by: SortBy = SortBy.date,
    sort_order: SortOrder = SortOrder.desc,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(ExpenseDB).filter(
        ExpenseDB.user_id == current_user.id
    )

    if category is not None:
        query = query.filter(
            ExpenseDB.category == category
        )

    if min_amount is not None:
        query = query.filter(
            ExpenseDB.amount >= min_amount
        )

    if max_amount is not None:
        query = query.filter(
            ExpenseDB.amount <= max_amount
        )
    if start_date is not None:
        query = query.filter(
            ExpenseDB.expense_date >= start_date
        )

    if end_date is not None:
        query = query.filter(
            ExpenseDB.expense_date <= end_date
        )
    if sort_by == "amount":
        if sort_order == "asc":
            query = query.order_by(ExpenseDB.amount.asc())
        else:
            query = query.order_by(ExpenseDB.amount.desc())

    elif sort_by == "date":
        if sort_order == "asc":
            query = query.order_by(ExpenseDB.expense_date.asc())
        else:
            query = query.order_by(ExpenseDB.expense_date.desc())        

    return query.all()


@router.get("/summary")
def get_expense_summary(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    expenses = db.query(ExpenseDB).filter(
        ExpenseDB.user_id == current_user.id
    ).all()

    total_expenses = sum(expense.amount for expense in expenses)

    expense_count = len(expenses)

    average_expense = (
        total_expenses / expense_count
        if expense_count > 0
        else 0
    )

    return {
        "total_expenses": total_expenses,
        "expense_count": expense_count,
        "average_expense": average_expense
    }


@router.get("/summary/categories")
def get_expenses_by_category(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    expenses = db.query(ExpenseDB).filter(
        ExpenseDB.user_id == current_user.id
    ).all()

    category_totals = {}

    for expense in expenses:
        if expense.category not in category_totals:
            category_totals[expense.category] = 0

        category_totals[expense.category] += expense.amount

    return category_totals


@router.get("/summary/monthly")
def get_monthly_expenses(
    year: int | None = None,
    month: int | None = None,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    expenses = db.query(ExpenseDB).filter(
        ExpenseDB.user_id == current_user.id
    ).all()

    monthly_totals = {}

    for expense in expenses:
        expense_year = expense.expense_date.year
        expense_month = expense.expense_date.month

        if year is not None and expense_year != year:
            continue

        if month is not None and expense_month != month:
            continue

        month_key = expense.expense_date.strftime("%Y-%m")

        if month_key not in monthly_totals:
            monthly_totals[month_key] = 0

        monthly_totals[month_key] += expense.amount

    return monthly_totals




@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    expense = db.query(ExpenseDB).filter(
        ExpenseDB.id == expense_id,
        ExpenseDB.user_id == current_user.id
    ).first()

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return expense

@router.post("", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, current_user=Depends(get_current_user), db = Depends(get_db)):
    new_expense = ExpenseDB(
        amount=expense.amount,
        category=expense.category,
        description=expense.description,
        user_id=current_user.id,
        expense_date=expense.expense_date
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense: ExpenseCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing_expense = db.query(ExpenseDB).filter(
        ExpenseDB.id == expense_id,
        ExpenseDB.user_id == current_user.id
    ).first()

    if existing_expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    existing_expense.amount = expense.amount
    existing_expense.category = expense.category
    existing_expense.description = expense.description
    existing_expense.expense_date = expense.expense_date

    db.commit()
    db.refresh(existing_expense)

    return existing_expense


@router .delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing_expense = db.query(ExpenseDB).filter(
        ExpenseDB.id == expense_id,
        ExpenseDB.user_id == current_user.id
    ).first()

    if existing_expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    db.delete(existing_expense)
    db.commit()

    return {"message": "Expense deleted successfully"}