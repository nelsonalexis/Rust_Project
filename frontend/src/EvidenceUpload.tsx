import { useState } from "react";

export function EvidenceUpload({ onFingerprint }: { onFingerprint: (hash: string) => void }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(file: File) {
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/evidence/fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: file,
      });
      if (response.status === 413) throw new Error("Taille maximale : 8 Mio.");
      if (response.status === 503) throw new Error("Service occupé. Réessaie dans un instant.");
      if (!response.ok) throw new Error("Impossible de calculer l’empreinte du fichier.");
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
            if (file) void upload(file);
          }}
        />
      </label>
      {pending && <p role="status">Calcul en cours…</p>}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
