"use strict";

const countDownElement = document.querySelector(".count-down"),
  startButton = document.querySelector(".start__btn"),
  endGameButton = document.querySelector(".end-game__btn"),
  retryButton = document.querySelector(".retry__btn"),
  windowCountElement = document.querySelector(".game-stats__window-count");

// >>=====>>====>>====#[<| Countdown |>]#====<<====<<=====<<

class Countdown {
  #interval = null;
  #countdownTime = 0;
  #remainingTime = 0;

  constructor(countdownTime) {
    this.#countdownTime = countdownTime;
    this.#remainingTime = countdownTime;
  }
  stop() {
    if (this.#interval) {
      clearInterval(this.#interval);
      this.#interval = null;
    }
    this.#remainingTime = this.#countdownTime;
  }
  start(handleOnUpdate, handleOnEnd) {
    const pastTime = Date.now();
    this.#interval = setInterval(() => {
      const currentTime = Date.now(),
        countdownInfo = {
          remainingTime: this.#remainingTime.toFixed(2),
          countdownTime: this.#countdownTime,
        };

      this.#remainingTime = +(
        this.#countdownTime -
        (currentTime - pastTime) / 1000
      ).toFixed(2);

      handleOnUpdate(countdownInfo);

      if (this.#remainingTime >= 0) return;

      handleOnEnd();
      this.stop();
    }, 50);
  }
  get remainingTime() {
    return this.#remainingTime.toFixed(2);
  }
}

// >>=====>>====>>====#[<| Game State |>]#====<<====<<=====<<

const gameState = {
  activeWindows: [],
  countdown: new Countdown(30),
  totalWindowsOpened: 0,
  firstClickedWindow: null,
  resetClick: () => {
    gameState.firstClickedWindow = null;
  },
  closeWindows: () => {
    gameState.activeWindows.forEach((colorWindow) => colorWindow.close());
    gameState.activeWindows = [];
    gameState.resetClick();
  },
  resetGame: () => {
    gameState.firstClickedWindow = gameState.countdown.stop();
    gameState.totalWindowsOpened = 0;
    gameState.closeWindows(); // refactor later
  },
};

// >>=====>>====>>====#[<| Game sets |>]#====<<====<<=====<<
startButton.addEventListener("click", startGame);
endGameButton.addEventListener("click", endGame);
retryButton.addEventListener("click", retryGame);

function startGame() {
  setGameScreen();

  countDownElement.textContent = gameState.countdown.remainingTime;

  for (let i = 0; i < 5; i++) {
    new ColoredWindow(handleWindowClick);
  }

  gameState.countdown.start(
    (countdownInfo) =>
      (countDownElement.textContent = countdownInfo.remainingTime),
    () => {
      gameState.closeWindows();
      windowCountElement.textContent = gameState.totalWindowsOpened;
      setEndScreen(false);
    }
  );
}

function endGame() {
  gameState.resetGame();
  setStartScreen();
}

function retryGame() {
  gameState.resetGame();
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

class ColoredWindow {
  static #WINDOW_COLORS = ["Amarillo", "Verde", "Cian", "Morado"];
  #WIDTH_PX = 320;
  #HEIGHT_PX = 160;

  handleOnClick;
  #windowReference = null;
  #color;

  constructor(
    handleOnClick,
    centered = false,
    color = ColoredWindow.#WINDOW_COLORS[
      Math.round(random(0, ColoredWindow.#WINDOW_COLORS.length - 1))
    ]
  ) {
    if (centered) {
      this.posX = 50;
      this.poxY = 50;
    }
    if (!centered) {
      this.posX = Math.round(random(0, screen.width));
      this.posY = Math.round(random(0, screen.height));
    }
    this.handleOnClick = handleOnClick;
    this.#color = color;
    this.open();
  }
  setColor(color) {
    if (color !== this.#color) this.#color = color;

    if (this.#windowReference) {
      this.#windowReference.window.top.document.title = this.color;
      this.#windowReference.document.body.className = `color-window ${this.color.toLowerCase()}`;
      this.#windowReference.document.querySelector(".color-name").textContent =
        this.color;
    }
  }
  setRandomColor() {
    this.setColor(
      ColoredWindow.#WINDOW_COLORS[
        Math.round(random(0, ColoredWindow.#WINDOW_COLORS.length - 1))
      ]
    );
  }
  open() {
    this.close();
    this.#windowReference = window.open(
      "./colorWindow.html",
      "_blank",
      `fullscreen=no,height=${this.#HEIGHT_PX},width=${
        this.#WIDTH_PX
      },resizable=no,titlebar=yes,
    left=${this.posX - this.#WIDTH_PX / 2},top=${
        this.posY - this.#HEIGHT_PX / 2
      }`
    );

    gameState.totalWindowsOpened++; // Refactor later

    try {
      this.#windowReference.addEventListener("load", () => {
        this.setColor(this.color);
        this.#windowReference.addEventListener("click", () => {
          if (this.#windowReference.document.hasFocus) this.handleOnClick(this);
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

    gameState.activeWindows.push(this); // Refactor later
  }
  close() {
    if (!this.#windowReference) return;
    this.#windowReference.close();
    this.#windowReference = null;

    gameState.activeWindows = gameState.activeWindows.filter(
      (openedWindow) => openedWindow !== this
    ); // Refactor later
  }
  get color() {
    return this.#color;
  }
}

function handleWindowClick(clickedWindow) {
  if (!gameState.firstClickedWindow) {
    console.log("First click");
    gameState.firstClickedWindow = clickedWindow;
    return;
  }

  const firstColorName = gameState.firstClickedWindow.color,
    secondColorName = clickedWindow.color;

  if (firstColorName !== secondColorName) {
    console.log("Second click: colors are not the same");
    gameState.resetClick();
    return;
  }

  if (gameState.firstClickedWindow !== clickedWindow) {
    console.log("Second click: windows are different");
    gameState.firstClickedWindow.close();
    clickedWindow.close();
    gameState.resetClick();
    if (!gameState.activeWindows.length) {
      setEndScreen(true);
      gameState.countdown.stop();
      windowCountElement.textContent = gameState.totalWindowsOpened;
    }

    return;
  }
  console.log("Second click: same window clicked");
  clickedWindow.setRandomColor();
  new ColoredWindow(handleWindowClick);
  gameState.resetClick();
}
