// Yourtube: https://www.youtube.com/watch?v=qCBiKJbLcFI

// To do:
// - make the enemies blow up when they get hit BOOM!
// - make a start screen
// - make a level 2
// - find a better noise for enemies dying
// - swap the current lasers for pixel lazer images
// - give the player the choice of ship

import EnemyController from "/src/enemyController.js";
import Player from "/src/player.js";
import BulletController from "/src/bulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 625;

const background = new Image();
background.src = "src/images/pixel_stars.jpg";

// const gameStartAudio = new Audio("src/audio/computerNoise_000.ogg");
// gameStartAudio.volume = 0.08;
// gameStartAudio.play();

// bullet controllers
const playerBulletController = new BulletController(
  canvas,
  15,
  "limegreen",
  "player"
);
const enemyBulletController = new BulletController(canvas, 4, "red", "enemy");

const enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController
);
const player = new Player(canvas, 18, playerBulletController);

let isGameOver = false;
let didWin = false;

// game loop
function game() {
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

function checkGameOver() {
  if (isGameOver) {
    return;
  }
  if (
    enemyBulletController.collideWith(player) ||
    enemyController.collideWith(player)
  ) {
    isGameOver = true;
    let playerDeathSound = new Audio("/src/audio/fast-game-over.wav");
    playerDeathSound.volume = 0.15;
    // playerDeathSound.play();
  }
  if (enemyController.enemyRows.length === 0) {
    didWin = true;
    isGameOver = true;
    let playerWinSound = new Audio("/src/audio/small-win.wav");
    playerWinSound.volume = 0.25;
    playerWinSound.play();
  }
}

function displayGameOver() {
  if (isGameOver) {
    // you won!
    if (didWin) {
      let text = "You Won!";
      ctx.fillStyle = "white";
      ctx.font = "70px Courier New";
      ctx.fillText(text, canvas.width / 4, canvas.height / 2);
    }
    // you lost :(
    else {
      let text = "Game Over!";
      ctx.fillStyle = "white";
      ctx.font = "70px Courier New";
      ctx.fillText(text, canvas.width / 6, canvas.height / 2);

      // ctx.font = "8px Courier New";
      // let text2 = "You Blow!";
      // ctx.fillText(text2, canvas.width / 2 - 10, (canvas.height * 4) / 7);
    }
  }
}

setInterval(game, 1000 / 20);
