# Friends API Routes

This document provides the API routes for managing friend relationships in the application.

## Friends

### Get All Friends of the Logged-in User

Returns the friends of the logged-in user.

**Require Authentication**: True

* **Request**
  * **Method**: GET
  * **URL**: `/api/friends`
  * **Body**: None

* **Successful Response**
  * **Status Code**: 200
  * **Headers**:
    * `Content-Type: application/json`
  * **Body**:

    ```json
    {
      "friends": [
        {
          "id": 2,
          "firstName": "Clark",
          "lastName": "Adams",
          "username": "clark11",
          "email": "clark@gmal.com"
        },
        {
          "id": 3,
          "firstName": "John",
          "lastName": "Smith",
          "email": "jsmith@gmal.com"
        },
        {
          "id": 4,
          "firstName": "Jane",
          "lastName": "Doe",
          "email": "janeDoe@gmal.com"
        }
      ]
    }
    ```

### Request a Friend Connection

Request a new friendship via friend ID.

**Require Authentication**: True

* **Request**
  * **Method**: POST
  * **URL**: `/api/friends/:friendId/request`
  * **Headers**:
    * `Content-Type: application/json`
  * **Body**: None

* **Successful Response**
  * **Status Code**: 200
  * **Headers**:
    * `Content-Type: application/json`
  * **Body**:

    ```json
    {
      "friendId": 2,
      "status": "pending"
    }
    ```

* **Error Response: Couldn't Find a Friend with the Specified ID**
  * **Status Code**: 404
  * **Headers**:
    * `Content-Type: application/json`
  * **Body**:

    ```json
    {
      "message": "User with the specified ID couldn't be found"
    }
    ```

* **Error Response: Pending Friend Request Already Exists**
  * **Status Code**: 400
  * **Headers**:
    * `Content-Type: application/json`
  * **Body**:

    ```json
    {
      "message": "Friend request already requested"
    }
    ```

* **Error Response: Already Friends**
  * **Status Code**: 400
  * **Headers**:
    * `Content-Type: application/json`
  * **Body**:

    ```json
    {
      "message": "User is already a friend"
    }
    ```

### Accept a Friend Request

Accepts a friend request.

**Require Authentication**: True

* **Request**
  * **Method**: POST
  * **URL**: `/api/friends/:friendId/accept`
  * **Body**: None

* **Successful Response**
  * **Status Code**: 200
  * **Headers**:
    * `Content-Type: application/json`
  * **Body**:

    ```json
    {
      "friendId": 2,
      "status": "accepted"
    }
    ```

* **Error Response: Couldn't Find a Friend Request with the Specified ID**
  * **Status Code**: 404
  * **Headers**:
    * `Content-Type: application/json`
  * **Body**:

    ```json
    {
      "message": "Friend request with the specified ID couldn't be found"
    }
    ```

### Remove a Friend

Removes an existing friend.

**Require Authentication**: True

* **Request**
  * **Method**: DELETE
  * **URL**: `/api/friends/:friendId`
  * **Body**: None

* **Successful Response**
  * **Status Code**: 200
  * **Headers**:
    * `Content-Type: application/json`
  * **Body**:

    ```json
    {
      "message": "Successfully removed friend. Goodbye :)"
    }
    ```

* **Error Response: Couldn't Find a Friend with the Specified ID**
  * **Status Code**: 404
  * **Headers**:
    * `Content-Type: application/json`
  * **Body**:

    ```json
    {
      "message": "Friend with the specified ID couldn't be found"
    }
    ```
