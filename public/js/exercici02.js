"use strict";

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

//=====/----/====||====#[<| ColoredWindow |>]#====||====/----/=====//

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
      this.posX = window.screen.width / 2;
      this.posY = window.screen.height / 2;
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

// >>=====>>====>>====#[<| Game State |>]#====<<====<<=====<<

const gameState = {
  activeWindows: [],
  countdown: new Countdown(30),
  totalWindowsOpened: 0,
  firstClickedWindow: null,
  openNewWindow: (handleOnClick, centered = false) => {
    gameState.activeWindows.push(new ColoredWindow(handleOnClick, centered));
    gameState.totalWindowsOpened++;
  },
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
    gameState.closeWindows();
  },
};

// >>=====>>====>>====#[<| View |>]#====<<====<<=====<<

const view = {
  elements: {
    countdown: document.querySelector(".count-down"),
    windowTotalCount: document.querySelector(".game-stats__window-count"),
    resultVerb: document.querySelector(".msg__verb"),
    endMessage: document.querySelector(".msg__text"),
    screen: {
      start: document.querySelector(".start"),
      game: document.querySelector(".game"),
      end: document.querySelector(".end"),
    },
    button: {
      start: document.querySelector(".start__btn"),
      end: document.querySelector(".end-game__btn"),
      retry: document.querySelector(".retry__btn"),
      handleOnClickStart: (handleOnClick) =>
        view.elements.button.start.addEventListener("click", handleOnClick),
      handleOnClickEnd: (handleOnClick) =>
        view.elements.button.end.addEventListener("click", handleOnClick),
      handleOnClickRetry: (handleOnClick) =>
        view.elements.button.retry.addEventListener("click", handleOnClick),
    },
  },
  hideAllScreens: () => {
    Object.values(view.elements.screen).forEach((screen) => {
      screen.classList.add("hidden");
    });
  },
  setStartScreen: () => {
    view.hideAllScreens();
    view.elements.screen.start.classList.remove("hidden");
  },
  setGameScreen: () => {
    view.hideAllScreens();
    view.elements.screen.game.classList.remove("hidden");
  },
  setEndScreen: (isGameWon) => {
    view.hideAllScreens();
    view.elements.screen.end.classList.remove("hidden");
    view.elements.resultVerb.textContent = isGameWon ? "ganado" : "perdido";
    view.elements.endMessage.textContent = isGameWon
      ? "¡Enhorabuena!"
      : "¡Inténtalo otra vez!";
    if (isGameWon) view.elements.button.end.classList.remove("hidden");
    if (!isGameWon) view.elements.button.end.add("hidden");
  },
  setCountdown: (countdownTime) =>
    (view.elements.countdown.textContent = countdownTime),
  setOpenedWindowsCount: (count) =>
    (view.elements.windowTotalCount.textContent = count),
};

// >>=====>>====>>====#[<| Gamelogic |>]#====<<====<<=====<<

view.elements.button.handleOnClickStart(startGame);
view.elements.button.handleOnClickEnd(endGame);
view.elements.button.handleOnClickRetry(retryGame);

function startGame() {
  view.setGameScreen();

  view.setCountdown(gameState.countdown.remainingTime);
  gameState.openNewWindow(handleWindowClick, true);
  for (let i = 0; i < 4; i++) {
    gameState.openNewWindow(handleWindowClick);
  }

  gameState.countdown.start(
    (countdownInfo) => view.setCountdown(countdownInfo.remainingTime),
    () => {
      gameState.closeWindows();
      view.setOpenedWindowsCount(gameState.totalWindowsOpened);
      view.setEndScreen(false);
    }
  );
}

function endGame() {
  gameState.resetGame();
  view.setStartScreen();
}

function retryGame() {
  gameState.resetGame();
  view.setGameScreen();
  startGame();
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
      view.setEndScreen(true);
      gameState.countdown.stop();
      view.setOpenedWindowsCount(gameState.totalWindowsOpened);
    }

    return;
  }
  console.log("Second click: same window clicked");
  clickedWindow.setRandomColor();
  gameState.openNewWindow(handleWindowClick);
  gameState.resetClick();
}
