# from app.models import db, User, environment, SCHEMA, Payment, Expense, ExpenseShare, Friend, Comment
# from sqlalchemy.sql import text

# def seed_comments():
#     comment1 = Comment(user_id=1, expense_id=1, content='Thanks for splitting the lunch!')
#     comment2 = Comment(user_id=2, expense_id=2, content='Dinner was great, thanks!')
#     comment3 = Comment(user_id=3, expense_id=3, content='Groceries split, much appreciated.')

#     db.session.add_all([comment1, comment2, comment3])
#     db.session.commit()

# def undo_comments():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM comments"))

#     db.session.commit()
