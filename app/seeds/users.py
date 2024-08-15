from app.models import db, User, environment, SCHEMA, Payment, Expense, ExpenseShare, Friend, Comment
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', first_name='Demo', last_name='User', password='password')
    marnie = User(
        username='marnie', email='marnie@aa.io', first_name='Marnie', last_name='Smith', password='password')
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', first_name='Bobbie', last_name='Garcia', password='password')


    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.commit()

#payment seeds

def seed_payments():
    payment1 = Payment(
        payer_id=1, payee_id=2, status='completed', amount=100.00, comment_id=1)
    payment2 = Payment(
        payer_id=2, payee_id=3, status='pending', amount=150.00, comment_id=2)
    payment3 = Payment(
        payer_id=3, payee_id=1, status='failed', amount=200.00, comment_id=3)

    db.session.add(payment1)
    db.session.add(payment2)
    db.session.add(payment3)
    db.session.commit()




# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()


def undo_payments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.payments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM payments"))

    db.session.commit()
