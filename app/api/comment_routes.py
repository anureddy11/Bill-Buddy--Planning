from app.models import User, db, Comment
from flask_login import current_user, login_required
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone

comment_routes = Blueprint('comment', __name__)

# Create a comment (CREATE)
@comment_routes.route('/<int:expenseId>/comments', methods=['POST'])
@login_required
def create_comment(expenseId):
    """
    Creates a new comment for the specified expense by expenseId
    """
    # Extract the JSON data
    data = request.get_json() # Converts JSON payload into dict
    content = data.get('content') # Extracts the 'content' key's value
    
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

# View All Comments on an Expense (READ)
@comment_routes.route('/<int:expenseId>/comments', methods=['GET'])
@login_required
def get_comments(expenseId):
    """
    Returns all comments belonging to a specific expense id
    """
    comments = Comment.query.filter_by(expense_id=expenseId).all()
    return jsonify({"comments": [comment.to_dict() for comment in comments]}), 200

# Update a comment (UPDATE)
@comment_routes.route('/<int:expenseId>/comments/<int:commentId>', methods=['PUT'])
@login_required
def update_comment(expenseId, commentId):
    """
    Updates and returns an existing comment based on commentId
    """
    
    # This will fetch primary key in comments table and match it with comment Id
    comment = Comment.query.get(commentId) 
    
    # Error validation if comment not found (404)
    if not comment or comment.expense_id != expenseId:
        return jsonify({
            "message": "Comment could not be found"
        }), 404
    
    # Authorization error (403)
    if comment.user_id != current_user.id:
        return jsonify({
            "message": "Forbidden. Not the authorized user"
        }), 403
    
    # Parse the JSON payload into python dict
    data = request.get_json()
    print(data)
    # Extract the 'content' key
    content = data.get('content')
    
    # Error validation if no content is present with 400 status code
    if not content:
        return jsonify({
            "message": "Validation error",
            "errors": {"content": "Content is required"}
        }), 400
    
    comment.content = content
    comment.updated_at = datetime.now(timezone.utc)
    
    db.session.commit()
    
    return jsonify(comment.to_dict()), 200
    
# Delete a comment (DELETE)
@comment_routes.route('/<int:expenseId>/comments/<int:commentId>', methods=['DELETE'])
@login_required
def delete_comment(expenseId, commentId):
    """
    Deletes an existing comment based on expense and comment id
    """
    comment = Comment.query.get(commentId)
    
    if not comment or comment.expense_id != expenseId:
        return jsonify({
            "message": "Comment could not be found"
        }), 404
    
    if comment.user_id != current_user.id:
        return jsonify({
            "message": "Forbidden"
        }), 403
    
    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({
        "message": "Successfully deleted comment"
    })
    
    
