// Définition des variables globales
var canvasWidth = 900; // Largeur du canevas en pixels
var canvasHeight = 600; // Hauteur du canevas en pixels
var blockSize = 30; // Taille d'un bloc dans le jeu
var ctx; // Contexte de dessin du canevas
var delay = 80; // Délai entre chaque mouvement du serpent
var snakee; // Instance du serpent
var applee; // Instance de la pomme
var widthInblocks = canvasWidth / blockSize; // Largeur du canevas en blocs
var heightInblocks = canvasHeight / blockSize; // Hauteur du canevas en blocs
var score = 0; // Score du joueur
var timeOut; // Gestionnaire de temps pour rafraîchir le jeu

// Fonction exécutée au chargement de la fenêtre
window.onload = function () {
    init();
}

// Initialisation du jeu
function init() {
    // Création du canevas
    var canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "50px solid darkblue";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);

    // Récupération du contexte de dessin
    ctx = canvas.getContext('2d');

    // Création du serpent
    snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
    applee = new Apple([7, 9]);

    // Lancement du jeu
    refreshCanvas();
}

// Rafraîchissement du canevas
function refreshCanvas() {
    // Faire avancer le serpent
    snakee.advance();

    // Vérifier si le serpent a eu un accident
    if (snakee.checkCollision()) {
        gameOver();
    } else {
        // Vérifier si le serpent mange une pomme
        if (snakee.isEatingApple(applee)) {
            score++;
            snakee.ateApple = true;
            
            // Déplacer la pomme à une nouvelle position
            do {
                applee.setNewPosition();
            } while (applee.isOnSnake(snakee));
        }

        // Effacer le canevas entier
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Dessiner le score
        drawScore();

        // Dessiner le serpent
        snakee.draw();

        // Dessiner la pomme
        applee.draw();

        // Appel récursif avec un délai
        timeOut = setTimeout(refreshCanvas, delay);
    }
}

// Fonction de fin de jeu
function gameOver() {
    var centerX = canvasWidth / 2;
    var centerY = canvasHeight / 2;
    ctx.save();
    ctx.font = "bold 50px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 10;
    ctx.textBaseline = "middle";
    ctx.strokeText("Game Over", centerX, centerY - 180);
    ctx.fillText("Game Over", centerX, centerY - 180);
    ctx.font = "bold 30px sans-serif";
    ctx.strokeText("Appuyer sur Espace pour Rejouer", centerX, centerY - 120);
    ctx.fillText("Appuyer sur Espace pour Rejouer", centerX, centerY - 120);
    ctx.restore();
}

// Fonction pour redémarrer le jeu
function restart() {
    score = 0; // Réinitialisation du score

    // Recréer le serpent et la pomme
    snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
    applee = new Apple([7, 9]);

    // Annuler le timeout précédent et relancer le jeu
    clearTimeout(timeOut);
    refreshCanvas();
}

// Fonction pour dessiner le score sur le canevas
function drawScore() {
    var centerX = canvasWidth / 2;
    var centerY = canvasHeight / 2;
    var text = "Score : " + score.toString();
    
    ctx.save();
    ctx.font = "bold 100px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "darkblue";
    ctx.lineWidth = 7;
    ctx.strokeText(text, centerX, centerY);
    ctx.fillStyle = "white";
    ctx.fillText(text, centerX, centerY);
    ctx.restore();
}

// Fonction pour dessiner un bloc
function drawBlock(ctx, position) {
    var x = position[0] * blockSize;
    var y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
}

// Classe Snake (serpent)
function Snake(body, direction) {
    this.body = body; // Corps du serpent (tableau de positions)
    this.direction = direction; // Direction actuelle du serpent
    this.ateApple = false; // Indicateur pour savoir si le serpent a mangé une pomme

    // Méthode pour dessiner le serpent
    this.draw = function () {
        ctx.save();
        ctx.fillStyle = "blue";
        
        // Dessiner chaque partie du serpent
        for (var i = 0; i < this.body.length; i++) {
            drawBlock(ctx, this.body[i]);
        }
        ctx.restore();
    };

    // Méthode pour faire avancer le serpent
    this.advance = function () {
        var nextPosition = this.body[0].slice();
        switch (this.direction) {
            case "right":
                nextPosition[0]++;
                break;
            case "left":
                nextPosition[0]--;
                break;
            case "down":
                nextPosition[1]++;
                break;
            case "up":
                nextPosition[1]--;
                break;
            default:
                throw new Error("Direction invalide");
        }

        // Ajouter la nouvelle position au début du tableau
        this.body.unshift(nextPosition);

        // Si le serpent n'a pas mangé de pomme, retirer la dernière position
        if (!this.ateApple) {
            this.body.pop();
        } else {
            this.ateApple = false;
        }
    };

    // Méthode pour changer la direction du serpent
    this.setDirection = function (newDirection) {
        var allowedDirections;
        switch (this.direction) {
            case "right":
            case "left":
                allowedDirections = ["up", "down"];
                break;
            case "down":
            case "up":
                allowedDirections = ["left", "right"];
                break;
            default:
                throw new Error("Direction invalide");
        }
        // Si la nouvelle direction est autorisée, mettez-la à jour
        if (allowedDirections.includes(newDirection)) {
            this.direction = newDirection;
        }
    };

    // Méthode pour vérifier les collisions
    this.checkCollision = function () {
        var wallCollision = false;
        var snakeCollision = false;

        // Position de la tête du serpent
        var head = this.body[0];
        var rest = this.body.slice(1);
        var snakeX = head[0];
        var snakeY = head[1];
        var minX = 0;
        var minY = 0;
        var maxX = widthInblocks - 1;
        var maxY = heightInblocks - 1;

        // Vérifier la collision avec les murs
        var isHorizontalCollision = snakeX < minX || snakeX > maxX;
        var isVerticalCollision = snakeY < minY || snakeY > maxY;
        if (isHorizontalCollision || isVerticalCollision) {
            wallCollision = true;
        }

        // Vérifier la collision avec le corps du serpent
        for (var i = 0; i < rest.length; i++) {
            if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                snakeCollision = true;
                break;
            }
        }

        return wallCollision || snakeCollision;
    };

    // Vérifier si le serpent mange une pomme
    this.isEatingApple = function (appleToEat) {
        var head = this.body[0];
        return head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1];
    };
}

// Classe Apple (pomme)
function Apple(position) {
    this.position = position; // Position de la pomme
    this.color = "red"; // Couleur de la pomme

    // Dessiner la pomme sur le canevas
    this.draw = function () {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        var radius = blockSize / 2;
        var x = this.position[0] * blockSize + radius;
        var y = this.position[1] * blockSize + radius;

        // Dessiner un cercle
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    // Repositionner la pomme à une nouvelle position aléatoire
    this.setNewPosition = function () {
        var newX = Math.round(Math.random() * (widthInblocks - 1));
        var newY = Math.round(Math.random() * (heightInblocks - 1));
        this.position = [newX, newY];
        this.generateAppleColor();
    };

    // Vérifier si la pomme est sur le serpent
    this.isOnSnake = function (snakeToCheck) {
        var isOnSnake = false;
        for (var i = 0; i < snakeToCheck.body.length; i++) {
            if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                isOnSnake = true;
                break;
            }
        }
        return isOnSnake;
    };

    // Générer une couleur aléatoire pour la pomme
    this.generateAppleColor = function () {
        var colors = ["red", "green", "yellow", "blue", "pink", "violet", "black"];
        var selectedIndex = Math.floor(Math.random() * colors.length);
        var selectedColor = colors[selectedIndex];
        this.color = selectedColor;
    };
}

// Gestion des événements clavier
document.onkeydown = function handleKeyDown(e) {
    var newDirection;
    switch (e.key) {
        case "ArrowLeft":
            newDirection = "left";
            break;
        case "ArrowUp":
            newDirection = "up";
            break;
        case "ArrowRight":
            newDirection = "right";
            break;
        case "ArrowDown":
            newDirection = "down";
            break;
        case " ":
            restart();
            return;
        default:
            return;
    }
    snakee.setDirection(newDirection);
}
