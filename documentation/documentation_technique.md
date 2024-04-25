
# Snake-Game

# Documentation technique

Cette documentation technique fournit des informations détaillées sur la conception et la mise en œuvre du jeu du serpent.

## Structure du code

- **Variables globales** : Les variables globales incluent la taille du canevas, la taille d'un bloc, le contexte de dessin (`ctx`), le délai entre chaque mouvement du serpent (`delay`), les instances du serpent (`snakee`) et de la pomme (`applee`), et le score du joueur.

- **Fonction `init()`** : Cette fonction est appelée au chargement de la fenêtre (`window.onload`) pour initialiser le jeu. Elle crée le canevas, récupère le contexte de dessin, initialise le serpent et la pomme, et lance la boucle de rafraîchissement.

- **Fonction `refreshCanvas()`** : Cette fonction est appelée de manière récursive pour rafraîchir le jeu. Elle fait avancer le serpent, vérifie les collisions, efface le canevas, dessine le score, le serpent et la pomme, puis attend un délai (`delay`) avant de se rappeler elle-même.

- **Fonction `gameOver()`** : Cette fonction est appelée lorsque le jeu se termine en raison d'une collision. Elle affiche un message de fin de jeu au centre du canevas.

- **Fonction `restart()`** : Cette fonction réinitialise le jeu en recréant le serpent et la pomme, puis relance la boucle de rafraîchissement (`refreshCanvas`).

- **Fonction `drawScore()`** : Cette fonction dessine le score courant au centre du canevas.

- **Classe `Snake`** : Cette classe représente le serpent dans le jeu. Elle inclut des méthodes pour dessiner le serpent (`draw`), le faire avancer (`advance`), changer sa direction (`setDirection`), vérifier les collisions (`checkCollision`), et gérer l'action de manger une pomme (`isEatingApple`).

- **Classe `Apple`** : Cette classe représente la pomme dans le jeu. Elle inclut des méthodes pour dessiner la pomme (`draw`), repositionner la pomme à une nouvelle position aléatoire (`setNewPosition`), vérifier si la pomme est sur le serpent (`isOnSnake`), et générer une couleur aléatoire pour la pomme (`generateAppleColor`).

## Gestion des événements clavier

Le jeu utilise la fonction `handleKeyDown` pour gérer les événements de clavier. Les touches fléchées permettent de changer la direction du serpent, et la touche espace redémarre le jeu.

---

# documentation-Technique
