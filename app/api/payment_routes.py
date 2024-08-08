from flask import Blueprint,jsonify, request
from flask_login import login_required,current_user
from app.models.db import db, environment, SCHEMA
from ..models.payment import Payment
from ..forms.payments_form import PaymentForm


payment_router = Blueprint('payments', __name__,  url_prefix='/payments')


#get all payments along with all the commetns
@payment_router.route("/all")
@login_required
def all_payments():

    payments_made = Payment.query.filter_by(payer_id=current_user.id).all()
    payments_recieved = Payment.query.filter_by(payee_id=current_user.id).all()

    all_payments = payments_made + payments_recieved

    payments_list = [payment.to_dict() for payment in all_payments]

    return jsonify(payments_list)


# create a payment
@payment_router.route("/create/", methods=["POST"])# need to add method =[Post]
@login_required
def create_payment():

    # fake_data = {  # remove this when going live and replace with request
    #     'amount': 123.45,
    #     'payee_id': 3,
    #     'status': 'pending'
    # }

    # Parse JSON data from the request
    data = request.get_json()
    # data = fake_data


    form = PaymentForm(data = data)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate():# change to validate_on_submit with front_end
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


#update a payment
@payment_router.route("/update/<int:payment_id>", methods=["PUT"]) # need to add method =[PUT]
@login_required
def update_payment(payment_id):
    # print(payment_id)
    # fake_data = {  # Remove this when going live and replace with request
    #     'amount': 123.45,
    #     'payee_id': 5,
    #     'status': 'completed'
    # }

    # Parse JSON data from the request
    data = request.get_json()
    # data = fake_data  # Replace with: data = request.get_json()
    form = PaymentForm(data=data)
    print(form.data)
    form['csrf_token'].data = request.cookies['csrf_token']


    if form.validate():# change to validate_on_submit with front_end
        # Fetch the payment record by ID
        payment = Payment.query.get(payment_id)
        if not payment:
            return jsonify({"error": "Payment not found"}), 404

        # Update the payment record with form data
        payment.amount = form.amount.data
        payment.payee_id = form.payee_id.data
        payment.status = form.status.data

        # Commit the changes to the database
        db.session.commit()
        return jsonify({"message": "Payment updated successfully", "payment": payment.to_dict()}), 200
    else:
        print("Form validation failed:", form.errors)
        return jsonify({"errors": form.errors}), 400



# Delete a payment
@payment_router.route("/delete/<int:payment_id>", methods=["DELETE"])
@login_required
def delete_payment(payment_id):
    # Fetch the payment record by ID
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    # Delete the payment record from the database
    db.session.delete(payment)
    db.session.commit()

    return jsonify({"message": "Payment deleted successfully"}), 200
