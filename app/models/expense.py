from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime





class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key = True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.String(500))
    settled = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # One-to-many relationship with ExpenseShare
    expense_shares = db.relationship('ExpenseShare', back_populates='expense')

    # Many-to-one relationship with User
    owner = db.relationship('User', back_populates='expenses')
