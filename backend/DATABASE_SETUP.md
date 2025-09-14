# Database Setup Guide

## Prerequisites
1. Install PostgreSQL on your system
2. Make sure PostgreSQL service is running

## Setup Steps

### 1. Install PostgreSQL
If you don't have PostgreSQL installed:
- Download from: https://www.postgresql.org/download/
- During installation, remember the password you set for the 'postgres' user

### 2. Configure Database Credentials
Edit the `.env` file in the backend directory and update these values:

```env
# Database Configuration
POSTGRES_URL=postgresql://your_username:your_password@localhost:5432/store_rating_platform

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=5000

# Environment
NODE_ENV=development
```

Replace:
- `your_username` with your PostgreSQL username (default: `postgres`)
- `your_password` with your PostgreSQL password
- `your_super_secret_jwt_key_change_this_in_production` with a secure random string

### 3. Create Database
Run the database setup script:
```bash
node setup-db.js
```

### 4. Run Migrations
Create the tables:
```bash
node run-migrations.js
```

### 5. Seed Initial Data (Optional)
If you want to add some initial data:
```bash
npm run db:seed
```

### 6. Start the Server
```bash
npm run dev
```

## Troubleshooting

### Connection Issues
- Make sure PostgreSQL service is running
- Check if the credentials in `.env` are correct
- Verify the database name and port (default: 5432)

### Permission Issues
- Make sure your PostgreSQL user has permission to create databases
- On Windows, you might need to run PowerShell as Administrator

### Port Issues
- If port 5432 is already in use, change the port in your `.env` file and PostgreSQL configuration

## Database Schema
The application creates three main tables:
- `Users` - User accounts (ADMIN, USER, OWNER roles)
- `Stores` - Store information owned by users with OWNER role
- `Ratings` - Ratings given by users to stores
