## Expenses

### Get all Expenses of the logged in user

Returns all of the pending and settled expenses that belong to the user.
* Require Authentication: true
* Request
  * Method: GET
  * URL: /api/expenses
  * Body: none

Successful Response when the user is loggen in.

* Status Code: 200
* Headers:
   * Content-Type: application/json
* Body:
```json
{
    "Expenses": [
        {
            "id": 1,
            "description": "This is the description of expense one.",
            "amount": 100.00,
            "expenseShares": [
            {
                "userId": 1,
                "amount": 33.33,
                "settled": true,
            },
            {
                "userId": 2,
                "amount": 33.33,
                "settled": false,
            },
            {
                "userId": 2,
                "amount": 33.34,
                "settled": false,
            }]
        },
        {
            "id":2,
            "description": "This is the description of the expense two.",
            "amount": 100.00,
            "expenseShares": [
            {
                "userId": 1,
                "amount": 33.33,
                "settled": true,
            },
            {
                "userId": 2,
                "amount": 33.33,
                "settled": false,
            },
            {
                "userId": 2,
                "amount": 33.34,
                "settled": false,
            }]
        }
    ]
}
```

### Creates new expense for the user and splits with selected users

* Require Authentication: true
* Request
  * Method: POST
  * URL: /api/expenses
  * Body:
```json
{
    "description": "Went to applebees for bachelor party",
    "ownerId": 1,
    "groupId": 1,
    "amount": 100,
    "split": [
        {"userId": 1, "amount": 33.33, "settled": true},
        {"userId": 2, "amount": 33.33, "settled": false},
        {"userId": 3, "amount": 33.34, "settled": false}
    ]
}
```
Successful Response when the user is loggen in.

* Status Code: 200
* Headers:
   * Content-Type: application/json
* Body:

```json
{
    "Expense": {
        "id": 1,
        "description": "Went to applebees for bachelor party",
        "amount": 100.00,
        "ownerId": 1
    },
    "Expense Shares": [
        {
            "userId": 1,
            "amount": 33.33,
            "settled": true,
        },
        {
            "userId": 2,
            "amount": 33.33,
            "settled": false,
        },
        {
            "userId": 2,
            "amount": 33.34,
            "settled": false,
        }
    ]
}
```

### Updates expense for the user and splits with selected friends.

* Require Authentication: true
* Request
  * Method: PUT
  * URL: /api/expenses/:expenseId
  * Body:
  ```json
    {
        "description": "updated the description",
        "amount": 200,
        "split": [
            {"userId": 1, "amount": 66.66, "settled": true},
            {"userId": 2, "amount": 66.67, "settled": false},
            {"userId": 3, "amount": 66.67, "settled": false}
        ]
    }

Successful response when user is logged in.

* Status Code: 200
* Headers:
   * Content-Type: application/json
* Body:
```json
    {
        "Expense": {
            "id": 1,
            "description": "updated the description",
            "amount": 200.00,
            "groupId": 1,
            "ownerId": 1
        },
        "Expense Shares": [
            {
                "userId": 1,
                "amount": 66.66,
                "settled": true,
            },
            {
                "userId": 2,
                "amount": 66.67,
                "settled": false,
            },
            {
                "userId": 2,
                "amount": 66.67,
                "settled": false,
            }
        ]
    }
```
### Deletes expense for the user when payments have not been made.

* Require Authentication: true
* Request
  * Method: DELETE
  * URL: /api/expenses/:expenseId
  * Body: none

Successful response when user is logged in.

* Status Code: 200
* Headers:
   * Content-Type: application/json
* Body:
  ```json
  {
    "message": "Successfully deleted"
  }
