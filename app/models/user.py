from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime
from .payment import Payment


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    first_name = db.Column(db.String(100))
    last_name =  db.Column(db.String(100))
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

  # Relationships for payments where the user is a payer and payee
    payments_as_payer = db.relationship('Payment', foreign_keys='Payment.payer_id', back_populates='payer')
    payments_as_payee = db.relationship('Payment', foreign_keys='Payment.payee_id', back_populates='payee')

    #Relationship for comment_id
    comments = db.relationship('Comment', back_populates='user')

  # Relationships for friends where the user is either uid1 or uid2
    friends_as_uid1 = db.relationship('Friend', foreign_keys='Friend.user1_id', back_populates='user1')
    friends_as_uid2 = db.relationship('Friend', foreign_keys='Friend.user2_id', back_populates='user2')

    # Relationships with expenses table
    expenses = db.relationship('Expense', back_populates='owner')

    # Relationships with expense_shares table
    expense_shares = db.relationship('ExpenseShare', back_populates='user')


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
