from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime





class Payment(db.Model):
    __tablename__ = "payments"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    payer_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    payee_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    payer = db.relationship('User', foreign_keys=[payer_id], back_populates='payments_as_payer')
    payee = db.relationship('User', foreign_keys=[payee_id], back_populates='payments_as_payee')

    # Define the relationship with Comment
    comments = db.relationship('Comment', back_populates='payment')


    def __repr__(self):
        return f"<Payement: {self.id} Payer: {self.payer_id} Payee: {self.payee_id} Amount: {self.amount}>"

    def to_dict(self):
        return {
            "id": self.id,
            "payer_id": self.payer_id,
            "payee_id": self.payee_id,
            "status": self.status,
            "amount": self.amount,
            "comments": self.comments.to_dict() if self.comments else None,  # Include comment details if present
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
