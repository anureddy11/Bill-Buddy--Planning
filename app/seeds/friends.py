from app.models import db, User, environment, SCHEMA, Payment, Expense, ExpenseShare, Friend, Comment
from sqlalchemy.sql import text

def seed_friends():
    friend1 = Friend(user1_id=1, user2_id=2, requester=1, status='accepted')
    friend2 = Friend(user1_id=2, user2_id=3, requester=2, status='pending')
    friend3 = Friend(user1_id=1, user2_id=3, requester=3, status='rejected')

    db.session.add(friend1)
    db.session.add(friend2)
    db.session.add(friend3)
    db.session.commit()

def undo_friends():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends"))

    db.session.commit()
