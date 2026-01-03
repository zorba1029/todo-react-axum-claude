use sqlx::{MySql, Pool};
use std::time::Duration;

pub async fn create_pool(database_url: &str) -> Result<Pool<MySql>, sqlx::Error> {
    let pool = sqlx::mysql::MySqlPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(3))
        .connect(database_url)
        .await?;

    Ok(pool)
}
