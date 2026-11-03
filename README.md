# EventStream Observer

EventStream Observer is a full-stack webhook monitoring app for tracking incoming webhook events from external services, especially GitHub. It is built for developers and teams who need a simple way to create webhook endpoints, inspect the payload and headers, and monitor events in real time.

## Live demo

- Frontend URL: https://frontend-0wzs.onrender.com
- Backend URL: https://backend-ajsh.onrender.com

> Note: Render free-tier services may take about a minute to wake up after inactivity.

## Screenshots

Add screenshots here:

- Screenshot 1: Dashboard view
- Screenshot 2: Sources page
- Screenshot 3: GitHub webhook payload example

## Features

- Authentication with JWT-based login and protected routes
- Webhook source registration and management
- GitHub webhook signature verification using the shared secret
- Real-time event delivery with Socket.IO
- Event history retrieval from MongoDB
- Request and error logging with Winston and Morgan

## Tech stack

### Backend
- Node.js
- Express
- Socket.IO
- JWT authentication
- bcryptjs
- Mongoose
- Zod validation
- Winston logging
- Morgan HTTP logging
- dotenv

### Frontend
- React
- Vite
- React Router
- Axios
- socket.io-client

### Database
- MongoDB with Mongoose

### Libraries from package.json

Backend dependencies:
- `bcryptjs`
- `bullmq`
- `cors`
- `dotenv`
- `express`
- `ioredis`
- `jsonwebtoken`
- `mongoose`
- `morgan`
- `socket.io`
- `winston`
- `zod`

Frontend dependencies:
- `axios`
- `react`
- `react-dom`
- `react-router-dom`
- `socket.io-client`

## How it works

1. A user registers and logs in.
2. The user creates a webhook source from the app. The backend generates a unique endpoint path and a secret.
3. The backend stores the webhook source and its accepted event types in MongoDB.
4. External services send webhook payloads to `/api/webhook/:endPointPath`.
5. The backend validates the request, verifies GitHub signatures when needed, saves the event, and emits a Socket.IO event.
6. The frontend dashboard listens for `new-event` and updates the live event list immediately.


## API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/auth/me` | Validates the current JWT and returns whether the user is authenticated. |
| POST | `/api/auth/register` | Registers a new user. |
| POST | `/api/auth/login` | Logs in an existing user and returns a token. |
| POST | `/api/webhook/:endPointPath` | Receives an incoming webhook payload and stores it. |
| POST | `/api/sources` | Creates a new webhook source for a user. |
| GET | `/api/sources/my` | Lists sources registered to the logged-in user. |
| GET | `/api/sources/all` | Lists all webhook sources. |
| GET | `/api/sources/:sourceId` | Fetches a specific source by ID. |
| PUT | `/api/sources/:sourceId` | Toggles the active state of a source. |
| GET | `/api/events/user` | Returns recent events for the logged-in user. |
| GET | `/api/events/source/:sourceId` | Returns events for a specific source. |
| GET | `/api/events/:eventId` | Fetches one event by ID. |
| GET | `/api/events/filter` | Filters events by query params such as `eventType`, `status`, and `source`. |

## Getting started

### Prerequisites

- Node.js and npm
- MongoDB instance or MongoDB connection string
- A local environment or deployment target for the backend and frontend

### Clone the project

```bash
git clone https://github.com/vinothkumar-m18/EventStreamObserver.git
cd EventStreamObserver
```

### Backend

Install dependencies:

```bash
cd backend
npm install
```

Run the backend:

```bash
cd backend
npm run dev
```

You can also run the backend in production mode:

```bash
cd backend
npm start
```

### Frontend

Install dependencies:

```bash
cd frontend
npm install
```

Run the frontend:

```bash
cd frontend
npm run dev
```

## Environment variables

The backend reads environment variables using `dotenv.config()`. The code uses the following variables:

| Variable | Example value | Description |
| --- | --- | --- |
| `PORT` | `5000` | Port used by the backend server. |
| `MONGO_URI` | `mongodb+srv://username:password@cluster.example.mongodb.net/eventstream` | MongoDB connection string for the app database. |
| `JWT_SECRET` | `replace-with-a-long-random-secret` | Secret used to sign and verify JWT tokens. |
| `NODE_ENV` | `development` | Runtime environment flag used by the logger and app config. |
| `LOG_LEVEL` | `info` | Logging level used by Winston. |

> Do not commit real secret values. Use local placeholder values in your own `.env` file.

## How to test a webhook

1. Start the backend and frontend.
2. Log in to the app and go to the Sources page.
3. Create a new webhook source.
4. Copy the generated endpoint path and secret returned by the API.
5. In GitHub, open a repository and go to `Settings` -> `Webhooks` -> `Add webhook`.
6. Set the payload URL to the backend endpoint. Example:

```text
http://localhost:5000/api/webhook/<generated-endpoint-path>
```

7. Set the content type to `application/json`.
8. Paste the source secret into the secret field.
9. Select the events you want to receive. The code defines GitHub defaults for the app as:
   - `push`
   - `pull_request`
   - `issues`
   - `release`
10. Save the webhook.
11. Trigger a GitHub event such as a push or issue update.
12. Check the dashboard to see the event appear in real time.

