# **Database Schema**

## `users`

| column name | data type | details                   |
|-------------|-----------|---------------------------|
| id          | integer   | not null, primary key     |
| username    | string    | not null,                 |
| firstName    | string    | not null,                 |
| lastName    | string    | not null,                 |
| email       | string    | not null, indexed, unique |
| created_at  | datetime  | not null                  |
| updated-at  | datetime  | not null                  |

## `friends`

| column name | data type | details                   |
|-------------|-----------|---------------------------|
| id          | integer   | not null, primary key     |
| friendId    | string    | not null, foreign key     |
| created_at  | datetime  | not null                  |
| updated-at  | datetime  | not null                  |

* `friendId` references `users` table

## `groups`

| column name | data type | details               |
|-------------|-----------|-----------------------|
| id          | integer   | not null, primary key |
| name        |  string   | not null              |
| organizerId      | integer   | not null, foreign key |
| created_at  | datetime  | not null              |
| updated-at  | datetime  | not null              |

* `organizerId` references `users` table

## `memberss`

| column name | data type | details                   |
|-------------|-----------|---------------------------|
| id          | integer   | not null, primary key     |
| groupId    | integer    | not null, foreign key     |
| userId    | integer    | not null, foreign key     |
| status    | string    | not null    |
| created_at  | datetime  | not null                  |
| updated-at  | datetime  | not null                  |

* `userId` references `users` table
* `groupId` references `groupss` table

## `comments`

| column name   | data type | details               |
|---------------|-----------|-----------------------|
| id            | integer   | not null, primary key |
| content       | string    | not null              |
| userId        | integer   | not null, foreign key |
| expenseId     | integer   | not null, foreign key |
<!-- | commentId     | integer   | not null, foreign key | -->
| created_at    | datetime  | not null              |
| updated-at    | datetime  | not null              |

* `userId` references `users` table
<!-- * `commentId` references `comments` table -->
* `expenseId` references `expense` table

## `payments`

| column name   | data type | details                        |
|---------------|-----------|--------------------------------|
| id            | integer   | not null, primary key          |
| payerId        | integer   | not null, indexed, foreign key |
| payeeId        | integer   | not null, indexed, foreign key |
| status        | varchar   | not null                       |
| amount        | integer   | not null                       |
| commentId     | integer   | indexed, foreign key           |
| created_at    | datetime  | not null              |
| updated-at    | datetime  | not null              |

* `payerId` references `users` table
* `payeeId` references `users` table
* `commentId` references `comments` table

## `expense`

| column name   | data type | details                        |
|---------------|-----------|--------------------------------|
| id            | integer   | not null, primary key          |
| description   | varchar   | not null                       |
| payerId       | integer   | not null, indexed, foreign key |
| groupId       | integer   | not null, indexed, foreign key |
| amount        | integer   | not null                       |
| created_at    | datetime  | not null                      |
| updated-at    | datetime  | not null                       |

* `userId` references `users` table
* `expenseId` references `expense` table


## `expense-shares`

| column name   | data type | details                        |
|---------------|-----------|--------------------------------|
| id            | integer   | not null, primary key          |
| expenseId     | integer   | not null, indexed, foreign key |
| userId        | integer   | not null, indexed, foreign key |
<!-- | type          | varchar, splitting ration recurring or single   | not null -->
| amount        | integer   | not null                       |
| settled       | varchar    | not null                       |
| created_at    | datetime  | not null                      |
| updated-at    | datetime  | not null                       |

* `userId` references `users` table
* `expenseId` references `payments` table
