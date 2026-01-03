use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub port: u16,
}

impl Config {
    pub fn from_env() -> Result<Self, env::VarError> {
        let database_url = env::var("DATABASE_URL")?;
        let port = env::var("BACKEND_PORT")
            .unwrap_or_else(|_| "8000".to_string())
            .parse()
            .unwrap_or(8000);

        Ok(Config {
            database_url,
            port,
        })
    }
}
