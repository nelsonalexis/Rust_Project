import { useState } from "react";

export function EvidenceUpload({ onFingerprint }: { onFingerprint: (hash: string) => void }) {
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function calculateFingerprint(path: string, contentType: string, body: BodyInit) {
    setPending(true);
    setMessage("");
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body,
      });
      if (response.status === 413) throw new Error("Taille maximale : 8 Mio.");
      if (response.status === 503) throw new Error("Service occupé. Réessaie dans un instant.");
      if (!response.ok) throw new Error("Impossible de calculer l’empreinte du justificatif.");
      const receipt: { sha256: string } = await response.json();
      if (!/^[a-f0-9]{64}$/.test(receipt.sha256)) throw new Error("Empreinte invalide.");
      onFingerprint(receipt.sha256);
      setMessage("Empreinte calculée. Vérifie-la avant de signer.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur pendant le calcul.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <label>
        Calculer l’empreinte SHA-256 d’un fichier
        <input
          type="file"
          disabled={pending}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (file) {
              void calculateFingerprint("/evidence/fingerprint", "application/octet-stream", file);
            }
          }}
        />
      </label>
      <label>
        Constat textuel
        <textarea
          value={note}
          onChange={(event) => setNote(event.currentTarget.value)}
          disabled={pending}
          placeholder="Décris l’état du véhicule ou les dommages constatés."
        />
      </label>
      <button
        type="button"
        className="secondary-button"
        disabled={pending || !note.trim()}
        onClick={() => {
          void calculateFingerprint(
            "/evidence/fingerprint/text",
            "application/json",
            JSON.stringify({ text: note }),
          );
        }}
      >
        Calculer l’empreinte du constat
      </button>
      {pending && <p role="status">Calcul en cours…</p>}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
