from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Expense, ExpenseShare, db, User

expense_routes = Blueprint('expenses', __name__)

def get_expense_details(expense):
    expense_dict = expense.to_dict()
    shares = ExpenseShare.query.filter_by(expense_id=expense.id).all()

    owner = User.query.get(expense.owner_id)
    expense_dict['ownerUsername'] = owner.username if owner else "Unknown"

    expense_dict['expenseShares'] = [
        {
            'user_id': share.user_id,
            'amount': share.amount,
            'settled': share.settled,
            'username': User.query.get(share.user_id).username
        } for share in shares
    ]
    return expense_dict

@expense_routes.route('/all', methods=['GET'])
@login_required
def get_all_user_expenses():
    """
    Get all expenses that the current user is involved in, either as the owner or as a share participant.
    """
    created_expenses = Expense.query.filter_by(owner_id=current_user.id).all()

    involved_expense_ids = db.session.query(ExpenseShare.expense_id).filter_by(user_id=current_user.id).all()
    involved_expense_ids = [id[0] for id in involved_expense_ids]

    involved_expenses = Expense.query.filter(Expense.id.in_(involved_expense_ids)).all()

    all_expenses = {expense.id: get_expense_details(expense) for expense in (created_expenses + involved_expenses)}

    return jsonify({"expenses": list(all_expenses.values())}), 200

@expense_routes.route('/', methods=['POST'])
@login_required
def create_expense():
    """
    Create a new expense and corresponding shares.
    """
    data = request.get_json()

    description = data.get('description')
    amount = data.get('amount')
    split = data.get('split')

    new_expense = Expense(
        owner_id=current_user.id,
        description=description,
        settled="no",
        amount=amount
    )
    db.session.add(new_expense)
    db.session.commit()

    for share in split:
        new_expense_share = ExpenseShare(
            user_id=share['user_id'],
            amount=share['amount'],
            settled=share['settled'],
            expense_id=new_expense.id
        )
        db.session.add(new_expense_share)

    db.session.commit()

    return jsonify(get_expense_details(new_expense)), 201

@expense_routes.route('/<int:expense_id>', methods=['DELETE'])
@login_required
def delete_expense(expense_id):
    """
    Delete an expense if it belongs to the current user.
    """
    expense = Expense.query.get(expense_id)

    if not expense or expense.owner_id != current_user.id:
        return jsonify({"error": "Unauthorized or expense not found."}), 403

    ExpenseShare.query.filter_by(expense_id=expense.id).delete()
    db.session.delete(expense)
    db.session.commit()

    return jsonify({"message": "Successfully deleted expense"}), 200

@expense_routes.route('/<int:expense_id>', methods=['PUT'])
@login_required
def update_expense(expense_id):
    """
    Update an expense and its shares.
    """
    data = request.get_json()
    expense = Expense.query.get(expense_id)

    if not expense or expense.owner_id != current_user.id:
        return jsonify({"error": "Unauthorized or expense not found."}), 403

    expense.description = data.get('description', expense.description)
    expense.amount = data.get('amount', expense.amount)
    expense.settled = data.get('settled', expense.settled)

    split = data.get('split')
    if split:
        ExpenseShare.query.filter_by(expense_id=expense.id).delete()
        for share in split:
            updated_share = ExpenseShare(
                user_id=share['user_id'],
                amount=share['amount'],
                settled=share['settled'],
                expense_id=expense.id
            )
            db.session.add(updated_share)

    db.session.commit()

    return jsonify(get_expense_details(expense)), 200
