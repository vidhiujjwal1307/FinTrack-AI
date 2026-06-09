
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
    print(expense)
    print(expense.date)
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
        "message": "Expense Added Successfully"
    }
@router.get("/expenses")
def get_expenses(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()

    return expenses

@router.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    updated_expense: ExpenseCreate,
    db: Session = Depends(get_db)
):
    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not expense:
        return {"message": "Expense Not Found"}

    expense.title = updated_expense.title
    expense.amount = updated_expense.amount
    expense.category = updated_expense.category
    expense.date = updated_expense.date


    db.commit()
    db.refresh(expense)

    return {"message": "Expense Updated"}

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if expense:
        db.delete(expense)
        db.commit()
        return {"message": "Expense Deleted"}

    return {"message": "Expense Not Found"}