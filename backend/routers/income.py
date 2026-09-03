from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import IncomeDB
from schemas import IncomeCreate, IncomeResponse
from auth import get_current_user

router = APIRouter(
    prefix="/income",
    tags=["Income"]
)

@router.post("", response_model=IncomeResponse)
def create_income(
    income: IncomeCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_income = IncomeDB(
        amount=income.amount,
        source=income.source,
        description=income.description,
        income_date=income.income_date,
        user_id=current_user.id
    )

    db.add(new_income)
    db.commit()
    db.refresh(new_income)

    return new_income


@router.get("", response_model=list[IncomeResponse])
def get_income(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(IncomeDB).filter(
        IncomeDB.user_id == current_user.id
    ).all()       


@router.put("/{income_id}", response_model=IncomeResponse)
def update_income(
    income_id: int,
    income: IncomeCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing_income = db.query(IncomeDB).filter(
        IncomeDB.id == income_id,
        IncomeDB.user_id == current_user.id
    ).first()

    if existing_income is None:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    existing_income.amount = income.amount
    existing_income.source = income.source
    existing_income.description = income.description
    existing_income.income_date = income.income_date

    db.commit()
    db.refresh(existing_income)

    return existing_income


@router.delete("/{income_id}")
def delete_income(
    income_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing_income = db.query(IncomeDB).filter(
        IncomeDB.id == income_id,
        IncomeDB.user_id == current_user.id
    ).first()

    if existing_income is None:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    db.delete(existing_income)
    db.commit()

    return {
        "message": "Income deleted successfully"
    }