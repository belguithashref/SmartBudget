from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, extract
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from models import BudgetDB, ExpenseDB
from schemas import BudgetCreate, BudgetResponse
from auth import get_current_user

router = APIRouter(
    prefix="/budgets",
    tags=["Budgets"]
)

@router.post("", response_model=BudgetResponse)
def create_budget(
    budget: BudgetCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_budget = BudgetDB(
        amount=budget.amount,
        month=budget.month,
        year=budget.year,
        user_id=current_user.id
    )

    db.add(new_budget)

    try:
        db.commit()
        db.refresh(new_budget)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="You already have a budget for this month"
        )

    return new_budget


@router.get("", response_model=list[BudgetResponse])
def get_budgets(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(BudgetDB).filter(
        BudgetDB.user_id == current_user.id
    ).all()


@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int,
    budget: BudgetCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing_budget = db.query(BudgetDB).filter(
        BudgetDB.id == budget_id,
        BudgetDB.user_id == current_user.id
    ).first()

    if existing_budget is None:
        raise HTTPException(
            status_code=404,
            detail="Budget not found"
        )

    existing_budget.amount = budget.amount
    existing_budget.month = budget.month
    existing_budget.year = budget.year

    try:
        db.commit()
        db.refresh(existing_budget)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="You already have a budget for this month"
        )

    return existing_budget


@router.delete("/{budget_id}")
def delete_budget(
    budget_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing_budget = db.query(BudgetDB).filter(
        BudgetDB.id == budget_id,
        BudgetDB.user_id == current_user.id
    ).first()

    if existing_budget is None:
        raise HTTPException(
            status_code=404,
            detail="Budget not found"
        )

    db.delete(existing_budget)
    db.commit()

    return {
        "message": "Budget deleted successfully"
    }


@router.get("/{budget_id}/progress")
def get_budget_progress(
    budget_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    budget = db.query(BudgetDB).filter(
        BudgetDB.id == budget_id,
        BudgetDB.user_id == current_user.id
    ).first()

    if budget is None:
        raise HTTPException(
            status_code=404,
            detail="Budget not found"
        )

    total_expenses = db.query(
        func.sum(ExpenseDB.amount)
    ).filter(
        ExpenseDB.user_id == current_user.id,
        extract("year", ExpenseDB.expense_date) == budget.year,
        extract("month", ExpenseDB.expense_date) == budget.month
    ).scalar() or 0

    remaining = budget.amount - total_expenses

    if budget.amount > 0:
        percentage_used = (total_expenses / budget.amount) * 100
    else:
        percentage_used = 0

    if percentage_used > 100:
        status = "exceeded"
    elif percentage_used >= 80:
        status = "warning"
    else:
        status = "on_track"

    return {
        "budget": budget.amount,
        "spent": total_expenses,
        "remaining": remaining,
        "percentage_used": round(percentage_used, 2),
        "status": status
    }