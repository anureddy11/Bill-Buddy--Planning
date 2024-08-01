from app.models import User, db, Comment
from flask_login import current_user, login_required
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone

comment_routes = Blueprint('comment', __name__)

# Create a comment
@comment_routes.route('/<int:expenseId>/comments', methods=['POST'])
@login_required
def create_comment(expenseId):
    """
    Creates a new comment for the specified expense by expenseId
    """
    # Extract the JSON data
    data = request.get_json()
    content = data.get('content')
    
    
    # Error validation if no content is present with 400 status code
    if not content:
        return jsonify({
            "message": "Validation error",
            "errors": {"content": "Content is required"}
        }), 400
    
    # Create new instance of comment
    new_comment = Comment(
        user_id=current_user.id,
        expense_id=expenseId,
        content=content,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)        
    )
    
    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify(new_comment.to_dict()), 201
