// Youtube: https://www.youtube.com/watch?v=qCBiKJbLcFI

// To do:
// BOOM - made the enemies blow up when they get hit
// BOOM - make a start screen
// BOOM - make a level 2
// BOOM - make level 1 --> level 2 noise
// BOOM - make level 2 have different enemies
// BOOM - make the bullets die when they get half way down the ship
// BOOM - make level 3
// BOOM - level 3 bullets are blue
// - get player shoot sounds back
// BOOM - add a function to reset all variables in the case of gameover
// BOOM - on the game over screen, allow hitting space bar to start over
// - give the player the choice of ship

import EnemyController from "/src/enemyController.js";
import Player from "/src/player.js";
import BulletController from "/src/bulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_STATE = {
  STARTSCREEN: 0,
  RUNNING: 1,
  GAMEOVER: 2
};
let gameState = GAME_STATE.STARTSCREEN;
let current_level = 3;

canvas.width = 600;
canvas.height = 625;

const background = new Image();
background.src = "/src/images/pixel_stars.jpg";

const gameStartAudio = new Audio("src/audio/computerNoise_000.ogg");
gameStartAudio.volume = 0.022;
const levelUpSound = new Audio("/src/audio/level-up.wav");
levelUpSound.volume = 0.35;
const playerWinSound = new Audio("/src/audio/small-win.wav");
playerWinSound.volume = 0.25;
const playerDeathSound = new Audio("/src/audio/fast-game-over.wav");
playerDeathSound.volume = 0.15;

// bullet controllers
let playerBulletController = new BulletController(
  canvas,
  15,
  "#9df716",
  "player",
  current_level
);
let enemyBulletController = new BulletController(
  canvas,
  4,
  "red",
  "enemy",
  current_level
);

let enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController,
  current_level
);
let player = new Player(canvas, 18, playerBulletController);

let isGameOver = false;
let didWin = false;

let startGame = (event) => {
  if (event.code === "Space") {
    if (gameState === GAME_STATE.STARTSCREEN || isGameOver) {
      // if you lost, reset everything
      if (isGameOver) {
        current_level = 1;
        isGameOver = false;
        resetAllVariables();
      }
      gameState = GAME_STATE.RUNNING;
      gameStartAudio.play();
    }
  }
};

document.addEventListener("keydown", startGame);

// game loop
function game() {
  if (gameState === GAME_STATE.STARTSCREEN) {
    showStartScreen(ctx);
  }
  if (gameState === GAME_STATE.RUNNING) {
    checkGameOver();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver();
    if (!isGameOver) {
      enemyController.draw(ctx);
      player.draw(ctx);
      playerBulletController.draw(ctx);
      enemyBulletController.draw(ctx);
    }
  }
}

function resetAllVariables() {
  playerBulletController = new BulletController(
    canvas,
    15,
    "#9df716",
    "player",
    current_level
  );
  enemyBulletController = new BulletController(
    canvas,
    4,
    "red",
    "enemy",
    current_level
  );

  enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController,
    current_level
  );
  player = new Player(canvas, 18, playerBulletController);
}

function showStartScreen(ctx) {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  const text1 = "Welcome to";
  const text1b = "Alien Invaders";
  ctx.fillStyle = "white";
  ctx.font = "60px Courier New";
  ctx.fillText(text1, 120, canvas.height / 3);
  ctx.fillText(text1b, 50, canvas.height / 2 - 20);

  ctx.font = "20px Courier New";
  const text2 = "by Davis Ulrich";
  ctx.fillText(text2, canvas.width / 3, (3 * canvas.height) / 5);
  const text3 = "6/16/22";
  ctx.fillText(text3, canvas.width / 2.4, (3 * canvas.height) / 5 + 30);

  const text4 = "Press Space Bar to Start";
  ctx.fillText(text4, canvas.width / 3.8, (5 * canvas.height) / 7 + 25);
}

function checkGameOver() {
  if (isGameOver) {
    return;
  }
  if (
    enemyBulletController.collideWith(player) ||
    enemyController.collideWith(player)
  ) {
    isGameOver = true;
    playerDeathSound.play();
  }
  if (enemyController.enemyRows.length === 0) {
    if (current_level === 1) {
      current_level = 2;
      levelUpSound.play();
      enemyController = new EnemyController(
        canvas,
        enemyBulletController,
        playerBulletController,
        current_level
      );
      return;
    } else if (current_level === 2) {
      current_level = 3;
      levelUpSound.play();
      enemyController = new EnemyController(
        canvas,
        enemyBulletController,
        playerBulletController,
        current_level
      );
      return;
    } else if (current_level === 3) {
      didWin = true;
      isGameOver = true;
      playerWinSound.play();
    }
  }
}

function displayGameOver() {
  if (isGameOver) {
    // you won!
    if (didWin) {
      let text = "You Won!";
      ctx.fillStyle = "white";
      ctx.font = "70px Courier New";
      ctx.fillText(text, canvas.width / 4, canvas.height / 2.2);

      let text2 = "Press Space Bar to Restart";
      ctx.font = "20px Courier New";
      ctx.fillText(text2, canvas.width / 4, (3 * canvas.height) / 5);
    }
    // you lost :(
    else {
      let text = "Game Over!";
      ctx.fillStyle = "white";
      ctx.font = "70px Courier New";
      ctx.fillText(text, canvas.width / 6, canvas.height / 2.2);

      let text2 = "Press Space Bar to Restart";
      ctx.font = "20px Courier New";
      ctx.fillText(text2, canvas.width / 4, (3 * canvas.height) / 5);
    }
  }
}

setInterval(game, 1000 / 20);
