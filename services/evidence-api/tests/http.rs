use axum::{
    body::{to_bytes, Body},
    http::{Request, StatusCode},
};
use drive_escrow_api::{app, EvidenceReceipt, MAX_EVIDENCE_BYTES};
use tower::ServiceExt;

#[tokio::test]
async fn fingerprints_evidence_and_rejects_invalid_payloads(
) -> Result<(), Box<dyn std::error::Error>> {
    let router = app()?;
    for (body, expected_status) in [
        (Body::from("abc"), StatusCode::OK),
        (Body::empty(), StatusCode::BAD_REQUEST),
        (
            Body::from(vec![0; MAX_EVIDENCE_BYTES + 1]),
            StatusCode::PAYLOAD_TOO_LARGE,
        ),
    ] {
        let response = router
            .clone()
            .oneshot(Request::post("/evidence/fingerprint").body(body)?)
            .await?;
        assert_eq!(response.status(), expected_status);
        if expected_status == StatusCode::OK {
            let receipt: EvidenceReceipt =
                serde_json::from_slice(&to_bytes(response.into_body(), 1024).await?)?;
            assert_eq!(receipt.byte_count, 3);
            assert_eq!(
                receipt.sha256.as_str(),
                "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
            );
        }
    }
    Ok(())
}

#[tokio::test]
async fn fingerprints_utf8_text_from_json() -> Result<(), Box<dyn std::error::Error>> {
    let router = app()?;
    let text = "État des lieux";
    let response = router
        .oneshot(
            Request::post("/evidence/fingerprint/text")
                .header("content-type", "application/json")
                .body(Body::from(serde_json::to_vec(
                    &serde_json::json!({ "text": text }),
                )?))?,
        )
        .await?;
    assert_eq!(response.status(), StatusCode::OK);
    let receipt: EvidenceReceipt =
        serde_json::from_slice(&to_bytes(response.into_body(), 1024).await?)?;
    assert_eq!(receipt.byte_count, text.len());
    assert_eq!(
        receipt.sha256,
        drive_escrow_api::fingerprint(text.as_bytes())
    );
    Ok(())
}
