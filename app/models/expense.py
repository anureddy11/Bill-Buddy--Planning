from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime, timezone




class Expense(db.Model):
    __tablename__ = "expenses"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key = True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    description = db.Column(db.String(500))
    settled = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.utcnow, nullable=False)

    # One-to-many relationship with ExpenseShare
    expense_shares = db.relationship('ExpenseShare', back_populates='expense')

    # Many-to-one relationship with User
    owner = db.relationship('User', back_populates='expenses')

    # One-to-many relationship with comments
    comments = db.relationship('Comment', back_populates='expense', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description,
            'settled': self.settled,
            'amount': self.amount,
        }
