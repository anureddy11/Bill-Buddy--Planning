## Friends

### Get all Friends of the logged in user

Returns the frienss of of the logged in user

* Require Authentication: false
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


### Request a friend connection with another user

Request a new membership

* Require Authentication: false
* Request
  * Method: POST
  * URL: /api/userId/:friendId/friendship
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
      "message": "user with id couldn't be found"
    }
    ```
* Error response: Current User already has a pending membership
  for the group
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Friend request all ready requested"
    }
    ```
* Error response: Current User is already an accepted member of the group
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User is already a friend"
    }
    ```
