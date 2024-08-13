# Comments Frontend Routes

## /expenses/:expenseId/comments

### Comments page for a specific expense

This page displays all comments for a specific expense. If logged in, user can create a comment, update their existing comment, or delete their existing comment.

* `GET /api/expenses/:expenseId/comments`
    * Fetch and displays all comments for a specific expense
* `POST /expenses/:expenseId/comments`
    * Creates a new comment for a specific expense
* `PUT /expenses/:expenseId/comments/:commentId`
    * Updates an existing comment on a specific expense
* `DELETE /expenses/:expenseId/comments/:commentId`
    * Deletes an existing comment on a specific expense
