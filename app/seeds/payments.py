# from app.models import db, User, environment, SCHEMA, Payment, Expense, ExpenseShare, Friend, Comment
# from sqlalchemy.sql import text

# def seed_payments():
#     payment1 = Payment(
#         payer_id=1, payee_id=2, status='completed', amount=100.00, comment_id=1)
#     payment2 = Payment(
#         payer_id=2, payee_id=3, status='pending', amount=150.00, comment_id=2)
#     payment3 = Payment(
#         payer_id=3, payee_id=1, status='failed', amount=200.00, comment_id=3)

#     db.session.add(payment1)
#     db.session.add(payment2)
#     db.session.add(payment3)
#     db.session.commit()



# def undo_payments():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.payments RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM payments"))

#     db.session.commit()
