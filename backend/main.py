from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models.base import Base
from models.expense import Expense
from models.user import User

from routes.expense_routes import router as expense_router
from routes.auth_routes import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(expense_router)

@app.get("/")
def home():
    return {"message": "Finance Tracker API is running"}

@app.get("/debug/expenses")
def debug_expenses():
    from database import SessionLocal
    db = SessionLocal()
    expenses = db.query(Expense).all()
    db.close()
    return {
        "total": len(expenses),
        "expenses": [
            {
                "id": e.id,
                "title": e.title,
                "amount": e.amount,
                "category": e.category,
                "date": str(e.date)
            }
            for e in expenses
        ]
    }