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
    Returns the accepted friends and pending friend requests of the logged-in user.
    """
    accepted_friends = Friend.query.filter(
        and_(
            or_(Friend.user1_id == current_user.id, Friend.user2_id == current_user.id),
            Friend.status == 'accepted'
        )
    ).all()

    pending_requests = Friend.query.filter(
        and_(Friend.user2_id == current_user.id, Friend.status == 'pending')
    ).all()

    friends_list = []
    pending_list = []

    for friend in accepted_friends:
        user_id = friend.user1_id if friend.user1_id != current_user.id else friend.user2_id
        user = User.query.get(user_id)
        friends_list.append(OrderedDict([
            ("id", user.id),
            ("first_name", user.first_name),
            ("last_name", user.last_name),
            ("email", user.email),
            ("status", "accepted")
        ]))

    for request in pending_requests:
        user = User.query.get(request.user1_id)
        pending_list.append(OrderedDict([
            ("id", user.id),
            ("first_name", user.first_name),
            ("last_name", user.last_name),
            ("email", user.email),
            ("status", "pending")
        ]))

    return jsonify({
        "friends": friends_list,
        "pending_requests": pending_list
    })

# ROUTE TO REQUEST A NEW FRIEND
@friend_routes.route('/<username>/request', methods=['POST'])
@login_required
def request_friend(username):
    """
    Request a new friendship via username.
    """
    
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"message": "User with the specified username couldn't be found"}), 404

    friendId = user.id


    existing_friend = Friend.query.filter(
        or_(
            and_(Friend.user1_id == current_user.id, Friend.user2_id == friendId),
            and_(Friend.user1_id == friendId, Friend.user2_id == current_user.id)
        )
    ).first()

    if existing_friend:
        if existing_friend.status == 'rejected':
            existing_friend.status = 'pending'
            existing_friend.requester = current_user.id
            db.session.commit()
            return jsonify({"friendId": friendId, "status": "pending"}), 200
        elif existing_friend.status in ['pending', 'accepted']:
            return jsonify({"message": "User is already a friend or request is pending"}), 400

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
