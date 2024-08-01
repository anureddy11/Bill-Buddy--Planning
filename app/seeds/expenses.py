from app.models import db, User, environment, SCHEMA, Payment, Expense, ExpenseShare, Friend, Comment
from sqlalchemy.sql import text



def seed_expenses():
    expense1 = Expense(owner_id=1, description='Lunch', settled='no', amount=50.00)
    expense2 = Expense(owner_id=2, description='Dinner', settled='yes', amount=75.00)
    expense3 = Expense(owner_id=3, description='Groceries', settled='no', amount=120.00)

    db.session.add(expense1)
    db.session.add(expense2)
    db.session.add(expense3)
    db.session.commit()

def undo_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expenses"))

    db.session.commit()
