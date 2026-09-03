from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, extract

from database import get_db
from models import ExpenseDB, IncomeDB, BudgetDB
from auth import get_current_user

router = APIRouter(
    tags=["Dashboard"]
)


@router.get("/dashboard")
def get_dashboard(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    today = datetime.now()

    current_year = today.year
    current_month = today.month

    total_income = db.query(
        func.sum(IncomeDB.amount)
    ).filter(
        IncomeDB.user_id == current_user.id
    ).scalar() or 0

    total_expenses = db.query(
        func.sum(ExpenseDB.amount)
    ).filter(
        ExpenseDB.user_id == current_user.id
    ).scalar() or 0

    monthly_income = db.query(
        func.sum(IncomeDB.amount)
    ).filter(
        IncomeDB.user_id == current_user.id,
        extract("year", IncomeDB.income_date) == current_year,
        extract("month", IncomeDB.income_date) == current_month
    ).scalar() or 0

    monthly_expenses = db.query(
        func.sum(ExpenseDB.amount)
    ).filter(
        ExpenseDB.user_id == current_user.id,
        extract("year", ExpenseDB.expense_date) == current_year,
        extract("month", ExpenseDB.expense_date) == current_month
    ).scalar() or 0

    balance = total_income - total_expenses
    monthly_balance = monthly_income - monthly_expenses

    current_budget = db.query(BudgetDB).filter(
        BudgetDB.user_id == current_user.id,
        BudgetDB.year == current_year,
        BudgetDB.month == current_month
    ).first()

    budget_info = None

    if current_budget:
        budget_spent = db.query(
            func.sum(ExpenseDB.amount)
        ).filter(
            ExpenseDB.user_id == current_user.id,
            extract("year", ExpenseDB.expense_date) == current_year,
            extract("month", ExpenseDB.expense_date) == current_month
        ).scalar() or 0

        budget_remaining = current_budget.amount - budget_spent

        if current_budget.amount > 0:
            budget_percentage = (
                budget_spent / current_budget.amount
            ) * 100
        else:
            budget_percentage = 0

        if budget_percentage > 100:
            budget_status = "exceeded"
        elif budget_percentage >= 80:
            budget_status = "warning"
        else:
            budget_status = "on_track"

        budget_info = {
            "amount": current_budget.amount,
            "spent": budget_spent,
            "remaining": budget_remaining,
            "percentage_used": round(budget_percentage, 2),
            "status": budget_status
        }

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": balance,
        "monthly_income": monthly_income,
        "monthly_expenses": monthly_expenses,
        "monthly_balance": monthly_balance,
        "budget": budget_info
    }    


@router.get("/dashboard/statistics")
def get_dashboard_statistics(
    period: str = "monthly",
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    if period not in ["monthly", "quarterly", "yearly"]:
        raise HTTPException(
            status_code=400,
            detail="Period must be monthly, quarterly, or yearly"
        )

    # =========================
    # MONTHLY
    # =========================

    if period == "monthly":
        income_results = db.query(
            extract("year", IncomeDB.income_date).label("year"),
            extract("month", IncomeDB.income_date).label("period"),
            func.sum(IncomeDB.amount).label("total")
        ).filter(
            IncomeDB.user_id == current_user.id
        ).group_by(
            extract("year", IncomeDB.income_date),
            extract("month", IncomeDB.income_date)
        ).all()

        expense_results = db.query(
            extract("year", ExpenseDB.expense_date).label("year"),
            extract("month", ExpenseDB.expense_date).label("period"),
            func.sum(ExpenseDB.amount).label("total")
        ).filter(
            ExpenseDB.user_id == current_user.id
        ).group_by(
            extract("year", ExpenseDB.expense_date),
            extract("month", ExpenseDB.expense_date)
        ).all()

        income_data = {
            (int(row.year), int(row.period)): float(row.total)
            for row in income_results
        }

        expense_data = {
            (int(row.year), int(row.period)): float(row.total)
            for row in expense_results
        }

        periods = sorted(
            set(income_data.keys()) | set(expense_data.keys())
        )

        result = []

        for year, month in periods:
            result.append({
                "period": f"{year}-{month:02d}",
                "income": income_data.get((year, month), 0),
                "expenses": expense_data.get((year, month), 0)
            })

        return result

    # =========================
    # QUARTERLY
    # =========================

    elif period == "quarterly":
        income_results = db.query(
            extract("year", IncomeDB.income_date).label("year"),
            extract("quarter", IncomeDB.income_date).label("quarter"),
            func.sum(IncomeDB.amount).label("total")
        ).filter(
            IncomeDB.user_id == current_user.id
        ).group_by(
            extract("year", IncomeDB.income_date),
            extract("quarter", IncomeDB.income_date)
        ).all()

        expense_results = db.query(
            extract("year", ExpenseDB.expense_date).label("year"),
            extract("quarter", ExpenseDB.expense_date).label("quarter"),
            func.sum(ExpenseDB.amount).label("total")
        ).filter(
            ExpenseDB.user_id == current_user.id
        ).group_by(
            extract("year", ExpenseDB.expense_date),
            extract("quarter", ExpenseDB.expense_date)
        ).all()

        income_data = {
            (int(row.year), int(row.quarter)): float(row.total)
            for row in income_results
        }

        expense_data = {
            (int(row.year), int(row.quarter)): float(row.total)
            for row in expense_results
        }

        periods = sorted(
            set(income_data.keys()) | set(expense_data.keys())
        )

        result = []

        for year, quarter in periods:
            result.append({
                "period": f"{year} Q{quarter}",
                "income": income_data.get((year, quarter), 0),
                "expenses": expense_data.get((year, quarter), 0)
            })

        return result

    # =========================
    # YEARLY
    # =========================

    else:
        income_results = db.query(
            extract("year", IncomeDB.income_date).label("year"),
            func.sum(IncomeDB.amount).label("total")
        ).filter(
            IncomeDB.user_id == current_user.id
        ).group_by(
            extract("year", IncomeDB.income_date)
        ).all()

        expense_results = db.query(
            extract("year", ExpenseDB.expense_date).label("year"),
            func.sum(ExpenseDB.amount).label("total")
        ).filter(
            ExpenseDB.user_id == current_user.id
        ).group_by(
            extract("year", ExpenseDB.expense_date)
        ).all()

        income_data = {
            int(row.year): float(row.total)
            for row in income_results
        }

        expense_data = {
            int(row.year): float(row.total)
            for row in expense_results
        }

        periods = sorted(
            set(income_data.keys()) | set(expense_data.keys())
        )

        result = []

        for year in periods:
            result.append({
                "period": str(year),
                "income": income_data.get(year, 0),
                "expenses": expense_data.get(year, 0)
            })

        return result


@router.get("/summary/balance")
def get_balance(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    total_income = db.query(IncomeDB).filter(
        IncomeDB.user_id == current_user.id
    ).with_entities(
        func.sum(IncomeDB.amount)
    ).scalar() or 0

    total_expenses = db.query(ExpenseDB).filter(
        ExpenseDB.user_id == current_user.id
    ).with_entities(
        func.sum(ExpenseDB.amount)
    ).scalar() or 0

    balance = total_income - total_expenses

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": balance
    }    


@router.get("/summary/monthly")
def get_monthly_summary(
    year: int,
    month: int,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    income_total = db.query(func.sum(IncomeDB.amount)).filter(
        IncomeDB.user_id == current_user.id,
        extract("year", IncomeDB.income_date) == year,
        extract("month", IncomeDB.income_date) == month
    ).scalar() or 0

    expense_total = db.query(func.sum(ExpenseDB.amount)).filter(
        ExpenseDB.user_id == current_user.id,
        extract("year", ExpenseDB.expense_date) == year,
        extract("month", ExpenseDB.expense_date) == month
    ).scalar() or 0

    balance = income_total - expense_total

    return {
        "month": f"{year}-{month:02d}",
        "total_income": income_total,
        "total_expenses": expense_total,
        "balance": balance
    }


@router.get("/summary/categories")
def get_category_summary(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    results = db.query(
        ExpenseDB.category,
        func.sum(ExpenseDB.amount).label("total")
    ).filter(
        ExpenseDB.user_id == current_user.id
    ).group_by(
        ExpenseDB.category
    ).all()

    return [
        {
            "category": category,
            "total": total
        }
        for category, total in results
    ]


@router.get("/summary/categories/monthly")
def get_monthly_category_summary(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    today = datetime.now()

    results = db.query(
        ExpenseDB.category,
        func.sum(ExpenseDB.amount).label("total")
    ).filter(
        ExpenseDB.user_id == current_user.id,
        extract("year", ExpenseDB.expense_date) == today.year,
        extract("month", ExpenseDB.expense_date) == today.month
    ).group_by(
        ExpenseDB.category
    ).all()

    return [
        {
            "category": category,
            "total": total
        }
        for category, total in results
    ]


@router.get("/transactions/recent")
def get_recent_transactions(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    expenses = db.query(ExpenseDB).filter(
        ExpenseDB.user_id == current_user.id
    ).all()

    incomes = db.query(IncomeDB).filter(
        IncomeDB.user_id == current_user.id
    ).all()

    transactions = []

    for expense in expenses:
        transactions.append({
            "id": expense.id,
            "type": "expense",
            "amount": expense.amount,
            "category": expense.category,
            "description": expense.description,
            "date": expense.expense_date
        })

    for income in incomes:
        transactions.append({
            "id": income.id,
            "type": "income",
            "amount": income.amount,
            "category": income.source,
            "description": income.description,
            "date": income.income_date
        })

    transactions.sort(
        key=lambda transaction: transaction["date"],
        reverse=True
    )

    return transactions[:10]



@router.get("/dashboard/trends")
def get_dashboard_trends(
    period: str = "monthly",
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    if period not in ["monthly", "quarterly", "yearly"]:
        raise HTTPException(
            status_code=400,
            detail="Period must be monthly, quarterly, or yearly"
        )

    # Get all user incomes and expenses
    incomes = db.query(IncomeDB).filter(
        IncomeDB.user_id == current_user.id
    ).all()

    expenses = db.query(ExpenseDB).filter(
        ExpenseDB.user_id == current_user.id
    ).all()

    trends = {}

    # -------------------------
    # Monthly
    # -------------------------
    if period == "monthly":

        for income in incomes:
            key = income.income_date.strftime("%Y-%m")

            if key not in trends:
                trends[key] = {
                    "period": key,
                    "income": 0,
                    "expenses": 0
                }

            trends[key]["income"] += income.amount

        for expense in expenses:
            key = expense.expense_date.strftime("%Y-%m")

            if key not in trends:
                trends[key] = {
                    "period": key,
                    "income": 0,
                    "expenses": 0
                }

            trends[key]["expenses"] += expense.amount

    # -------------------------
    # Quarterly
    # -------------------------
    elif period == "quarterly":

        for income in incomes:
            quarter = ((income.income_date.month - 1) // 3) + 1
            key = f"{income.income_date.year}-Q{quarter}"

            if key not in trends:
                trends[key] = {
                    "period": key,
                    "income": 0,
                    "expenses": 0
                }

            trends[key]["income"] += income.amount

        for expense in expenses:
            quarter = ((expense.expense_date.month - 1) // 3) + 1
            key = f"{expense.expense_date.year}-Q{quarter}"

            if key not in trends:
                trends[key] = {
                    "period": key,
                    "income": 0,
                    "expenses": 0
                }

            trends[key]["expenses"] += expense.amount

    # -------------------------
    # Yearly
    # -------------------------
    elif period == "yearly":

        for income in incomes:
            key = str(income.income_date.year)

            if key not in trends:
                trends[key] = {
                    "period": key,
                    "income": 0,
                    "expenses": 0
                }

            trends[key]["income"] += income.amount

        for expense in expenses:
            key = str(expense.expense_date.year)

            if key not in trends:
                trends[key] = {
                    "period": key,
                    "income": 0,
                    "expenses": 0
                }

            trends[key]["expenses"] += expense.amount

    # Sort chronologically
    result = list(trends.values())
    result.sort(key=lambda item: item["period"])

    return result    