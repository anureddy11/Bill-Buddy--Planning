from app.models import db, User, environment, SCHEMA, ExpenseShare
from sqlalchemy.sql import text


def seed_expense_shares():
    # Assuming there are 3 users (with ids 1, 2, and 3) and each expense is split among them equally
    expenses = [
        {'expense_id': 1, 'description': 'Split lunch', 'settled': 'no', 'total_amount': 50.00},
        {'expense_id': 2, 'description': 'Split dinner', 'settled': 'yes', 'total_amount': 75.00},
        {'expense_id': 3, 'description': 'Split groceries', 'settled': 'no', 'total_amount': 120.00},
    ]

    shares = []
    for expense in expenses:
        amount_per_user = round(expense['total_amount'] / 3, 2)  # Round to 2 decimal places
        for user_id in range(1, 4):
            share = ExpenseShare(
                user_id=user_id,
                expense_id=expense['expense_id'],
                settled=expense['settled'],
                amount=amount_per_user
            )
            shares.append(share)

    db.session.add_all(shares)
    db.session.commit()

def undo_expense_shares():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expense_shares RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expense_shares"))

    db.session.commit()
