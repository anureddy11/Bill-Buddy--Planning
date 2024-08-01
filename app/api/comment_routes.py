from app.models import User, db, Comment
from flask_login import current_user, login_required
from flask import Blueprint, request, jsonify
from datetime import datetime

comment_routes = Blueprint('comment', __name__)

# Create a comment
@comment_routes.route('/api/')
@login_required
