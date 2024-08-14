from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models.db import db, environment, SCHEMA
from app.models.payment import Payment
from app.models.user import User  # Import the User model to fetch user details
from ..forms.payments_form import PaymentForm

payment_router = Blueprint('payments', __name__, url_prefix='/payments')

# Get all payments made by the current user
@payment_router.route("/made", methods=["GET"])
@login_required
def get_payments_made():
    """
    Get all payments made by the current user.
    """
    payments = Payment.query.filter_by(payer_id=current_user.id).all()

    payments_list = []
    for payment in payments:
        payee = User.query.get(payment.payee_id)
        payments_list.append({
            "id": payment.id,
            "amount": payment.amount,
            "status": payment.status,
            "payee_id": payment.payee_id,
            "payee_username": payee.username if payee else "Unknown"
        })

    return jsonify(payments_list)

# Get all payments received by the current user
@payment_router.route("/received", methods=["GET"])
@login_required
def get_payments_received():
    """
    Get all payments received by the current user.
    """
    payments = Payment.query.filter_by(payee_id=current_user.id).all()

    payments_list = []
    for payment in payments:
        payer = User.query.get(payment.payer_id)
        payments_list.append({
            "id": payment.id,
            "amount": payment.amount,
            "status": payment.status,
            "payer_id": payment.payer_id,
            "payer_username": payer.username if payer else "Unknown"
        })

    return jsonify(payments_list)

# Get all payments along with all the comments
@payment_router.route("/all")
@login_required
def all_payments():
    payments = Payment.query.filter(
        (Payment.payer_id == current_user.id) | (Payment.payee_id == current_user.id)
    ).all()

    payments_list = [payment.to_dict() for payment in payments]

    return jsonify(payments_list)

# Create a payment
@payment_router.route("/create", methods=["POST"])
@login_required
def create_payment():
    data = request.get_json()

    form = PaymentForm(data=data)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate():
        new_payment = Payment(
            amount=form.amount.data,
            payee_id=form.payee_id.data,
            status=form.status.data,
            payer_id=current_user.id
        )

        db.session.add(new_payment)

        try:
            db.session.commit()
            return jsonify({"message": "Payment created successfully", "payment": new_payment.to_dict()}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    return jsonify({"errors": form.errors}), 400

# Update a payment
@payment_router.route("/update/<int:payment_id>", methods=["PUT"])
@login_required
def update_payment(payment_id):
    data = request.get_json()
    form = PaymentForm(data=data)
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate():
        payment = Payment.query.get(payment_id)
        if not payment:
            return jsonify({"error": "Payment not found"}), 404

        payment.amount = form.amount.data
        payment.payee_id = form.payee_id.data
        payment.status = form.status.data

        db.session.commit()
        return jsonify({"message": "Payment updated successfully", "payment": payment.to_dict()}), 200
    else:
        return jsonify({"errors": form.errors}), 400

# Delete a payment
@payment_router.route("/delete/<int:payment_id>", methods=["DELETE"])
@login_required
def delete_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    db.session.delete(payment)
    db.session.commit()

    return jsonify({"message": "Payment deleted successfully"}), 200
