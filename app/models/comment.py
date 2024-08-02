from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime, timezone


class Comment(db.Model):
    __tablename__ = "comments"
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('expenses.id')), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    #Relationship for user
    user = db.relationship('User', back_populates='comments')

    # Relationship with Payment
    payment = db.relationship('Payment', back_populates='comments')
    
    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'userId': self.user_id,
            'expenseId': self.expense_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'user': {
                'id': self.user.id,
                'username': self.user.username,
                'firstName': self.user.first_name,
                'lastName': self.user.last_name
            }
        }
