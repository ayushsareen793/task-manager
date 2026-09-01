# Mini Task Management App

Full-stack task manager built with Node.js/Express/MongoDB (backend) and Next.js (frontend).

## Project Structure

```
task-manager/
├── backend/
│   ├── config/db.js
│   ├── controllers/authController.js
│   ├── controllers/taskController.js
│   ├── middleware/authMiddleware.js
│   ├── middleware/errorHandler.js
│   ├── models/User.js
│   ├── models/Task.js
│   ├── routes/authRoutes.js
│   ├── routes/taskRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── app/
    │   ├── login/page.js
    │   ├── register/page.js
    │   ├── dashboard/page.js
    │   ├── tasks/[id]/page.js
    │   ├── layout.js
    │   ├── page.js
    │   └── globals.css
    ├── components/
    │   ├── TaskCard.js
    │   ├── TaskForm.js
    │   └── DeleteConfirmModal.js
    ├── lib/
    │   ├── api.js
    │   └── auth.js
    ├── .env.local.example
    └── package.json
```

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local Mongo or MongoDB Atlas) and a JWT_SECRET
npm run dev
```

Runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# edit .env.local if your backend runs on a different URL
npm run dev
```

Runs on `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register a new user |
| POST | /api/auth/login | No | Log in, returns JWT |
| GET | /api/tasks | Yes | Get logged-in user's tasks (supports `?status=` and `?search=`) |
| GET | /api/tasks/:id | Yes | Get a single task |
| POST | /api/tasks | Yes | Create a task |
| PUT | /api/tasks/:id | Yes | Update a task |
| DELETE | /api/tasks/:id | Yes | Delete a task |

Send the JWT as `Authorization: Bearer <token>` on all `/api/tasks` requests.

## Technical Decisions

- **Separate backend/frontend** rather than Next.js API routes, to match the Express.js requirement directly and keep concerns cleanly split for grading.
- **Password hashing** via bcryptjs (10 salt rounds); the password field uses `select: false` in the schema so it's never returned by default.
- **Authorization**: every task query is scoped with `{ userId: req.userId }` from the decoded JWT, and ownership is re-checked on get/update/delete so one user can never touch another user's tasks even by guessing an ID.
- **Centralized error handling** middleware normalizes Mongoose CastErrors, ValidationErrors, and duplicate-key errors into consistent JSON responses.
- **localStorage for the JWT** on the frontend for simplicity within the time constraint; a production app would use httpOnly cookies to reduce XSS exposure.

