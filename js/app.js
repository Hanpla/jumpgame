BLOCKS = [
    ['10vh', '70vh'],
    ['20vh', '60vh'],
    ['30vh', '50vh'],
    ['40vh', '40vh'],
    ['50vh', '30vh'],
    ['60vh', '20vh'],
    ['70vh', '10vh'],
]

// DOM

const wrap = document.getElementById('wrap');
const over = document.querySelector('.over')
const btn = document.querySelector('.retry');


// 변수

let playerY = 450;
let gravityPower = 0.5;
let blockSpeed = 4;
let blockTime = 1500;
let jumpPower = -50;
let maxGravity = 10;
let currentGravity = 0;
let isGameover = false;
// init

init();
jump();

// 함수

function init() {
    createPlayer();
    createBlock();
    gameInterval = setInterval(createBlock, blockTime);
}

function createPlayer() {
    const player = document.createElement('div');
    player.className = 'player';
    wrap.appendChild(player);
    applyGravity(player);
}

function applyGravity(player) {
    function animate() {
        currentGravity += gravityPower;
        if (currentGravity > maxGravity) {
            currentGravity = maxGravity;
        }
        playerY += currentGravity;
        player.style.top = playerY + 'px';
        setTimeout(function () {
            gravityId = requestAnimationFrame(animate);
        }, 1000 / 60);
    }
    animate();
}

function jump() {
    document.addEventListener('keydown', (event) => {
        if (event.keyCode === 32) {
            playerY += jumpPower;
            currentGravity = 0;
        }
    });
}

function createBlock() {
    const blockBox = document.createElement('div');
    blockBox.className = 'blockBox';
    const blockTop = document.createElement('div');
    const blockBot = document.createElement('div');
    const randomIndex = Math.floor(Math.random() * BLOCKS.length);
    const blockHeight = BLOCKS[randomIndex];
    blockTop.className = 'blockTop';
    blockTop.style.height = blockHeight[0];
    blockBot.className = 'blockBot';
    blockBot.style.height = blockHeight[1];
    blockBox.appendChild(blockTop);
    blockBox.appendChild(blockBot);
    wrap.appendChild(blockBox);
    moveBlock(blockBox);
}

function moveBlock(blockBox) {
    let position = wrap.offsetWidth;
    function animate() {
        position -= blockSpeed;
        blockBox.style.left = position + 'px';
        isColliding();
        if (position < -blockBox.offsetWidth) {
            blockBox.remove();
            return;
        }
        animationId = requestAnimationFrame(animate);
    }
    animate();
}

function isColliding() {
    const player = document.querySelector('.player');
    const playerRect = player.getBoundingClientRect();
    const blockTop = document.querySelector('.blockTop');
    const blockBot = document.querySelector('.blockBot');
    const topRect = blockTop.getBoundingClientRect();
    const botRect = blockBot.getBoundingClientRect();
    const playerBorderTop = playerRect.top + parseFloat(getComputedStyle(player).borderTopWidth);
    const playerBorderBottom = playerRect.bottom - parseFloat(getComputedStyle(player).borderBottomWidth);
    const playerBorderRight = playerRect.right - parseFloat(getComputedStyle(player).borderRightWidth);
    const wrapRect = wrap.getBoundingClientRect();

    if (
        playerBorderRight > topRect.left &&
        playerBorderTop < topRect.bottom
    ) {
        gameOver();
    }
    if (
        playerBorderRight > botRect.left &&
        playerBorderBottom > botRect.top
    ) {
        gameOver();
    }
    if (
        playerBorderTop <= wrapRect.top ||
        playerBorderBottom >= wrapRect.bottom
    ) {
        gameOver();
    }
}


function gameOver() {
    isGameover = true;
    clearInterval(gameInterval);
    cancelAnimationFrame(animationId);
    cancelAnimationFrame(gravityId);
    blockSpeed = 0;
    over.style.display = 'block';
    document.addEventListener('keydown', restartOnSpace);
    wrap.style.backgroundColor = 'rgba(0,0,0,0.2)'
}

btn.addEventListener('click', () => {
    restartGame();
});

function restartOnSpace(event) {
    if (event.code === 'KeyR') {
        restartGame();
        document.removeEventListener('keydown', restartOnSpace);
    }
}

function restartGame() {
    isGameover = false;
    wrap.innerHTML = '';
    blockSpeed = 4;
    playerY = 450;
    over.style.display = 'none';
    wrap.style.backgroundColor = '';

    init();
}


