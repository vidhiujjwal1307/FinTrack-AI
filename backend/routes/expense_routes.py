
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.expense import Expense
from schemas.expense_schemas import ExpenseCreate

router = APIRouter()

@router.post("/expenses")
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db)
):
    try:
        new_expense = Expense(
            title=expense.title,
            amount=expense.amount,
            category=expense.category,
            date=expense.date
        )

        db.add(new_expense)
        db.commit()
        db.refresh(new_expense)

        return {
            "id": new_expense.id,
            "title": new_expense.title,
            "amount": new_expense.amount,
            "category": new_expense.category,
            "date": str(new_expense.date),
            "message": "Expense Added Successfully"
        }
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
@router.get("/expenses")
def get_expenses(db: Session = Depends(get_db)):
    try:
        expenses = db.query(Expense).all()
        return [
            {
                "id": expense.id,
                "title": expense.title,
                "amount": expense.amount,
                "category": expense.category,
                "date": str(expense.date)
            }
            for expense in expenses
        ]
    except Exception as e:
        return {"error": str(e)}

@router.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    updated_expense: ExpenseCreate,
    db: Session = Depends(get_db)
):
    try:
        expense = db.query(Expense).filter(
            Expense.id == expense_id
        ).first()

        if not expense:
            return {"error": "Expense Not Found"}

        expense.title = updated_expense.title
        expense.amount = updated_expense.amount
        expense.category = updated_expense.category
        expense.date = updated_expense.date

        db.commit()
        db.refresh(expense)

        return {
            "id": expense.id,
            "title": expense.title,
            "amount": expense.amount,
            "category": expense.category,
            "date": str(expense.date),
            "message": "Expense Updated Successfully"
        }
    except Exception as e:
        db.rollback()
        return {"error": str(e)}

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    try:
        expense = db.query(Expense).filter(
            Expense.id == expense_id
        ).first()

        if expense:
            db.delete(expense)
            db.commit()
            return {"message": "Expense Deleted Successfully"}

        return {"error": "Expense Not Found"}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}