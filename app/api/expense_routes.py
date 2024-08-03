from flask import Flask, render_template, redirect, Blueprint, jsonify
from flask_login import current_user, login_required
from app.models import Expense, ExpenseShare


expense_routes = Blueprint('expenses', __name__)


@expense_routes.route('/')
@login_required
def expenses():
    """
    Query for all expenses that belong to user
    """
    expenses = Expense.query.filter(current_user.id == Expense.owner_id).all()
    arr = {'expenses': [expense.to_dict() for expense in expenses]}
    y = 0

    for i in expenses:
        shares = ExpenseShare.query.filter(ExpenseShare.expense_id == i.id).all()
        i.expenseShares = []
        for j in shares:
            i.expenseShares.append({'user_id': j.user_id, "amount": j.amount, "settled": j.settled})
        arr['expenses'][y]['expenseShares'] = i.expenseShares
        y += 1

    return arr
