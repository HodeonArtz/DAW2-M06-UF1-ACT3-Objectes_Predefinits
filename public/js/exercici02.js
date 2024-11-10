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

const countdown = {
  interval: null,
  remainingTime: gameTime,
  stop: () => {
    if (countdown.interval) {
      clearInterval(countdown.interval);
      countdown.interval = null;
    }
    countdown.remainingTime = gameTime;
  },
  start: (handleOnUpdate, handleOnEnd) => {
    const pastTime = Date.now();
    countdown.interval = setInterval(() => {
      const currentTime = Date.now();
      countdown.remainingTime = +(
        gameTime -
        (currentTime - pastTime) / 1000
      ).toFixed(2);

      handleOnUpdate();
      if (countdown.remainingTime >= 0) return;
      handleOnEnd();
      countdown.stop();
    }, 50);
  },
  getSeconds: () => countdown.remainingTime.toFixed(2),
};

// >>=====>>====>>====#[<| Game sets |>]#====<<====<<=====<<
startButton.addEventListener("click", startGame);
endGameButton.addEventListener("click", endGame);
retryButton.addEventListener("click", retryGame);

function startGame() {
  setGameScreen();

  countDownElement.textContent = countdown.getSeconds();

  for (let i = 0; i < 5; i++) {
    new ColoredWindow(handleWindowClick);
  }

  countdown.start(
    () => (countDownElement.textContent = countdown.getSeconds()),
    () => {
      closeWindows();
      windowCountElement.textContent = totalWindowsOpened;
      setEndScreen(false);
    }
  );
}

function resetGame() {
  countDownTime = gameTime;
  countDownElement.textContent = countDownTime;
  totalWindowsOpened = 0;
  closeWindows();
  countdown.stop();
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
      Math.round(random(0, backgroundColors.length - 1))
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
        Math.round(random(0, backgroundColors.length - 1))
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

    totalWindowsOpened++; // Refactor later

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

    activeWindows.push(this); // Refactor later
  }
  close() {
    if (!this.#windowReference) return;
    this.#windowReference.close();
    this.#windowReference = null;

    activeWindows = activeWindows.filter(
      (openedWindow) => openedWindow !== this
    ); // Refactor later
  }
  get color() {
    return this.#color;
  }
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

  const firstColorName = firstClickedWindow.color,
    secondColorName = clickedWindow.color;

  if (firstColorName !== secondColorName) {
    console.log("Second click: colors are not the same");
    resetClick();
    return;
  }

  if (firstClickedWindow !== clickedWindow) {
    console.log("Second click: windows are different");
    firstClickedWindow.close();
    clickedWindow.close();
    resetClick();
    if (!activeWindows.length) {
      setEndScreen(true);
      countdown.stop();
      windowCountElement.textContent = totalWindowsOpened;
    }

    return;
  }
  console.log("Second click: same window clicked");
  clickedWindow.setRandomColor();
  new ColoredWindow(handleWindowClick);
  resetClick();
}
