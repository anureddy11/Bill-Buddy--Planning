# Database Schema

This document provides the schema for the `users`, `friends`, `comments`, `payments`, `expenses`, and `expense_shares` tables.

## Tables

### users

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| username    | string    | not null                    |
| firstName   | string    | not null                    |
| lastName    | string    | not null                    |
| email       | string    | not null, unique            |
| createdAt  | datetime  |                             |
| updatedAt  | datetime  |                             |

### friends

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| sender      | integer   | ref: users.id, not null     |
| receiver    | integer   | ref: users.id, not null     |
| status      | string    |                             |
| createdAt  | datetime  |                             |
| updatedAt  | datetime  |                             |

### comments

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| content     | string    | not null                    |
| userId      | integer   | ref: users.id, not null     |
| expenseId   | integer   | ref: expenses.id, not null  |
| createdAt  | datetime  | not null                    |
| updatedAt  | datetime  | not null                    |

### payments

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| payerId     | integer   | ref: users.id, not null     |
| payeeId     | integer   | ref: users.id, not null     |
| status      | varchar   | not null                    |
| amount      | integer   | not null                    |
| commentId   | integer   | ref: comments.id            |
| createdAt  | datetime  |                             |
| updatedAt  | datetime  |                             |

### expenses

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| description | varchar   |                             |
| ownerId     | integer   | ref: users.id, not null     |
| amount      | integer   | not null                    |
| settled     | boolean   |                             |
| createdAt  | datetime  |                             |
| updatedAt  | datetime  |                             |

### expense_shares

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| expenseId   | integer   | ref: expenses.id, not null  |
| amount      | integer   |                             |
| settled     | boolean   |                             |
| userId      | integer   | ref: users.id, not null     |
| createdAt  | datetime  |                             |
| updatedAt  | datetime  |                             |
