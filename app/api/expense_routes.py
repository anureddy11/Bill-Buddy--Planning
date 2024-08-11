from flask import Flask, render_template, redirect, Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Expense, ExpenseShare, db, User


expense_routes = Blueprint('expenses', __name__)

def get_expense_by_id(expense_id):
    """
    get expense by id
    """

    expense = Expense.query.filter(Expense.id == expense_id)

    if not expense:
        return {
            "error": "expense does not exist"
        }
    return expense[0].to_dict()


@expense_routes.route('/')
@login_required
def expenses():
    """
    Query for all expenses that belong to user
    """
    expenses = Expense.query.filter(current_user.id == Expense.owner_id).all()
    user_shares = ExpenseShare.query.filter(current_user.id == ExpenseShare.user_id).all()
    user_shares_list = []

    for a in user_shares:
        expense_share_dict = a.to_dict()
        owner_expense = get_expense_by_id(expense_share_dict['expense_id'])
        expense_share_dict['description'] = owner_expense['description']
        user_shares_list.append(expense_share_dict)


    arr = [expense.to_dict() for expense in expenses]
    y = 0

    for i in expenses:
        shares = ExpenseShare.query.filter(ExpenseShare.expense_id == i.id).all()
        i.expenseShares = []
        for j in shares:
            user_info = User.query.filter(j.user_id == User.id).first()
            user_dict = user_info.to_dict()
            i.expenseShares.append({'user_id': j.user_id, "amount": j.amount, "settled": j.settled, "username": user_dict["username"]})
        arr[y]['expenseShares'] = i.expenseShares
        y += 1

    return_obj = {
        'expenses': arr,
        'shares': user_shares_list
    }
    return jsonify(return_obj), 200




@expense_routes.route('/', methods=['POST'])
@login_required
def create_expense():
    """
    Create and expense and create all split expenses

    """
    # Extract the JSON data
    data = request.get_json()
    description = data.get('description')
    owner_id = data.get('owner_id')
    amount = data.get('amount')
    split = data.get('split')

    # Create new expense
    new_expense = Expense(
        owner_id = owner_id,
        description = description,
        settled = "no",
        amount = amount
    )
    db.session.add(new_expense)
    db.session.commit()

    expense_id = new_expense.id
    share_list = []
    new_expense_dict = new_expense.to_dict()

    for i in split:
        new_expense_share = ExpenseShare(
            user_id = i['user_id'],
            amount = i['amount'],
            settled = i['settled'],
            expense_id = new_expense.id
        )

        db.session.add(new_expense_share)
        db.session.commit()
        json_share_list = new_expense_share.to_dict()
        share_list.append(json_share_list)


    return_obj = {
        "expense": new_expense_dict,
        "expense_shares": share_list
    }
    return jsonify(return_obj), 201


@expense_routes.route('/<int:expense_id>', methods=['PUT'])
@login_required
def update_expense(expense_id):
    """
    update expense and shares

    """
    # Extract the JSON data
    data = request.get_json()
    description = data.get('description')
    owner_id = data.get('owner_id')
    settled = data.get("settled")
    amount = data.get('amount')
    split = data.get('split')




    #update the expense and expense shares
    expense = Expense.query.filter(Expense.id == expense_id).first()

    # check if user owns the expense
    if (current_user.id != expense.owner_id):
        return {
            "error": "User not authorized."
        }

    expense.description = description
    expense.amount = amount
    expense.split = split
    expense.settled = settled

    db.session.commit()

    exp_dict = expense.to_dict()

    expense_shares = ExpenseShare.query.filter(ExpenseShare.expense_id == expense.id).all()
    exp_share_list = []
    exp_share_dict = exp_share_list
    for i, j in zip(expense_shares, split):
        i.amount = j['amount']
        i.settled = j['settled']

        db.session.commit()
        exp_share_list.append(i.to_dict())

    return_obj = {
        "expense": exp_dict,
        "expense_shares": exp_share_dict
    }
    return jsonify(return_obj)


@expense_routes.route('/<int:expense_id>', methods=['DELETE'])
@login_required
def delete_expense(expense_id):
    """
    deletes expense and expense shares

    """
    # check if user owns the expense




    expense = Expense.query.filter(Expense.id == expense_id).first()
    expense_shares = ExpenseShare.query.filter(ExpenseShare.expense_id == expense_id).all()

    if not expense:
        return jsonify(
            {"error": "expense could not be found"}
        )

    if current_user.id != expense.owner_id:
        return {
            "error": "unauthorized user."
        }

    for i in expense_shares:
        db.session.delete(i)
        db.session.commit()

    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Successfully deleted expense"})
