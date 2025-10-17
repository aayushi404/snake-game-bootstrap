const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('gameOverMessage');
const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

const gridSize = 20;
let snake;
let food;
let score;
let direction;
let gameInterval;
let gameSpeed = 150; // Milliseconds

function initializeGame() {
    snake = [
        { x: 10 * gridSize, y: 10 * gridSize },
        { x: 9 * gridSize, y: 10 * gridSize },
        { x: 8 * gridSize, y: 10 * gridSize }
    ];
    food = {};
    score = 0;
    direction = 'right';
    scoreDisplay.textContent = score;
    gameOverMessage.classList.add('d-none');
    generateFood();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function generateFood() {
    let newFoodX, newFoodY;
    let collisionWithSnake;
    do {
        newFoodX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        newFoodY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        collisionWithSnake = snake.some(segment => segment.x === newFoodX && segment.y === newFoodY);
    } while (collisionWithSnake);
    food = { x: newFoodX, y: newFoodY };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = (index === 0) ? 'green' : 'lightgreen';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.strokeStyle = 'darkred';
    ctx.strokeRect(food.x, food.y, gridSize, gridSize);
}

function update() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y -= gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
        case 'left':
            head.x -= gridSize;
            break;
        case 'right':
            head.x += gridSize;
            break;
    }

    // Check for collision with walls
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height
    ) {
        endGame();
        return;
    }

    // Check for collision with self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function endGame() {
    clearInterval(gameInterval);
    gameOverMessage.classList.remove('d-none');
    document.addEventListener('keydown', restartGame, { once: true });
}

function restartGame() {
    initializeGame();
}

function gameLoop() {
    update();
    draw();
}

document.addEventListener('keydown', e => {
    const keyPressed = e.key;
    const goingUp = direction === 'up';
    const goingDown = direction === 'down';
    const goingLeft = direction === 'left';
    const goingRight = direction === 'right';

    if (keyPressed === 'ArrowUp' && !goingDown) {
        direction = 'up';
    } else if (keyPressed === 'ArrowDown' && !goingUp) {
        direction = 'down';
    } else if (keyPressed === 'ArrowLeft' && !goingRight) {
        direction = 'left';
    } else if (keyPressed === 'ArrowRight' && !goingLeft) {
        direction = 'right';
    }
});

upButton.addEventListener('click', () => {
    if (direction !== 'down') {
        direction = 'up';
    }
});

downButton.addEventListener('click', () => {
    if (direction !== 'up') {
        direction = 'down';
    }
});

leftButton.addEventListener('click', () => {
    if (direction !== 'right') {
        direction = 'left';
    }
});

rightButton.addEventListener('click', () => {
    if (direction !== 'left') {
        direction = 'right';
    }
});

initializeGame();