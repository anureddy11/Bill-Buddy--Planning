## Friends

### Get all Friends of the logged in user

Returns the friends of the logged in user

* Require Authentication: True [changed from false to True]
* Request
  * Method: GET
  * URL: /api/friends
  * Body: none

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

 ```json
    {
      "Friends": [
        {
          "id": 2,
          "firstName": "Clark",
          "lastName": "Adams",
          "username": "clark11",
          "email":"clar@gmal.com"
        },
        {
          "id": 3,
          "firstName": "John",
          "lastName": "Smith",
          "email":"jsmith@gmal.com"
        },
        {
          "id": 4,
          "firstName": "Jane",
          "lastName": "Doe",
          "email":"janeDoe@gmal.com"
        },
      ]
    }
  ```


### Request a friend connection with another user

Request a new friendship via friendId

* Require Authentication: True [changed from False to True]
* Request
  * Method: POST
  * URL: /api/friends/:friendId/request
  * Headers:
    * Content-Type: application/json
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "friendId": 2,
      "status": "pending"
    }
    ```
* Error response: Couldn't find a Friend with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User with the specified id couldn't be found"
    }
    ```
* Error response: Current User already has a pending friend request
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Friend request already requested"
    }
    ```
* Error response: Current User is already friends with the user
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User is already a friend"
    }
    ```

### Accept a friend request

Accepting a friend request.

* Require Authentication: True 
* Request
  * Method: POST
  * URL: /api/friends/:friendId/accept
  * Body: none

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body: 
  
  ```json
  {
    "friendId": 2,
    "status": "accepted"
  }
  ```
* Error response: Couldn't find a friend request with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Friend request with the specified id couldn't be found"
    }
    ```

### Remove a friend

Remove an existing friend.

* Request
  * Method: DELETE
  * URL: /api/friends/:friendId
  * Headers:
    * Content-Type: application/json
  * Body: none
  
* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body: 
  
    ```json
    {
      "message": "Successfully removed friend. Goodbye :) "
    }
    ```

* Error response: Couldn't find a Friend with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
  
  ```json
    {
      "message": "Friend with the specified id couldn't be found"
    }
  ```
