
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.expense import Expense
from schemas.expense_schemas import ExpenseCreate
from routes.auth_routes import verify_token

router = APIRouter()

def get_user_id(authorization: str = Header(None)):
    """Extract user_id from Authorization header"""
    if not authorization:
        # For backward compatibility, allow null user_id
        return None
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
        user_id = verify_token(token)
        return user_id
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token format")

@router.post("/expenses")
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    try:
        new_expense = Expense(
            user_id=user_id,
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
def get_expenses(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    try:
        if user_id:
            expenses = db.query(Expense).filter(Expense.user_id == user_id).all()
        else:
            # For backward compatibility, show all expenses without user_id
            expenses = db.query(Expense).filter(Expense.user_id == None).all()
        
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
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    try:
        if user_id:
            expense = db.query(Expense).filter(
                (Expense.id == expense_id) & (Expense.user_id == user_id)
            ).first()
        else:
            expense = db.query(Expense).filter(
                (Expense.id == expense_id) & (Expense.user_id == None)
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
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    try:
        if user_id:
            expense = db.query(Expense).filter(
                (Expense.id == expense_id) & (Expense.user_id == user_id)
            ).first()
        else:
            expense = db.query(Expense).filter(
                (Expense.id == expense_id) & (Expense.user_id == None)
            ).first()

        if expense:
            db.delete(expense)
            db.commit()
            return {"message": "Expense Deleted Successfully"}

        return {"error": "Expense Not Found"}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}