# Todo List Web Application

A full-stack todo list application built with modern technologies.

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Rust** - Systems programming language
- **Axum** - Ergonomic web framework for Rust
- **SQLx** - Async SQL toolkit for Rust

### Database
- **MySQL** - Relational database (running in Docker)

## Project Organization

This project follows a **microservices architecture** with **separate frontend and backend repositories**. This separation provides:

- **Independent Development**: Frontend and backend teams can work independently
- **Separate Deployment**: Deploy frontend and backend to different servers/services
- **Technology Flexibility**: Each part can use its own tooling and dependencies
- **Scalability**: Scale frontend and backend independently based on needs

## Project Structure

### Frontend Structure (todo-list-frontend)

```
todo-list-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoForm.tsx
│   │   └── Filter.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useTodos.ts
│   ├── types/               # TypeScript type definitions
│   │   └── todo.ts
│   ├── api/                 # API client functions
│   │   └── todoApi.ts
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Static assets
│   └── vite.svg
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── .env.example
├── .gitignore
└── README.md
```

### Backend Structure (todo-list-backend)

```
todo-list-backend/
├── src/
│   ├── handlers/            # HTTP request handlers
│   │   └── todos.rs
│   ├── models/              # Data models
│   │   └── todo.rs
│   ├── db/                  # Database connection and queries
│   │   ├── mod.rs
│   │   └── pool.rs
│   ├── routes.rs            # API route definitions
│   ├── config.rs            # Configuration management
│   └── main.rs              # Application entry point
├── migrations/              # Database migrations
│   └── 20260103000000_create_todos_table.sql
├── Cargo.toml
├── Cargo.lock
├── .env.example
├── .gitignore
├── docker-compose.yml       # MySQL container configuration
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- Rust (latest stable)
- Docker and Docker Compose
- MySQL client (optional, for manual database access)

## Setup Instructions

### 1. Clone/Create Repositories

Create separate directories for frontend and backend:

```bash
# Create project directory
mkdir todo-list-app && cd todo-list-app

# Create frontend and backend directories
mkdir todo-list-frontend todo-list-backend
```

### 2. Backend Setup

#### Environment Configuration

Create a `.env` file in `todo-list-backend/`:

```env
# Database Configuration
DATABASE_URL=mysql://todouser:todopass@localhost:3306/tododb
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=tododb
MYSQL_USER=todouser
MYSQL_PASSWORD=todopass

# Backend Configuration
BACKEND_PORT=8000
RUST_LOG=debug
```

#### Start MySQL Database

```bash
cd todo-list-backend

# Start MySQL container
docker-compose up -d
```

#### Run Backend Server

```bash
# Install SQLx CLI (for migrations)
cargo install sqlx-cli --no-default-features --features mysql

# Run database migrations
sqlx migrate run

# Run the backend server
cargo run
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Environment Configuration

Create a `.env` file in `todo-list-frontend/`:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api
```

#### Run Frontend Application

```bash
cd todo-list-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Database Schema

### todos table

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AUTO_INCREMENT) | Unique identifier |
| title | VARCHAR(255) | Todo title |
| description | TEXT | Detailed description (optional) |
| completed | BOOLEAN | Completion status |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## API Endpoints

### Todos

- `GET /api/todos` - List all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `PATCH /api/todos/:id/toggle` - Toggle completion status

### Request/Response Examples

#### Create Todo
```bash
POST /api/todos
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

Response:
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-01-03T10:00:00Z",
  "updated_at": "2026-01-03T10:00:00Z"
}
```

## Development Workflow

### Running Tests

Backend:
```bash
cd todo-list-backend
cargo test
```

Frontend:
```bash
cd todo-list-frontend
npm test
```

### Building for Production

Backend:
```bash
cd todo-list-backend
cargo build --release

# The binary will be at: target/release/todo-list-backend
```

Frontend:
```bash
cd todo-list-frontend
npm run build

# The production build will be in the dist/ directory
```

### Database Management

Create a new migration:
```bash
cd todo-list-backend
sqlx migrate add <migration_name>
```

Revert last migration:
```bash
sqlx migrate revert
```

### Docker Compose Services

The `docker-compose.yml` file in the **backend** repository defines:

- **mysql**: MySQL 8.0 database server
  - Port: 3306
  - Persistent volume for data
  - Configured with environment variables

### Git Repositories

It's recommended to initialize separate git repositories:

```bash
# Backend repository
cd todo-list-backend
git init
git add .
git commit -m "Initial backend setup"

# Frontend repository
cd ../todo-list-frontend
git init
git add .
git commit -m "Initial frontend setup"
```

## Features

### Core Features
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Filter todos by status (all/active/completed)
- Persistent storage in MySQL database

### Frontend Features
- Responsive design with Tailwind CSS
- Real-time updates
- Loading and error states
- Form validation

### Backend Features
- RESTful API design
- CORS support for frontend
- Error handling and logging
- Database connection pooling
- Input validation

## Troubleshooting

### Database Connection Issues
- Ensure Docker MySQL container is running: `docker ps`
- Check DATABASE_URL in `todo-list-backend/.env` matches your configuration
- Verify MySQL port 3306 is not already in use: `lsof -i :3306` (macOS/Linux)
- Check Docker logs: `docker-compose logs mysql` (from backend directory)

### Frontend Build Issues
- Clear node_modules and reinstall:
  ```bash
  cd todo-list-frontend
  rm -rf node_modules package-lock.json
  npm install
  ```
- Clear Vite cache: `rm -rf node_modules/.vite`
- Verify API URL in `.env` matches backend port

### Backend Compilation Issues
- Update Rust toolchain: `rustup update`
- Clean build artifacts:
  ```bash
  cd todo-list-backend
  cargo clean && cargo build
  ```
- Ensure SQLx offline mode is prepared: `cargo sqlx prepare`

### CORS Issues
- Verify backend CORS configuration allows frontend origin (`http://localhost:5173`)
- Check browser console for specific CORS errors
- Ensure backend is running before making API requests from frontend

## Deployment Considerations

### Separate Deployment Strategy

With separate repositories, you can deploy frontend and backend independently:

**Frontend Deployment Options:**
- Vercel, Netlify, or Cloudflare Pages (recommended for Vite apps)
- AWS S3 + CloudFront
- GitHub Pages (for static hosting)

**Backend Deployment Options:**
- Railway, Render, or Fly.io (Rust-friendly platforms)
- AWS EC2 or ECS
- Docker container on any cloud provider
- Digital Ocean Droplets

**Database Deployment:**
- Managed MySQL services (AWS RDS, Google Cloud SQL, PlanetScale)
- Keep Docker MySQL for development only

**Environment Variables:**
- Update `VITE_API_URL` in frontend to point to production backend URL
- Update `DATABASE_URL` in backend to point to production MySQL instance
- Configure CORS in backend to allow production frontend domain

## Future Enhancements

- User authentication and authorization
- Todo categories/tags
- Due dates and reminders
- Search and advanced filtering
- Bulk operations
- Data export/import
- Dark mode support
- Docker containers for both frontend and backend
- CI/CD pipelines for automated testing and deployment
- API documentation with Swagger/OpenAPI

## License

MIT License
