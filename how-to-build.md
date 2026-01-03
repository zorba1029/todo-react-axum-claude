# How to Build and Run the Todo List Application

This guide provides step-by-step instructions to build and run both the frontend and backend of the todo-list application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Rust** (latest stable) - [Install](https://rustup.rs/)
- **Docker** and **Docker Compose** - [Install](https://www.docker.com/get-started)
- **SQLx CLI** (for database migrations) - Will be installed in steps below

## Project Structure

```
todo-list/
├── frontend/          # React/TypeScript/Vite/Tailwind CSS application
├── backend/           # Rust/Axum API server
│   └── public/        # Static files (frontend build output)
├── build.sh           # Unified build script
└── how-to-build.md   # This file
```

## Deployment Modes

This application supports two deployment modes:

1. **Unified Deployment (Recommended for Production)**: Frontend and backend served from a single Axum server
2. **Separate Development**: Frontend and backend run separately for hot reload during development

---

## Option 1: Unified Deployment (Production)

This is the recommended approach for production. The backend serves both the API and the frontend static files.

### Quick Start

```bash
# 1. Start MySQL database
cd backend
docker-compose up -d

# 2. Set up environment and run migrations
cp .env.example .env
cargo install sqlx-cli --no-default-features --features mysql
sqlx migrate run

# 3. Build frontend and copy to backend
cd ..
./build.sh

# 4. Run the backend (serves both API and frontend)
cd backend
cargo run
```

Visit: **http://localhost:8000** (both frontend and API served from one server)

### Detailed Steps

#### 1. Database Setup

```bash
cd backend
cp .env.example .env
docker-compose up -d
```

#### 2. Install SQLx CLI and Run Migrations

```bash
cargo install sqlx-cli --no-default-features --features mysql
sqlx migrate run
```

#### 3. Build and Deploy

Use the provided build script:

```bash
cd ..
./build.sh
```

Or manually:

```bash
# Build frontend
cd frontend
npm install
npm run build

# Copy to backend
cd ..
rm -rf backend/public/*
cp -r frontend/dist/* backend/public/

# Run backend
cd backend
cargo run
```

#### 4. Access the Application

Open your browser to **http://localhost:8000**

- Frontend: `http://localhost:8000/`
- API: `http://localhost:8000/api/todos`

Both are served from the same server!

---

## Option 2: Separate Development Mode

For development with hot module replacement, run frontend and backend separately.

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Set Up Environment Variables

Copy the example environment file and update if needed:

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
DATABASE_URL=mysql://todouser:todopass@localhost:3306/tododb
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=tododb
MYSQL_USER=todouser
MYSQL_PASSWORD=todopass
BACKEND_PORT=8000
RUST_LOG=debug
```

### 3. Start MySQL Database

Start the MySQL container using Docker Compose:

```bash
docker-compose up -d
```

Verify the container is running:

```bash
docker ps
```

You should see a container named `todo-mysql` running.

### 4. Install SQLx CLI

Install the SQLx command-line tool for database migrations:

```bash
cargo install sqlx-cli --no-default-features --features mysql
```

### 5. Run Database Migrations

Apply the database migrations to create the `todos` table:

```bash
sqlx migrate run
```

You should see output indicating the migration was successful.

### 6. Build the Backend (Optional)

To build the backend without running:

```bash
cargo build
```

For a production-optimized build:

```bash
cargo build --release
```

### 7. Run the Backend Server

Start the backend server in development mode:

```bash
cargo run
```

The backend API will start and listen on `http://localhost:8000`.

You should see logs indicating:
- Database connection established
- Server listening on 0.0.0.0:8000

**Keep this terminal window open** while the backend runs.

## Frontend Setup (Development Mode)

### 1. Navigate to Frontend Directory

Open a **new terminal window** and navigate to the frontend directory:

```bash
cd frontend
```

### 2. Set Up Environment Variables

For development mode, set the API URL to point to the separate backend server:

```bash
cp .env.example .env
```

Edit `.env` to contain:

```env
VITE_API_URL=http://localhost:8000/api
```

**Note:** In unified deployment mode, this is not needed as the frontend uses relative URLs (`/api`).

### 3. Install Dependencies (if not already installed)

If you haven't installed dependencies yet:

```bash
npm install
```

### 4. Run the Frontend Development Server

Start the Vite development server:

```bash
npm run dev
```

The frontend application will start and be available at `http://localhost:5173`.

You should see output showing:
- Local: http://localhost:5173/
- Press `h` to show help

### 5. Build the Frontend for Production (Optional)

To create a production build:

```bash
npm run build
```

The production build will be created in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Accessing the Application (Development Mode)

When running in separate development mode:

1. **Open your web browser** and navigate to: `http://localhost:5173`
2. You should see the Todo List application with a beautiful gradient UI
3. The frontend (port 5173) will communicate with the backend API (port 8000)
4. Try creating, completing, and deleting todos!

## Stopping the Application

### Stop the Frontend

Press `Ctrl+C` in the terminal where `npm run dev` is running.

### Stop the Backend

Press `Ctrl+C` in the terminal where `cargo run` is running.

### Stop the MySQL Database

```bash
cd backend
docker-compose down
```

To stop and remove all data:

```bash
docker-compose down -v
```

## Troubleshooting

### Database Connection Issues

**Problem:** Backend fails to connect to MySQL

**Solutions:**
- Ensure Docker MySQL container is running: `docker ps`
- Check that port 3306 is not already in use: `lsof -i :3306` (macOS/Linux)
- Verify `DATABASE_URL` in `.env` matches your Docker configuration
- Check Docker logs: `docker-compose logs mysql`

### Frontend Cannot Connect to Backend

**Problem:** API requests fail or show CORS errors

**Solutions:**
- Ensure backend is running on port 8000
- Verify `VITE_API_URL` in frontend `.env` is `http://localhost:8000/api`
- Check browser console for specific error messages
- Ensure CORS is properly configured in backend (already set up)

### Port Already in Use

**Problem:** Port 8000 or 5173 is already in use

**Solutions:**
- For backend: Change `BACKEND_PORT` in `backend/.env`
- For frontend: Vite will automatically use the next available port
- Or stop the process using the port

### Rust Compilation Errors

**Problem:** Backend fails to compile

**Solutions:**
- Update Rust toolchain: `rustup update`
- Clean build artifacts: `cd backend && cargo clean && cargo build`
- Ensure all dependencies in `Cargo.toml` are correct

### Missing SQLx CLI

**Problem:** `sqlx` command not found

**Solutions:**
- Install SQLx CLI: `cargo install sqlx-cli --no-default-features --features mysql`
- Ensure Cargo bin directory is in your PATH: `export PATH="$HOME/.cargo/bin:$PATH"`

## Testing the API

You can test the API endpoints directly using `curl`:

### Create a Todo

```bash
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Todo", "description": "This is a test"}'
```

### Get All Todos

```bash
curl http://localhost:8000/api/todos
```

### Toggle a Todo

```bash
curl -X PATCH http://localhost:8000/api/todos/1/toggle
```

### Delete a Todo

```bash
curl -X DELETE http://localhost:8000/api/todos/1
```

## Development Tips

### Backend Hot Reload

For faster development, use `cargo-watch`:

```bash
cargo install cargo-watch
cargo watch -x run
```

### Frontend Hot Module Replacement

Vite automatically provides HMR. Just save your files and see changes instantly!

### Database Inspection

To inspect the MySQL database directly:

```bash
docker exec -it todo-mysql mysql -u todouser -p
# Enter password: todopass
```

Then run SQL queries:

```sql
USE tododb;
SELECT * FROM todos;
```

## Next Steps

- Add user authentication
- Implement todo categories
- Add due dates
- Create automated tests
- Set up CI/CD pipelines
- Deploy to production

Enjoy building with your Todo List application!
