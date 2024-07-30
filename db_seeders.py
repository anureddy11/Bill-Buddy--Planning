from app import app
from app.models import db, User, Payment, Friend, ExpenseShare, Comment, Expense


with app.app_context():

    db.drop_all()
    print("dropped all tables")

    db.create_all()
    print("created all tables")

    demo = User(
        username='Demo', email='demo@aa.io', password='password')
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password')
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password')
