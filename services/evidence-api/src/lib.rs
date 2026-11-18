mod evidence;

use axum::{
    body::Bytes,
    extract::{DefaultBodyLimit, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::post,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use serde_json::json;

use evidence::EvidenceWorker;
pub use evidence::{fingerprint, EvidenceHash};

pub const MAX_EVIDENCE_BYTES: usize = 8 * 1024 * 1024;

#[derive(Debug)]
pub enum EvidenceError {
    Empty,
    Busy,
    WorkerUnavailable,
}

impl IntoResponse for EvidenceError {
    fn into_response(self) -> Response {
        let (status, code) = match self {
            Self::Empty => (StatusCode::BAD_REQUEST, "empty_evidence"),
            Self::Busy => (StatusCode::SERVICE_UNAVAILABLE, "worker_busy"),
            Self::WorkerUnavailable => (StatusCode::SERVICE_UNAVAILABLE, "worker_unavailable"),
        };
        (status, Json(json!({ "error": code }))).into_response()
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EvidenceReceipt {
    pub sha256: EvidenceHash,
    pub byte_count: usize,
}

#[derive(Deserialize)]
struct EvidenceNote {
    text: String,
}

pub fn app() -> std::io::Result<Router> {
    Ok(Router::new()
        .route("/evidence/fingerprint", post(create_fingerprint))
        .route("/evidence/fingerprint/text", post(create_text_fingerprint))
        .layer(DefaultBodyLimit::max(MAX_EVIDENCE_BYTES))
        .with_state(EvidenceWorker::start()?))
}

async fn create_fingerprint(
    State(worker): State<EvidenceWorker>,
    data: Bytes,
) -> Result<Json<EvidenceReceipt>, EvidenceError> {
    hash_evidence(&worker, data).await
}

async fn create_text_fingerprint(
    State(worker): State<EvidenceWorker>,
    Json(note): Json<EvidenceNote>,
) -> Result<Json<EvidenceReceipt>, EvidenceError> {
    hash_evidence(&worker, Bytes::from(note.text)).await
}

async fn hash_evidence(
    worker: &EvidenceWorker,
    data: Bytes,
) -> Result<Json<EvidenceReceipt>, EvidenceError> {
    if data.is_empty() {
        return Err(EvidenceError::Empty);
    }

    let byte_count = data.len();
    let sha256 = worker.submit(data).await?;
    Ok(Json(EvidenceReceipt { sha256, byte_count }))
}
