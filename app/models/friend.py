from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class Friend(db.Model):
    __tablename__ = 'friends'

    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    requester = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user1 = db.relationship('User', foreign_keys=[user1_id], back_populates='friends_as_uid1')
    user2 = db.relationship('User', foreign_keys=[user2_id], back_populates='friends_as_uid2')

    # @validates('requester')
    # def validate_requested(self, key, value):
    #     if value != self.uid1 and value != self.uid2:
    #         raise ValueError("Requested must be either uid1 or uid2")
    #     return value
