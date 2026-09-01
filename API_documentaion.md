# API Documentation — Mini Task Management App

## Base URL

```text
http://localhost:5000/api
```

All protected endpoints require a JWT token:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Authentication APIs

### Register User

**POST** `/auth/register`

Creates a new user account.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Success Response — 201

```json
{
  "message": "User registered successfully"
}
```

#### Possible Errors

* `400` — Validation error / missing fields
* `400` — User with the email already exists

---

### Login User

**POST** `/auth/login`

Authenticates a user and returns a JWT token.

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Success Response — 200

```json
{
  "token": "<JWT_TOKEN>"
}
```

The returned token must be included in the `Authorization` header for protected task APIs.

#### Possible Errors

* `400` — Invalid email or password
* `400` — Missing required fields

---

# 2. Task APIs

All task APIs require authentication.

```text
Authorization: Bearer <JWT_TOKEN>
```

---

### Get All Tasks

**GET** `/tasks`

Returns all tasks belonging to the currently authenticated user.

#### Optional Query Parameters

| Parameter | Description                   |
| --------- | ----------------------------- |
| `status`  | Filter tasks by status        |
| `search`  | Search tasks by relevant text |

#### Example

```text
GET /api/tasks?status=pending
```

or

```text
GET /api/tasks?search=assignment
```

#### Success Response — 200

```json
{
  "tasks": [
    {
      "_id": "64abc123...",
      "title": "Complete assignment",
      "description": "Finish the task manager assignment",
      "status": "pending",
      "userId": "64xyz456..."
    }
  ]
}
```

#### Possible Errors

* `401` — Unauthorized / missing or invalid JWT

---

### Get Single Task

**GET** `/tasks/:id`

Returns a specific task belonging to the authenticated user.

#### Example

```text
GET /api/tasks/64abc123
```

#### Success Response — 200

```json
{
  "_id": "64abc123...",
  "title": "Complete assignment",
  "description": "Finish the task manager assignment",
  "status": "pending",
  "userId": "64xyz456..."
}
```

#### Possible Errors

* `401` — Unauthorized
* `404` — Task not found
* `400` — Invalid task ID

---

### Create Task

**POST** `/tasks`

Creates a new task for the authenticated user.

#### Request Body

```json
{
  "title": "Complete assignment",
  "description": "Finish the task manager assignment",
  "status": "pending"
}
```

#### Success Response — 201

```json
{
  "_id": "64abc123...",
  "title": "Complete assignment",
  "description": "Finish the task manager assignment",
  "status": "pending",
  "userId": "64xyz456..."
}
```

#### Possible Errors

* `400` — Validation error
* `401` — Unauthorized

---

### Update Task

**PUT** `/tasks/:id`

Updates an existing task belonging to the authenticated user.

#### Example

```text
PUT /api/tasks/64abc123
```

#### Request Body

```json
{
  "title": "Complete assignment",
  "description": "Assignment completed",
  "status": "completed"
}
```

#### Success Response — 200

```json
{
  "_id": "64abc123...",
  "title": "Complete assignment",
  "description": "Assignment completed",
  "status": "completed",
  "userId": "64xyz456..."
}
```

#### Possible Errors

* `400` — Validation error / invalid task ID
* `401` — Unauthorized
* `404` — Task not found

---

### Delete Task

**DELETE** `/tasks/:id`

Deletes a task belonging to the authenticated user.

#### Example

```text
DELETE /api/tasks/64abc123
```

#### Success Response — 200

```json
{
  "message": "Task deleted successfully"
}
```

#### Possible Errors

* `401` — Unauthorized
* `404` — Task not found
* `400` — Invalid task ID

---

# Authentication Flow

1. Register a new user using `POST /auth/register`.
2. Login using `POST /auth/login`.
3. Copy the JWT token returned by the login API.
4. Include the token in the `Authorization` header for task requests.

Example:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

# Error Response Format

The API returns errors as JSON.

Example:

```json
{
  "message": "Task not found"
}
```

Validation errors may contain additional information depending on the type of validation failure.

---

# Security

* Passwords are hashed using `bcryptjs`.
* Passwords are never returned in API response.
* JWT authentication protects all task endpoints.
* Every task operation is scoped to the authenticated user's `userId`.
* Users cannot access, update, or delete another user's tasks by guessing a task ID.
* Invalid MongoDB IDs and validation errors are handled by centralized error-handling middlewares.
