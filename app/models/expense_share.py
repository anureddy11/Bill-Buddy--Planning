from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime
from sqlalchemy import Numeric


class ExpenseShare(db.Model):
    __tablename__ = "expense_shares"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)
    settled = db.Column(db.String(50), nullable=False)
    amount = db.Column(Numeric(precision=10, scale=2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Many-to-one relationship back to Expense
    expense = db.relationship('Expense', back_populates='expense_shares')

    # Define the relationship with User
    user = db.relationship('User', back_populates='expense_shares')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'expense_id': self.expense_id,
            'settled': self.settled,
            'amount': float(self.amount), 
        }
