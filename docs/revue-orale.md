# DriveEscrow · présentation et revue de code

## 8 minutes puis 3 minutes de questions

| Temps | Intervention |
| --- | --- |
| 0:00–0:50 | Une personne rend une voiture. Le loueur demande de garder une partie de la caution. Qui détient l'argent et qui tranche ? |
| 0:50–1:45 | Présenter le propriétaire, le locataire et les trois arbitres. Montrer les 10 XLM au départ et les 6 XLM immédiatement rendus après la réclamation. |
| 1:45–3:40 | Démontrer la sélection d'un fichier et l'empreinte calculée. Montrer ensuite une location ou exécuter le test local de l'arbitrage partiel. |
| 3:40–4:45 | Montrer la séparation entre contrat, service Rust et navigateur. Suivre une requête, du fichier au reçu, puis l'utilisation du hash dans une transaction. |
| 4:45–5:45 | Ouvrir `RentalStatus`, `EscrowError` et `EvidenceHash`. Montrer un exemple de rejet et la règle des deux votes égaux. |
| 5:45–6:55 | Expliquer Tokio, le thread système, la file de quatre jobs et le canal de réponse par requête. |
| 6:55–8:00 | Montrer le test d'intégration, l'échelle de temps Criterion et le flamegraph. Préciser le périmètre de la mesure et le cas des trois votes différents. |

## Les six questions de revue

1. **Flux**. `cargo run -p drive-escrow-api` démarre Tokio, ouvre le port local, crée un worker et lance Axum. La route reçoit le fichier comme octets. Le thread calcule l'empreinte puis la renvoie à la requête via un canal. L'interface peut inclure les 32 octets dans la transaction qui sera signée par Freighter.
2. **Modules**. `main.rs` initialise le service, `lib.rs` expose les routes, `evidence.rs` porte le calcul et sa file. Le contrat porte la machine à états et les fonds. Une autre taille maximale change l'API. Une autre règle de consensus change le contrat et les tests.
3. **Types**. `Rental` rassemble les données de la location. `RentalStatus` contient les états possibles. `EscrowError` rend un rejet précis. `BytesN<32>` fixe la longueur d'une preuve sur le contrat. `EvidenceHash` identifie le contenu SHA-256 dans le reçu.
4. **Asynchrone et thread**. L'API attend des entrées-sorties et des réponses. Le hachage consomme du CPU proportionnellement au volume. Un thread dédié reçoit le travail et empêche ce calcul de prendre un thread Tokio. La file bornée oppose une pression dès que le calcul prend du retard.
5. **Ownership**. Axum clone un émetteur pour partager l'accès au worker. Le récepteur appartient au thread et chaque job possède ses octets et son émetteur de réponse. Le contrat stocke les locations côté Soroban. Le backend ne duplique pas cet état.
6. **Mesures**. Criterion mesure le SHA-256 et le formatage de son résultat pour trois tailles. L'allocation des fichiers est hors mesure. Le flamegraph échantillonne les piles CPU sur la charge de 8 Mio. Un test de charge HTTP serait nécessaire pour mesurer la latence d'attente de bout en bout.

## Démonstration locale de secours

```sh
cargo test --locked -p hello-world test_partial_arbitration -- --nocapture
cargo test --locked -p drive-escrow-api --test http -- --nocapture
```

Le premier test utilise l'environnement local Soroban et vérifie les soldes.
Le second traverse les handlers Axum, la file et le thread, puis lit le reçu JSON.
