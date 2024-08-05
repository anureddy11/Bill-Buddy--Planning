from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from sqlalchemy import and_, or_
from collections import OrderedDict
from ..models import db, Friend, User

friend_routes = Blueprint('friends', __name__)

# ROUTE TO GET ALL THE CURRENT USER'S FRIENDS
@friend_routes.route('/', methods=['GET'])
@login_required
def get_all_friends():
    """
    Returns the friends of the logged-in user.
    """
    friends = Friend.query.filter(
        and_(Friend.requester == current_user.id, Friend.status == 'accepted')
    ).all()

    friends_list = []
    for friend in friends:
        user = User.query.get(friend.user2_id)
        friends_list.append(OrderedDict([
            ("id", user.id),
            ("first_name", user.first_name),
            ("last_name", user.last_name),
            ("email", user.email)
        ]))

    return jsonify({"friends": friends_list})

# ROUTE TO REQUEST A NEW FRIEND
@friend_routes.route('/<int:friendId>/request', methods=['POST'])
@login_required
def request_friend(friendId):
    """
    Request a new friendship via friend ID.
    """
    # Check if the friend relationship already exists or is pending
    existing_friend = Friend.query.filter(
        or_(
            and_(Friend.user1_id == current_user.id, Friend.user2_id == friendId),
            and_(Friend.user1_id == friendId, Friend.user2_id == current_user.id)
        )
    ).first()

    if existing_friend:
        return jsonify({"message": "User is already a friend or request is pending"}), 400

    user = User.query.get(friendId)
    if not user:
        return jsonify({"message": "User with the specified ID couldn't be found"}), 404

    friend_request = Friend(
        user1_id=current_user.id,
        user2_id=friendId,
        requester=current_user.id,
        status='pending'
    )
    db.session.add(friend_request)
    db.session.commit()
    return jsonify({"friendId": friendId, "status": "pending"}), 200

# ROUTE TO ACCEPT INCOMING FRIEND REQUEST
@friend_routes.route('/<int:friendId>/accept', methods=['PUT'])
@login_required
def accept_friend(friendId):
    """
    Accepts a friend request.
    """
    friend_request = Friend.query.filter(
        or_(
            and_(Friend.user1_id == current_user.id, Friend.user2_id == friendId),
            and_(Friend.user1_id == friendId, Friend.user2_id == current_user.id)
        )
    ).first()

    if not friend_request or friend_request.status != 'pending':
        return jsonify({"message": "Friend request with the specified ID couldn't be found or is not pending"}), 404

    friend_request.status = 'accepted'
    db.session.commit()
    return jsonify({"friendId": friendId, "status": "accepted"}), 200

# ROUTE TO REJECT A FRIEND REQUEST
@friend_routes.route('/<int:friendId>/reject', methods=['PUT'])
@login_required
def reject_friend(friendId):
    """
    Reject a friend request.
    """
    friend_request = Friend.query.filter(
        or_(
            and_(Friend.user1_id == current_user.id, Friend.user2_id == friendId),
            and_(Friend.user1_id == friendId, Friend.user2_id == current_user.id)
        )
    ).first()

    if not friend_request or friend_request.status != 'pending':
        return jsonify({"message": "Friend request with the specified ID couldn't be found or is not pending"}), 404

    friend_request.status = 'rejected'
    db.session.commit()
    return jsonify({"friendId": friendId, "status": "rejected"}), 200



# ROUTE TO REMOVE A FRIEND
@friend_routes.route('/<int:friendId>', methods=['DELETE'])
@login_required
def remove_friend(friendId):
    """
    Removes an existing friend.
    """
    friend = Friend.query.filter(
        or_(
            and_(Friend.user1_id == current_user.id, Friend.user2_id == friendId),
            and_(Friend.user1_id == friendId, Friend.user2_id == current_user.id)
        )
    ).first()

    if not friend:
        return jsonify({"message": "Friend with the specified ID couldn't be found"}), 404

    db.session.delete(friend)
    db.session.commit()
    return jsonify({"message": "Successfully removed friend"}), 200
