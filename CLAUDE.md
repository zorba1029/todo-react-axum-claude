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
- **Tower HTTP** - Static file serving for unified deployment

### Database
- **MySQL** - Relational database (running in Docker)

## Project Organization

This project uses a **monorepo architecture** with both frontend and backend in a single repository. The project supports two deployment modes:

1. **Unified Deployment (Recommended for Production)**: The backend Axum server serves both the API and frontend static files from a single server (port 8000)
2. **Separate Development Mode**: Frontend (port 5173) and backend (port 8000) run separately for hot module replacement during development

Benefits of this approach:
- **Simplified Deployment**: Single server serves everything in production
- **Flexible Development**: Hot reload for both frontend and backend during development
- **Version Synchronization**: Frontend and backend changes tracked together
- **Easy Testing**: End-to-end testing with a single server

## Project Structure

```
todo-list/
├── frontend/                # React/TypeScript/Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoForm.tsx
│   │   │   └── Filter.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useTodos.ts
│   │   ├── types/           # TypeScript type definitions
│   │   │   └── todo.ts
│   │   ├── api/             # API client functions
│   │   │   └── todoApi.ts
│   │   ├── App.tsx          # Main application component
│   │   ├── App.css          # Component styles
│   │   ├── main.tsx         # Application entry point
│   │   └── index.css        # Global styles with Tailwind
│   ├── public/              # Static assets
│   │   └── vite.svg
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
│
├── backend/                 # Rust/Axum backend
│   ├── src/
│   │   ├── handlers/        # HTTP request handlers
│   │   │   ├── mod.rs
│   │   │   └── todos.rs
│   │   ├── models/          # Data models
│   │   │   ├── mod.rs
│   │   │   └── todo.rs
│   │   ├── db/              # Database connection
│   │   │   ├── mod.rs
│   │   │   └── pool.rs
│   │   ├── routes.rs        # API routes + static file serving
│   │   ├── config.rs        # Configuration management
│   │   └── main.rs          # Application entry point
│   ├── public/              # Static files (frontend build output)
│   │   └── (built files from frontend/dist/)
│   ├── migrations/          # Database migrations
│   │   └── 20260103000000_create_todos_table.sql
│   ├── Cargo.toml
│   ├── docker-compose.yml   # MySQL container configuration
│   └── .env.example
│
├── build.sh                 # Unified build script
├── how-to-build.md          # Build and deployment guide
├── CLAUDE.md                # This file
└── .gitignore
```

## Prerequisites

- Node.js (v18 or higher)
- Rust (latest stable)
- Docker and Docker Compose
- MySQL client (optional, for manual database access)

## Setup Instructions

Choose between two deployment modes:

### Option 1: Unified Deployment (Recommended for Production)

This mode serves both frontend and backend from a single Axum server on port 8000.

```bash
# 1. Navigate to project root
cd todo-list

# 2. Set up backend environment
cd backend
cp .env.example .env

# 3. Start MySQL database
docker-compose up -d

# 4. Install SQLx CLI and run migrations
cargo install sqlx-cli --no-default-features --features mysql
sqlx migrate run

# 5. Build frontend and copy to backend/public
cd ..
./build.sh

# 6. Run the unified server
cd backend
cargo run
```

Access the application at `http://localhost:8000`
- Frontend: `http://localhost:8000/`
- API: `http://localhost:8000/api/todos`

### Option 2: Separate Development Mode

This mode runs frontend (port 5173) and backend (port 8000) separately for hot module replacement.

#### Backend Setup

```bash
cd backend

# Environment configuration
cp .env.example .env

# Start MySQL
docker-compose up -d

# Install SQLx CLI and run migrations
cargo install sqlx-cli --no-default-features --features mysql
sqlx migrate run

# Run backend server
cargo run
```

Backend API available at `http://localhost:8000`

#### Frontend Setup (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file for development
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Start development server
npm run dev
```

Frontend available at `http://localhost:5173`

### Environment Configuration

#### Backend `.env` file

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

#### Frontend `.env` file (only needed for separate development mode)

```env
# API Configuration (for development mode only)
VITE_API_URL=http://localhost:8000/api
```

Note: In unified deployment, the frontend uses relative URLs (`/api`) since both are served from the same origin.

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

### Building for Production (Unified Deployment)

Use the provided build script:

```bash
# From project root
./build.sh
```

Or manually:

```bash
# Build frontend
cd frontend
npm run build

# Copy to backend public directory
cd ..
rm -rf backend/public/*
cp -r frontend/dist/* backend/public/

# Build backend (optional)
cd backend
cargo build --release
```

The unified application can then be run with:
```bash
cd backend
cargo run --release
```

### Running Tests

Backend:
```bash
cd backend
cargo test
```

Frontend:
```bash
cd frontend
npm test
```

### Database Management

Create a new migration:
```bash
cd backend
sqlx migrate add <migration_name>
```

Run migrations:
```bash
sqlx migrate run
```

Revert last migration:
```bash
sqlx migrate revert
```

### Docker Compose Services

The `docker-compose.yml` file in the `backend/` directory defines:

- **mysql**: MySQL 8.0 database server
  - Port: 3306
  - Container name: `todo-mysql`
  - Persistent volume for data
  - Configured with environment variables

### Development Tips

**Backend Hot Reload:**
```bash
cargo install cargo-watch
cd backend
cargo watch -x run
```

**Frontend Hot Module Replacement:**
Vite provides automatic HMR when running `npm run dev`

**Database Inspection:**
```bash
docker exec -it todo-mysql mysql -u todouser -p
# Password: todopass

USE tododb;
SELECT * FROM todos;
```

## Features

### Core Features
- Create, read, update, and delete todos
- Mark todos as complete/incomplete with toggle functionality
- Inline editing of todo titles and descriptions
- Filter todos by status (all/active/completed)
- Persistent storage in MySQL database
- Todo counter badges (total, active, completed)

### Frontend Features
- Modern gradient design with Tailwind CSS
- Fully responsive design
- Real-time updates
- Loading and error states
- Inline editing with edit/cancel functionality
- Form validation
- Animated UI transitions
- Korean language UI (일정관리)

### Backend Features
- RESTful API design
- Static file serving for unified deployment
- CORS support for development mode
- Comprehensive error handling and logging
- Database connection pooling with SQLx
- Input validation
- Fallback routing for SPA support

## Troubleshooting

### Database Connection Issues
- Ensure Docker MySQL container is running: `docker ps`
- Check DATABASE_URL in `backend/.env` matches your configuration
- Verify MySQL port 3306 is not already in use: `lsof -i :3306` (macOS/Linux)
- Check Docker logs: `cd backend && docker-compose logs mysql`
- Restart the container: `docker-compose restart mysql`

### Frontend Build Issues
- Clear node_modules and reinstall:
  ```bash
  cd frontend
  rm -rf node_modules package-lock.json
  npm install
  ```
- Clear Vite cache: `rm -rf node_modules/.vite`
- Verify build output: `npm run build` should create `dist/` directory
- Check that `dist/index.html` exists

### Backend Compilation Issues
- Update Rust toolchain: `rustup update`
- Clean build artifacts:
  ```bash
  cd backend
  cargo clean && cargo build
  ```
- Ensure SQLx offline mode is prepared: `cargo sqlx prepare`
- Verify migrations ran successfully: `sqlx migrate info`

### CORS Issues (Development Mode)
- Verify backend CORS configuration allows frontend origin (`http://localhost:5173`)
- Check browser console for specific CORS errors
- Ensure backend is running before making API requests from frontend
- In unified deployment mode, CORS is not needed (same origin)

### Static File Serving Issues (Unified Deployment)
- Ensure `backend/public/` directory exists and contains built frontend files
- Run `./build.sh` to rebuild and copy frontend to backend
- Check backend logs for static file serving errors
- Verify `backend/src/routes.rs` has `ServeDir` configuration
- Try accessing `http://localhost:8000/` directly (should show frontend)
- API should still be accessible at `http://localhost:8000/api/todos`

### Port Already in Use
- Backend port 8000: Change `BACKEND_PORT` in `backend/.env`
- Frontend port 5173: Vite will automatically try the next available port
- MySQL port 3306: Change port mapping in `backend/docker-compose.yml`

## Deployment Considerations

### Unified Deployment (Recommended)

Deploy frontend and backend together as a single Rust application:

**Deployment Steps:**
1. Build frontend: `cd frontend && npm run build`
2. Copy to backend: `cp -r frontend/dist/* backend/public/`
3. Build backend: `cd backend && cargo build --release`
4. Deploy the single Rust binary with the `public/` directory

**Platform Options:**
- **Railway, Render, Fly.io**: Rust-friendly platforms with easy deployment
- **Docker**: Create a multi-stage Dockerfile
  ```dockerfile
  # Stage 1: Build frontend
  FROM node:18 AS frontend
  WORKDIR /app/frontend
  COPY frontend/package*.json ./
  RUN npm install
  COPY frontend/ ./
  RUN npm run build

  # Stage 2: Build backend
  FROM rust:latest AS backend
  WORKDIR /app/backend
  COPY backend/Cargo.* ./
  COPY backend/src ./src
  COPY --from=frontend /app/frontend/dist ./public
  RUN cargo build --release

  # Stage 3: Runtime
  FROM debian:bookworm-slim
  WORKDIR /app
  COPY --from=backend /app/backend/target/release/todo-list-backend ./
  COPY --from=backend /app/backend/public ./public
  EXPOSE 8000
  CMD ["./todo-list-backend"]
  ```
- **AWS EC2/ECS**: Run the binary with systemd or container service
- **Digital Ocean Droplets**: Simple VM deployment

**Advantages:**
- Single deployment artifact
- No CORS configuration needed
- Simpler infrastructure
- Lower hosting costs
- Easier to manage

### Separate Deployment Strategy (Alternative)

Deploy frontend and backend independently:

**Frontend Deployment:**
- **Vercel, Netlify, Cloudflare Pages**: Optimized for Vite/React apps
- **AWS S3 + CloudFront**: Static hosting with CDN
- Build command: `npm run build`
- Output directory: `dist/`
- Set environment variable: `VITE_API_URL=https://api.your-domain.com/api`

**Backend Deployment:**
- **Railway, Render, Fly.io**: Rust-friendly platforms
- **Docker**: Container deployment
- Expose port 8000
- Configure CORS to allow frontend domain

**Advantages:**
- Independent scaling of frontend and backend
- Use specialized hosting for each (CDN for frontend, compute for backend)
- Can update frontend without redeploying backend

### Database Deployment

For production, use managed MySQL services:
- **AWS RDS**: Reliable, managed MySQL
- **Google Cloud SQL**: Integrated with GCP
- **PlanetScale**: Modern, serverless MySQL
- **Digital Ocean Managed Databases**: Simple and affordable

Update `DATABASE_URL` in production environment to point to your managed database.

**Important**: Do NOT use Docker MySQL in production. Docker compose is for development only.

### Environment Variables for Production

**Unified Deployment:**
```env
DATABASE_URL=mysql://user:password@production-db-host:3306/tododb
BACKEND_PORT=8000
RUST_LOG=info
```

**Separate Deployment:**

Backend:
```env
DATABASE_URL=mysql://user:password@production-db-host:3306/tododb
BACKEND_PORT=8000
RUST_LOG=info
CORS_ORIGIN=https://your-frontend-domain.com
```

Frontend:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Future Enhancements

### High Priority
- **User Authentication**: Add user login/signup with JWT or session-based auth
- **Todo Categories/Tags**: Organize todos with custom categories
- **Due Dates**: Add deadline tracking with overdue indicators
- **Priority Levels**: High/medium/low priority sorting
- **Search Functionality**: Search todos by title/description

### Medium Priority
- **Dark Mode**: Toggle between light and dark themes
- **Bulk Operations**: Select multiple todos for bulk delete/complete
- **Todo Sorting**: Sort by date, priority, alphabetical
- **Data Export/Import**: Export todos as JSON/CSV
- **Subtasks**: Break down todos into smaller tasks
- **Internationalization**: Multi-language support (currently Korean only)

### Low Priority
- **Notifications/Reminders**: Browser notifications for due dates
- **Collaboration**: Share todos with other users
- **Recurring Tasks**: Automatically recreate todos on schedule
- **Rich Text Editor**: Markdown support for descriptions
- **File Attachments**: Attach files to todos
- **Analytics Dashboard**: Track productivity metrics

### Infrastructure
- **Automated Tests**: Unit and integration tests for frontend and backend
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **API Documentation**: Swagger/OpenAPI documentation
- **Performance Monitoring**: Add APM tools (e.g., Sentry)
- **Caching Layer**: Redis caching for frequently accessed data
- **Rate Limiting**: API rate limiting to prevent abuse

## Additional Resources

- **Build Guide**: See `how-to-build.md` for detailed build instructions
- **Build Script**: Use `./build.sh` for quick unified deployment builds

## License

MIT License
