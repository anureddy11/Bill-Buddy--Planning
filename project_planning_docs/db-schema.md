# Database Schema

This document provides the schema for the `users`, `friends`, `comments`, `payments`, `expenses`, and `expense_shares` tables.

## Tables

### users

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| username    | string    | not null                    |
| first_name  | string    | not null                    |
| last_name   | string    | not null                    |
| email       | string    | not null, unique            |
| hashed_password| string | not null                    |
| created_at  | datetime  |                             |
| updated_at  | datetime  |                             |

### friends

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| user1_id    | integer   | ref: users.id, not null     |
| user2_id    | integer   | ref: users.id, not null     |
| requester   | integer   | not null                    |
| created_at  | datetime  |                             |
| updated_at  | datetime  |                             |

### comments

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| content     | string    | not null                    |
| user_id     | integer   | ref: users.id, not null     |
| expense_id  | integer   | ref: expenses.id, not null  |
| created_at  | datetime  | not null                    |
| updated_at  | datetime  | not null                    |

### payments

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| payer_id    | integer   | ref: users.id, not null     |
| payee_id    | integer   | ref: users.id, not null     |
| status      | varchar   | not null                    |
| amount      | integer   | not null                    |
| comment_id  | integer   | ref: comments.id            |
| created_at  | datetime  |                             |
| updated_at  | datetime  |                             |

### expenses

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| description | varchar   |                             |
| owner_id    | integer   | ref: users.id, not null     |
| amount      | integer   | not null                    |
| settled     | boolean   |                             |
| created_at  | datetime  |                             |
| updated_at  | datetime  |                             |

### expense_shares

| Column      | Type      | Details                     |
|-------------|-----------|-----------------------------|
| id          | integer   | primary key                 |
| expense_id  | integer   | ref: expenses.id, not null  |
| amount      | integer   |                             |
| settled     | boolean   |                             |
| user_id     | integer   | ref: users.id, not null     |
| created_at  | datetime  |                             |
| updated_at  | datetime  |                             |
