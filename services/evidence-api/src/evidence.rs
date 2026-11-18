use std::{
    sync::mpsc::{self, SyncSender, TrySendError},
    thread,
};

use axum::body::Bytes;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tokio::sync::oneshot;

use crate::EvidenceError;

#[derive(Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(transparent)]
pub struct EvidenceHash(String);

impl EvidenceHash {
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

pub fn fingerprint(data: &[u8]) -> EvidenceHash {
    EvidenceHash(format!("{:x}", Sha256::digest(data)))
}

struct Job {
    data: Bytes,
    reply: oneshot::Sender<EvidenceHash>,
}

#[derive(Clone)]
pub(crate) struct EvidenceWorker(SyncSender<Job>);

impl EvidenceWorker {
    pub(crate) fn start() -> std::io::Result<Self> {
        let (sender, receiver) = mpsc::sync_channel::<Job>(4);
        thread::Builder::new()
            .name("evidence-sha256".into())
            .spawn(move || {
                for job in receiver {
                    if !job.reply.is_closed() {
                        let _ = job.reply.send(fingerprint(&job.data));
                    }
                }
            })?;
        Ok(Self(sender))
    }

    pub(crate) async fn submit(&self, data: Bytes) -> Result<EvidenceHash, EvidenceError> {
        let (reply, response) = oneshot::channel();
        self.0
            .try_send(Job { data, reply })
            .map_err(|error| match error {
                TrySendError::Full(_) => EvidenceError::Busy,
                TrySendError::Disconnected(_) => EvidenceError::WorkerUnavailable,
            })?;
        response.await.map_err(|_| EvidenceError::WorkerUnavailable)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matches_sha256_reference_vector() {
        assert_eq!(
            fingerprint(b"abc").as_str(),
            "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
        );
    }
}
