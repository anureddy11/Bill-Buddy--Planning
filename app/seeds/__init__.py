from flask.cli import AppGroup
from .users import seed_users, undo_users
# from .payments import seed_payments, undo_payments
from .friends import seed_friends, undo_friends
# from .expenses import seed_expenses, undo_expenses
# from .expenseShares import seed_expense_shares, undo_expense_shares
# from .comments import seed_comments, undo_comments

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
    seed_users()
    # seed_payments()
    seed_friends()
    # seed_expenses()
    # seed_expense_shares()
    # seed_comments()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    # undo_payments()
    undo_friends()
    # undo_expenses()
    # undo_expense_shares()
    # undo_comments()
    # Add other undo functions here
