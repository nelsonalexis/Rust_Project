# Mesures SHA-256

Mesures Criterion obtenues le 18 novembre 2026 sur Linux x86-64, Rust 1.100.0,
avec le mode `--quick`. La valeur centrale est donnée pour chaque taille.

| Taille | Durée | Débit |
| --- | ---: | ---: |
| 1 Kio | 0,756 µs | 1,26 Gio/s |
| 1 Mio | 0,813 ms | 1,20 Gio/s |
| 8 Mio | 6,08 ms | 1,29 Gio/s |

Le benchmark inclut le calcul SHA-256 et le formatage hexadécimal.
Il exclut la création du fichier de test, la route HTTP et la file d'attente.
Le mode rapide permet de vérifier les ordres de grandeur.

Le [flamegraph](evidence-flamegraph.svg) agrège les échantillons CPU pendant
cinq secondes de hachage pour des fichiers de 8 Mio. La largeur d'une barre
représente le nombre d'échantillons dans lesquels figure la fonction.
