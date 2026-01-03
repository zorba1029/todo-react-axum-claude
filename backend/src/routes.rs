use axum::{
    routing::{delete, get, patch, post, put},
    Router,
};
use sqlx::{MySql, Pool};
use tower_http::services::ServeDir;

use crate::handlers;

pub fn create_routes(pool: Pool<MySql>) -> Router {
    // API routes
    let api_routes = Router::new()
        .route("/todos", get(handlers::get_todos))
        .route("/todos", post(handlers::create_todo))
        .route("/todos/:id", get(handlers::get_todo))
        .route("/todos/:id", put(handlers::update_todo))
        .route("/todos/:id", delete(handlers::delete_todo))
        .route("/todos/:id/toggle", patch(handlers::toggle_todo))
        .with_state(pool);

    // Serve static files from public directory
    // For SPA, serve index.html for all non-API routes
    let serve_dir = ServeDir::new("public").not_found_service(
        ServeDir::new("public").append_index_html_on_directories(true)
    );

    Router::new()
        .nest("/api", api_routes)
        .fallback_service(serve_dir)
}
