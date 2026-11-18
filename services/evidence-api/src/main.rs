#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = std::env::var("DRIVE_ESCROW_BIND").unwrap_or_else(|_| "127.0.0.1:3000".into());
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    println!(
        "DriveEscrow evidence API listening on {}",
        listener.local_addr()?
    );
    axum::serve(listener, drive_escrow_api::app()?).await?;
    Ok(())
}
