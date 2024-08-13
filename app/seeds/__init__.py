from flask.cli import AppGroup
from .users import seed_users, undo_users
from .payments import seed_payments, undo_payments
from .friends import seed_friends, undo_friends
from .expenses import seed_expenses, undo_expenses
from .expenseShares import seed_expense_shares, undo_expense_shares
from .comments import seed_comments, undo_comments

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


    seed_friends()  # Assuming friends don't depend on other seeded data
    seed_expenses()  # Expenses should be seeded before expense shares
    seed_expense_shares()  # Expense shares depend on expenses
    seed_comments()  # Comments depend on users and expenses
    seed_payments()  # Payments should be last as they depend on comments, users, and possibly other data


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_payments()
    undo_comments()
    undo_expense_shares()
    undo_expenses()
    undo_friends()
    undo_users()
    # Add other undo functions here
