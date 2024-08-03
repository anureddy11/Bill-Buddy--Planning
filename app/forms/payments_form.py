from flask_wtf import FlaskForm
from wtforms import FloatField, IntegerField, StringField
from wtforms.validators import DataRequired

class PaymentForm(FlaskForm):
    amount = FloatField('Amount', validators=[DataRequired()])
    payee_id = IntegerField('Payee ID', validators=[DataRequired()])
    status = StringField('Status', validators=[DataRequired()])
