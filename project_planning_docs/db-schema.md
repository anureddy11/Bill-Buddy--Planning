
# Database Schema

## Tables

### users

| Column      | Type      | Details                       |
|-------------|-----------|-------------------------------|
| id          | integer   | primary key                   |
| username    | string    | not null                      |
| firstName   | string    | not null                      |
| lastName    | string    | not null                      |
| email       | string    | not null, unique              |
| created_at  | datetime  |                               |
| updated_at  | datetime  |                               |

### friends

| Column      | Type      | Details                        |
|-------------|-----------|--------------------------------|
| id          | integer   | primary key                    |
| friendId    | integer   | ref: > users.id, not null      |
| created_at  | datetime  |                                |
| updated_at  | datetime  |                                |

### groups

| Column      | Type      | Details                        |
|-------------|-----------|--------------------------------|
| id          | integer   | primary key                    |
| name        | string    | not null                       |
| organizerId | integer   | ref: > users.id, not null      |
| created_at  | datetime  |                                |
| updated_at  | datetime  |                                |

### members

| Column      | Type      | Details                        |
|-------------|-----------|--------------------------------|
| id          | integer   | primary key                    |
| groupId     | integer   | ref: > groups.id, not null     |
| userId      | integer   | ref: > users.id, not null      |
| created_at  | datetime  | not null                       |
| updated_at  | datetime  | not null                       |

### comments

| Column      | Type      | Details                        |
|-------------|-----------|--------------------------------|
| id          | integer   | primary key                    |
| content     | string    | not null                       |
| userId      | integer   | ref: > users.id, not null      |
| expenseId   | integer   | ref: > expenses.id, not null   |
| created_at  | datetime  | not null                       |
| updated_at  | datetime  | not null                       |

### payments

| Column      | Type      | Details                        |
|-------------|-----------|--------------------------------|
| id          | integer   | primary key                    |
| payerId     | integer   | ref: > users.id, not null      |
| payeeId     | integer   | ref: > users.id, not null      |
| status      | varchar   | not null                       |
| amount      | integer   | not null                       |
| commentId   | integer   | ref: > comments.id             |
| created_at  | datetime  |                                |
| updated_at  | datetime  |                                |

### expenses

| Column      | Type      | Details                        |
|-------------|-----------|--------------------------------|
| id          | integer   | primary key                    |
| description | varchar   |                                |
| payerId     | integer   | ref: > users.id, not null      |
| groupId     | integer   | ref: > groups.id               |
| amount      | integer   | not null                       |
| created_at  | datetime  |                                |
| updated_at  | datetime  |                                |

### expense_shares

| Column      | Type      | Details                        |
|-------------|-----------|--------------------------------|
| id          | integer   | primary key                    |
| expenseId   | integer   | ref: > expenses.id, not null   |
| amount      | integer   |                                |
| settled     | boolean   |                                |
| recurring   | boolean   |                                |
| userId      | integer   | ref: > users.id, not null      |
