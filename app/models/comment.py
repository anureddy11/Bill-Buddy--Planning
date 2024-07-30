from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime





class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    expense_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    #Relationship for user
    user = db.relationship('User', back_populates='comment')

    # Relationship with Payment
    payment = db.relationship('Payment', back_populates='comment')
