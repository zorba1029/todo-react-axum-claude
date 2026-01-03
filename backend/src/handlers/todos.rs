use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use sqlx::{MySql, Pool};

use crate::models::{CreateTodoInput, Todo, UpdateTodoInput};

pub async fn get_todos(
    State(pool): State<Pool<MySql>>,
) -> Result<Json<Vec<Todo>>, (StatusCode, String)> {
    let todos = sqlx::query_as::<_, Todo>(
        "SELECT id, title, description, completed, created_at, updated_at FROM todos ORDER BY created_at DESC"
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| {
        tracing::error!("Failed to fetch todos: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
    })?;

    Ok(Json(todos))
}

pub async fn get_todo(
    State(pool): State<Pool<MySql>>,
    Path(id): Path<i32>,
) -> Result<Json<Todo>, (StatusCode, String)> {
    let todo = sqlx::query_as::<_, Todo>(
        "SELECT id, title, description, completed, created_at, updated_at FROM todos WHERE id = ?"
    )
    .bind(id)
    .fetch_one(&pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Todo not found".to_string()),
        _ => {
            tracing::error!("Failed to fetch todo: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
        }
    })?;

    Ok(Json(todo))
}

pub async fn create_todo(
    State(pool): State<Pool<MySql>>,
    Json(input): Json<CreateTodoInput>,
) -> Result<Json<Todo>, (StatusCode, String)> {
    let result = sqlx::query(
        "INSERT INTO todos (title, description, completed) VALUES (?, ?, false)"
    )
    .bind(&input.title)
    .bind(&input.description)
    .execute(&pool)
    .await
    .map_err(|e| {
        tracing::error!("Failed to create todo: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
    })?;

    let todo = sqlx::query_as::<_, Todo>(
        "SELECT id, title, description, completed, created_at, updated_at FROM todos WHERE id = ?"
    )
    .bind(result.last_insert_id())
    .fetch_one(&pool)
    .await
    .map_err(|e| {
        tracing::error!("Failed to fetch created todo: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
    })?;

    Ok(Json(todo))
}

pub async fn update_todo(
    State(pool): State<Pool<MySql>>,
    Path(id): Path<i32>,
    Json(input): Json<UpdateTodoInput>,
) -> Result<Json<Todo>, (StatusCode, String)> {
    let existing = sqlx::query_as::<_, Todo>(
        "SELECT id, title, description, completed, created_at, updated_at FROM todos WHERE id = ?"
    )
    .bind(id)
    .fetch_one(&pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Todo not found".to_string()),
        _ => {
            tracing::error!("Failed to fetch todo: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
        }
    })?;

    let title = input.title.unwrap_or(existing.title);
    let description = if input.description.is_some() {
        input.description
    } else {
        existing.description
    };
    let completed = input.completed.unwrap_or(existing.completed);

    sqlx::query(
        "UPDATE todos SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
    .bind(&title)
    .bind(&description)
    .bind(completed)
    .bind(id)
    .execute(&pool)
    .await
    .map_err(|e| {
        tracing::error!("Failed to update todo: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
    })?;

    let todo = sqlx::query_as::<_, Todo>(
        "SELECT id, title, description, completed, created_at, updated_at FROM todos WHERE id = ?"
    )
    .bind(id)
    .fetch_one(&pool)
    .await
    .map_err(|e| {
        tracing::error!("Failed to fetch updated todo: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
    })?;

    Ok(Json(todo))
}

pub async fn delete_todo(
    State(pool): State<Pool<MySql>>,
    Path(id): Path<i32>,
) -> Result<StatusCode, (StatusCode, String)> {
    let result = sqlx::query("DELETE FROM todos WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map_err(|e| {
            tracing::error!("Failed to delete todo: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
        })?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, "Todo not found".to_string()));
    }

    Ok(StatusCode::NO_CONTENT)
}

pub async fn toggle_todo(
    State(pool): State<Pool<MySql>>,
    Path(id): Path<i32>,
) -> Result<Json<Todo>, (StatusCode, String)> {
    sqlx::query(
        "UPDATE todos SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
    .bind(id)
    .execute(&pool)
    .await
    .map_err(|e| {
        tracing::error!("Failed to toggle todo: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
    })?;

    let todo = sqlx::query_as::<_, Todo>(
        "SELECT id, title, description, completed, created_at, updated_at FROM todos WHERE id = ?"
    )
    .bind(id)
    .fetch_one(&pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Todo not found".to_string()),
        _ => {
            tracing::error!("Failed to fetch toggled todo: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
        }
    })?;

    Ok(Json(todo))
}
