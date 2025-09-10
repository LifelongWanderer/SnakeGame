const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const speedUpBtn = document.getElementById('speedUp');
const speedDownBtn = document.getElementById('speedDown');
const speedDisplay = document.getElementById('speedDisplay');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameSpeed = 1;

highScoreElement.textContent = highScore;

function randomFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function drawGame() {
    clearCanvas();
    
    if (gamePaused) {
        drawPauseScreen();
        return;
    }
    
    moveSnake();
    
    if (checkGameOver()) {
        gameOver();
        return;
    }
    
    checkFoodCollision();
    drawFood();
    drawSnake();
    
    if (gameRunning) {
        setTimeout(drawGame, 200 - (gameSpeed * 15));
    }
}

function clearCanvas() {
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            drawTankHead(segment.x, segment.y);
        } else {
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }
    });
}

function drawTankHead(x, y) {
    const centerX = x * gridSize + gridSize / 2;
    const centerY = y * gridSize + gridSize / 2;
    const size = gridSize - 4;
    
    if (dx === 1) {
        ctx.fillStyle = '#2E7D32';
        ctx.fillRect(x * gridSize + 2, y * gridSize + 4, size, size - 4);
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(x * gridSize + size - 2, y * gridSize + 6, 4, size - 8);
    } else if (dx === -1) {
        ctx.fillStyle = '#2E7D32';
        ctx.fillRect(x * gridSize + 2, y * gridSize + 4, size, size - 4);
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(x * gridSize + 2, y * gridSize + 6, 4, size - 8);
    } else if (dy === 1) {
        ctx.fillStyle = '#2E7D32';
        ctx.fillRect(x * gridSize + 4, y * gridSize + 2, size - 4, size);
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(x * gridSize + 6, y * gridSize + size - 2, size - 8, 4);
    } else if (dy === -1) {
        ctx.fillStyle = '#2E7D32';
        ctx.fillRect(x * gridSize + 4, y * gridSize + 2, size - 4, size);
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(x * gridSize + 6, y * gridSize + 2, size - 8, 4);
    } else {
        ctx.fillStyle = '#66BB6A';
        ctx.fillRect(x * gridSize + 2, y * gridSize + 2, size, size);
    }
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    if (head.x !== food.x || head.y !== food.y) {
        snake.pop();
    }
}

function drawFood() {
    const centerX = food.x * gridSize + gridSize / 2;
    const centerY = food.y * gridSize + gridSize / 2;
    const size = gridSize / 2 - 2;
    
    ctx.fillStyle = '#ff6b6b';
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size);
    ctx.lineTo(centerX + size, centerY);
    ctx.lineTo(centerX, centerY + size);
    ctx.lineTo(centerX - size, centerY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#ffcccc';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size * 0.6);
    ctx.lineTo(centerX + size * 0.6, centerY);
    ctx.lineTo(centerX, centerY + size * 0.6);
    ctx.lineTo(centerX - size * 0.6, centerY);
    ctx.closePath();
    ctx.fill();
}

function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        randomFood();
    }
}

function checkGameOver() {
    const head = snake[0];
    
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function gameOver() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '20px Arial';
    ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('按重置按钮重新开始', canvas.width / 2, canvas.height / 2 + 40);
}

function drawPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏暂停', canvas.width / 2, canvas.height / 2);
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        randomFood();
        drawGame();
    }
}

function pauseGame() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        if (!gamePaused) {
            drawGame();
        }
    }
}

function resetGame() {
    gameRunning = false;
    gamePaused = false;
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 1;
    scoreElement.textContent = score;
    speedDisplay.textContent = gameSpeed;
    clearCanvas();
    drawSnake();
}

function changeSpeed(delta) {
    if (!gameRunning) {
        gameSpeed = Math.max(1, Math.min(10, gameSpeed + delta));
        speedDisplay.textContent = gameSpeed;
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

function changeDirection(newDx, newDy) {
    if (gameRunning && !gamePaused) {
        dx = newDx;
        dy = newDy;
    }
}

upBtn.addEventListener('click', () => {
    if (dy !== 1) {
        changeDirection(0, -1);
    }
});

downBtn.addEventListener('click', () => {
    if (dy !== -1) {
        changeDirection(0, 1);
    }
});

leftBtn.addEventListener('click', () => {
    if (dx !== 1) {
        changeDirection(-1, 0);
    }
});

rightBtn.addEventListener('click', () => {
    if (dx !== -1) {
        changeDirection(1, 0);
    }
});

speedUpBtn.addEventListener('click', () => changeSpeed(1));
speedDownBtn.addEventListener('click', () => changeSpeed(-1));

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);

randomFood();
drawSnake();