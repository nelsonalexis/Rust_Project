# DriveEscrow

Un séquestre DeFi pour les cautions de location de voiture sur Stellar Testnet.
Le contrat reçoit la caution, rembourse le locataire au retour ou répartit la
somme après une réclamation. Trois arbitres peuvent voter. Deux votes identiques
suffisent à régler le litige.

Projet Rust Team Project, ESILV. Auteur : ALEXIS Nelson Biboum.

## Lancer la démonstration

Prérequis : Rust stable avec Cargo, Node.js 24 et npm. Pour signer sur Testnet,
utiliser Freighter sur Stellar Testnet avec des comptes de test financés.

Dans un terminal à la racine :

```sh
cargo run --locked -p drive-escrow-api
```

Dans un second terminal :

```sh
cd frontend/src/contracts/escrow
npm ci
npm run build
cd ../../..
npm ci
npm run dev
```

Ouvrir l'adresse affichée par Vite. Le proxy de développement envoie
`POST /evidence/fingerprint` à l'API locale sur le port 3000.
Le bouton de sélection de fichier remplit le champ d'empreinte de l'état des
lieux ou de la réclamation. Les champs restent aussi modifiables manuellement.

Pour essayer le service seul :

```sh
printf abc | curl -fsS --data-binary @- http://127.0.0.1:3000/evidence/fingerprint
```

La réponse contient le SHA-256 hexadécimal et la taille en octets. L'API accepte
des fichiers de 1 octet à 8 Mio et renvoie 503 si sa file de calcul est pleine.
Le fichier est traité en mémoire. Le contrat reçoit seulement les 32 octets
d'empreinte. La possession du fichier original permet de recalculer l'empreinte
et de comparer les deux valeurs.

Un constat textuel peut aussi passer par une route JSON. L'empreinte porte
sur les octets UTF-8 du champ `text`, après décodage du JSON.

```sh
curl -fsS http://127.0.0.1:3000/evidence/fingerprint/text \
  -H 'Content-Type: application/json' \
  --data-binary '{"text":"État des lieux signé par les deux parties"}'
```

## Architecture

| Composant | Responsabilité |
| --- | --- |
| `contracts/hello-world` | Transitions de `RentalStatus`, autorisations Soroban, transferts, votes et état persistant par location. |
| `services/evidence-api` | Axum reçoit les octets, Tokio attend la réponse du worker et Serde sérialise le reçu typé. |
| `frontend` | Calcule et insère les empreintes via l'API. Freighter signe les transactions et le client Stellar les soumet au réseau. |

Le handler HTTP transmet les octets par une file bornée à un thread système
qui calcule SHA-256. La réponse revient par un canal Tokio `oneshot`.
Chaque requête peut attendre son propre résultat sans bloquer un thread
du runtime par le calcul de l'empreinte. L'état Axum partage un émetteur
clonable. Le récepteur n'a qu'un propriétaire.

Le contrat gère les montants en entiers (1 XLM = 10 000 000 stroops).
`EscrowError` identifie les erreurs de domaine. Les types de preuves Soroban
imposent 32 octets. Un `EvidenceHash` distingue l'empreinte du reste du reçu JSON.

### Parcours à présenter

1. Le propriétaire crée une location avec une caution de 10 XLM.
2. Le locataire accepte et verse la caution. Les deux parties valident le départ
   puis le retour du véhicule.
3. Le propriétaire réclame 4 XLM. Le contrat rend aussitôt 6 XLM au locataire.
4. Le locataire conteste. Deux arbitres accordent chacun 2 XLM au propriétaire.
   Le contrat verse 2 XLM au propriétaire et rend les 2 XLM restants au locataire.
   Résultat final dans cet exemple : 8 XLM rendus et 2 XLM compensés.

Pour une démonstration locale reproductible de ce mécanisme, utiliser
`cargo test --locked -p hello-world test_partial_arbitration -- --nocapture`.
L'interface utilise le contrat Testnet configuré dans le binding généré.
Pour une nouvelle instance, compiler le workspace avec
`rustup target add wasm32v1-none` puis
`stellar contract build --package hello-world`, déployer sur Testnet, et
régénérer le binding en pointant sur la nouvelle adresse.

Limites : trois votes différents laissent le litige ouvert. Les preuves doivent
être conservées par les parties. Une empreinte vérifie l'intégrité d'un fichier,
tandis que les arbitres jugent la réclamation.

## Vérifier et profiler

```sh
cargo fmt --all --check
cargo clippy --locked --workspace --all-targets -- -D warnings
cargo test --locked --workspace
cargo bench --locked -p drive-escrow-api --bench evidence
cargo bench --locked -p drive-escrow-api --bench evidence -- 'sha256/8388608' --profile-time 5
```

La dernière commande génère un flamegraph avec pprof sous Linux.
Consulter `target/criterion/sha256/8388608/profile/flamegraph.svg`.
Criterion mesure la fonction de hachage avec des fichiers de 1 Kio, 1 Mio et
8 Mio, hors HTTP et hors réseau Stellar. Le résultat dépend du matériel.

Résultats de la mesure locale et profil CPU dans [docs/performance.md](docs/performance.md).
