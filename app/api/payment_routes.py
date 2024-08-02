from flask import Blueprint,jsonify, request
from flask_login import login_required,current_user
from app.models.db import db, environment, SCHEMA
from ..models.payment import Payment
from ..forms.payments_form import PaymentForm


payment_router = Blueprint('payments', __name__,  url_prefix='/payments')



@payment_router.route("/all")
@login_required
def all_payments():

    payments = Payment.query.filter_by(id=current_user.id).all()

    payments_list = [payment.to_dict() for payment in payments]

    return jsonify(payments_list)


@payment_router.route("/create")
def create_payment():

    fake_data = {
        'amount': 123.45,
        'payee_id': 3,
        'status': 'pending'
    }

    # Parse JSON data from the request
    # data = request.get_json() or fake_data
    data = fake_data


    form = PaymentForm(data = data)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate():
        # Create a new Payment object
        new_payment = Payment(
            amount=form.amount.data,
            payee_id=form.payee_id.data,
            status=form.status.data,
            payer_id=current_user.id  # Using payer_id to represent the current user
        )

        # Add the new payment to the session
        db.session.add(new_payment)

        # Commit the session to save the new payment in the database
        try:
            db.session.commit()
            return jsonify({"message": "Payment created successfully", "payment": new_payment.to_dict()}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500


    return jsonify({"errors": form.errors}), 400
