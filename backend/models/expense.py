from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from models.base import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    amount = Column(Float)
    category = Column(String)
    date = Column(Date)