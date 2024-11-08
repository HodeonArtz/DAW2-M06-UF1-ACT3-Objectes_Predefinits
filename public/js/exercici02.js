"use strict";

const countDownElement = document.querySelector(".count-down"),
  startButton = document.querySelector(".start__btn"),
  endGameButton = document.querySelector(".end-game__btn"),
  retryButton = document.querySelector(".retry__btn"),
  windowCountElement = document.querySelector(".game-stats__window-count");

const gameTime = 30,
  windowWidthPx = 320,
  windowHeightPx = 160,
  backgroundColors = ["Amarillo", "Verde", "Cian", "Morado"];

let activeWindows = [],
  countDownTime = gameTime,
  totalWindowsOpened = 0,
  firstClickedWindow = null;

// >>=====>>====>>====#[<| Countdown |>]#====<<====<<=====<<

let countDownInterval = null;

function startCountDown() {
  stopCountDown();
  countDownInterval = setInterval(updateGameCountdown, 1000);
}

function updateGameCountdown() {
  // View countdown
  countDownElement.textContent = --countDownTime;

  // Stop countdown
  if (countDownTime > 0) return;

  closeWindows();

  stopCountDown();

  windowCountElement.textContent = totalWindowsOpened;
  setEndScreen(false);
}

function stopCountDown() {
  if (!countDownInterval) return;
  clearInterval(countDownInterval);
  countDownInterval = null;
}

// >>=====>>====>>====#[<| Game sets |>]#====<<====<<=====<<
startButton.addEventListener("click", startGame);
endGameButton.addEventListener("click", endGame);
retryButton.addEventListener("click", retryGame);

function startGame() {
  setGameScreen();
  countDownTime = gameTime;
  countDownElement.textContent = countDownTime;

  for (let i = 0; i < 5; i++) {
    openNewColorWindow();
  }

  startCountDown();
}

function resetGame() {
  countDownTime = gameTime;
  countDownElement.textContent = countDownTime;
  totalWindowsOpened = 0;
  closeWindows();
  stopCountDown();
}

function endGame() {
  resetGame();
  setStartScreen();
}

function retryGame() {
  resetGame();
  setGameScreen();
  startGame();
}

// >>=====>>====>>====#[<| Screens |>]#====<<====<<=====<<

const startScreenElement = document.querySelector(".start"),
  gameScreenElement = document.querySelector(".game"),
  endScreenElement = document.querySelector(".end"),
  gameResultVerbEl = endScreenElement.querySelector(".msg__verb"),
  gameMsgElement = endScreenElement.querySelector(".msg__text");

function hideScreens() {
  startScreenElement.classList.add("hidden");
  gameScreenElement.classList.add("hidden");
  endScreenElement.classList.add("hidden");
}

function setStartScreen() {
  hideScreens();
  startScreenElement.classList.remove("hidden");
}

function setGameScreen() {
  hideScreens();
  gameScreenElement.classList.remove("hidden");
}

function setEndScreen(isPlayerWon) {
  hideScreens();
  endScreenElement.classList.remove("hidden");
  gameResultVerbEl.textContent = isPlayerWon ? "ganado" : "perdido";
  gameMsgElement.textContent = isPlayerWon
    ? "¡Enhorabuena!"
    : "¡Inténtalo otra vez!";
  if (isPlayerWon) endGameButton.classList.remove("hidden");
  if (!isPlayerWon) endGameButton.classList.add("hidden");
}

//=====/----/====||====#[<| Game logic |>]#====||====/----/=====//

function setRandomBgColor(
  colorWindow,
  color = backgroundColors[Math.round(random(0, backgroundColors.length - 1))]
) {
  colorWindow.window.top.document.title = color;
  colorWindow.document.body.className = `color-window ${color.toLowerCase()}`;
  // setting this class automatically changes window's color
  colorWindow.document.querySelector(".color-name").textContent = color;
}

function openNewColorWindow(
  posX = Math.round(random(0, screen.width)),
  posY = Math.round(random(0, screen.height))
) {
  const newWindow = window.open(
    "./colorWindow.html",
    "_blank",
    `fullscreen=no,height=${windowHeightPx},width=${windowWidthPx},resizable=no,titlebar=yes,
    left=${posX - windowWidthPx / 2},top=${posY - windowHeightPx / 2}`
  );
  totalWindowsOpened++;
  activeWindows.push(newWindow);
  try {
    newWindow.addEventListener("load", () => {
      setRandomBgColor(newWindow);
      newWindow.addEventListener("click", () => {
        // mostrar animación de seleccionado
        if (newWindow.document.hasFocus) handleWindowClick(newWindow);
      });
    });
  } catch (error) {
    alert(
      "Activa el permiso de ventanas emergentes para esta página para que funcione el juego."
    );
    console.error(
      "Activa el permiso de ventanas emergentes para esta página para que funcione el juego."
    );
    console.error(error);
  }
}

function closeColorWindow(...colorWindows) {
  colorWindows.forEach((colorWindow) => {
    console.log(colorWindow);
    colorWindow.close();
    activeWindows = activeWindows.filter(
      (openedWindow) => openedWindow !== colorWindow
    );
  });
}

function closeWindows() {
  activeWindows.forEach((colorWindow) => colorWindow.close());
  activeWindows = [];
  resetClick();
}

function resetClick() {
  firstClickedWindow = null;
}

function handleWindowClick(clickedWindow) {
  if (!firstClickedWindow) {
    console.log("First click");
    firstClickedWindow = clickedWindow;
    return;
  }

  const firstColorName =
      firstClickedWindow.document.querySelector(".color-name").textContent,
    secondColorName =
      clickedWindow.document.querySelector(".color-name").textContent;

  if (firstColorName !== secondColorName) {
    console.log("Second click: colors are not the same");
    resetClick();
    return;
  }

  if (firstClickedWindow !== clickedWindow) {
    console.log("Second click: windows are different");
    closeColorWindow(firstClickedWindow, clickedWindow);
    resetClick();
    if (!activeWindows.length) {
      setEndScreen(true);
      stopCountDown();
      windowCountElement.textContent = totalWindowsOpened;
    }

    return;
  }
  console.log("Second click: same window clicked");
  const newRandomColor = backgroundColors.filter(
    (color) => color != secondColorName.trim()
  )[Math.round(random(0, backgroundColors.length - 2))];
  setRandomBgColor(clickedWindow, newRandomColor);
  openNewColorWindow();
  resetClick();
}
