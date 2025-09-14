
# Kunal's Store Rating

A full-stack platform for rating stores, featuring user, owner, and admin roles.

## Features

🔑 Authentication & Authorization (JWT-based, role-specific access).

🏪 Store Management (owners can add/edit stores).

⭐ Ratings & Reviews (users can leave ratings).

👨‍💼 Admin Dashboard (manage users, owners, and reviews).

📊 Database with Migrations & Seeders (PostgreSQL).

## Prerequisites

- Node.js (v16 or above recommended)
- npm (comes with Node.js)
- PostgreSQL (or compatible database)

## Getting Started

### 1. Clone the Repository

```sh
git clone <project-repo-url>
cd kunal's-store-rating
```

### 2. Install Dependencies

Install dependencies for both backend and frontend:

```sh
cd backend
npm install

cd ../frontend
npm install
```

### 3. Set Up Environment Variables

- Create a `.env` file inside the `backend` directory.
- Copy `.env.example` to `.env` in the backend folder.
- Update database credentials, JWT secret, and other settings as needed:
	- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
	- `JWT_SECRET`
	- `PORT`

### 4. Set Up the Database

Ensure PostgreSQL is running. Run migrations and seed initial data:

```sh
cd backend
node run-migrations.js
node seeders/seed-initial-data.js
```

### 5. Start the Backend Server

```sh
cd backend
npm run dev
# or
npm start
# or
npx nodemon index.js
```

Backend runs on [http://localhost:5000](http://localhost:5000)

### 6. Start the Frontend

```sh
cd frontend
npm start
```

Frontend runs on [http://localhost:3000](http://localhost:3000)

### 7. Access the App

- Open your browser and go to [http://localhost:3000](http://localhost:3000)
- Register as a user, owner, or admin and start using the platform.

## Troubleshooting

- If you encounter errors, check your environment variables and database connection.
- Make sure both frontend and backend servers are running.

## Project Structure

- `backend/` - Node.js/Express API, database models, migrations, seeders
- `frontend/` - React app, UI components, pages

