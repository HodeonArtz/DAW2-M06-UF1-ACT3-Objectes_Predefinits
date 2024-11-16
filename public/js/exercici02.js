"use strict";
import Countdown from "../js/exercici02/Countdown.js";
import ColoredWindow from "../js/exercici02/ColoredWindow.js";

// >>=====>>====>>====#[<| Game State |>]#====<<====<<=====<<

const gameState = {
  activeWindows: [],
  countdown: new Countdown(30),
  totalWindowsOpened: 0,
  firstClickedWindow: null,
  isGameWon: false,
  openNewWindow: (handleOnClick, centered = false) => {
    gameState.activeWindows.push(new ColoredWindow(handleOnClick, centered));
    gameState.totalWindowsOpened++;
  },
  closeWindow: (coloredWindow) => {
    gameState.activeWindows = gameState.activeWindows.filter(
      (openedWindow) => openedWindow !== coloredWindow
    );
    coloredWindow.close();
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
    gameState.isGameWon = false;
    gameState.firstClickedWindow = gameState.countdown.stop();
    gameState.totalWindowsOpened = 0;
    gameState.closeWindows();
  },
  setGameWon: () => (gameState.isGameWon = true),
  getStats: () => {
    return {
      isGameWon: gameState.isGameWon,
      totalWindowsOpened: gameState.totalWindowsOpened,
    };
  },
};

function setCookie(data, daysExpire) {
  Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .forEach((dataString) => {
      const dateExpirement = new Date();
      dateExpirement.setTime(
        dateExpirement.getTime() + daysExpire * 24 * 60 * 60 * 1000
      );
      document.cookie = `${dataString};expires=${dateExpirement.toUTCString()};path=/`;
    });
}

function getCookieData() {
  const cookieData = Object.assign(
    {},
    ...decodeURIComponent(document.cookie)
      .split(";")
      // .slice(0, -2)
      .map((data) => {
        const dataArr = data.split("=");
        const dataObj = {};
        dataObj[`${dataArr[0]}`] = dataArr[1];
        return dataObj;
      })
  );
  cookieData.totalWindowsOpened = +cookieData[" totalWindowsOpened"];
  return cookieData;
}

// >>=====>>====>>====#[<| View |>]#====<<====<<=====<<
function getElement(selector) {
  return document.querySelector(selector);
}

const view = {
  elements: {
    main: getElement("main"),
    inGameMessage: getElement(".game__message"),
    screen: {
      start: getElement(".start"),
      game: getElement(".game"),
      end: getElement(".end"),
    },
    button: {
      start: getElement(".btn__start"),
      end: getElement(".btn__end-game"),
      retry: getElement(".btn__retry"),
      stop: getElement(".btn__stop"),
      handleOnClickStart: (handleOnClick) =>
        view.elements.button.start.addEventListener("click", handleOnClick),
      handleOnClickEnd: (handleOnClick) =>
        view.elements.button.end.addEventListener("click", handleOnClick),
      handleOnClickRetry: (handleOnClick) =>
        view.elements.button.retry.addEventListener("click", handleOnClick),
      handleOnClickStop: (handleOnClick) =>
        view.elements.button.stop.addEventListener("click", handleOnClick),
    },
    lastGame: {
      box: getElement(".last-game-stats"),
      gameResult: getElement(".stats__verb"),
      windowTotalCount: getElement(".stats__window-count .count-number"),
    },
  },

  setDefaultGameScreen: function () {
    view.elements.screen.game.classList.remove("game--correct");
    view.elements.screen.game.classList.remove("game--wrong");
  },
  hideAllScreens: () => {
    Object.values(view.elements.screen).forEach((screen) => {
      screen.classList.add("hidden");
    });
  },
  setStartScreen: () => {
    view.hideAllScreens();
    view.elements.screen.start.classList.remove("hidden");
    view.elements.main.classList.remove("game-active");
    view.setDefaultGameScreen();
  },
  setGameScreen: () => {
    view.hideAllScreens();
    view.elements.screen.game.classList.remove("hidden");
    view.elements.main.classList.add("game-active");
    view.elements.screen.end.classList.remove("end--won");
    view.elements.screen.end.classList.remove("end--lost");
  },
  setEndScreen: (isGameWon) => {
    view.hideAllScreens();

    view.elements.screen.end.classList.remove("end--won");
    view.elements.screen.end.classList.remove("end--lost");
    view.elements.screen.end.classList.add(
      `end--${isGameWon ? "won" : "lost"}`
    );
    view.elements.screen.end.classList.remove("hidden");
    getElement(".msg__verb").textContent = isGameWon ? "ganado" : "perdido";
    getElement(".msg__text").textContent = isGameWon
      ? "¡Enhorabuena!"
      : "¡Inténtalo otra vez!";
    if (isGameWon) view.elements.button.end.classList.remove("hidden");
    if (!isGameWon) view.elements.button.end.classList.add("hidden");
    view.elements.main.classList.remove("game-active");
    view.setDefaultGameScreen();
  },
  setCountdown: (countdownTime) => {
    const countdownEl = getElement(".count-down");
    countdownEl.textContent = countdownTime;
    if (countdownTime < 5) {
      countdownEl.dataset.time = "few-secs-remaining";
      return;
    }
    countdownEl.dataset.time = "";
  },
  setOpenedWindowsCount: (count) =>
    (getElement(".game-stats__window-count").textContent = count),
  setLastGameStats: (dataStats) => {
    if (dataStats.isGameWon === undefined) {
      view.elements.lastGame.box.classList.add("hidden");
      return;
    }
    view.elements.lastGame.box.classList.remove("hidden");
    view.elements.lastGame.gameResult.textContent =
      dataStats.isGameWon == "true" ? "Ganada" : "Perdida";
    view.elements.lastGame.windowTotalCount.textContent =
      dataStats.totalWindowsOpened;
  },
  setWindows: ({ firstWindow, secondWindow }) => {
    const firstWindowEl = getElement(".first-window"),
      secondWindowEl = getElement(".second-window");
    firstWindowEl.classList.add("grayed");
    firstWindowEl.textContent = "?";
    firstWindowEl.dataset.color = "";
    secondWindowEl.classList.add("grayed");
    secondWindowEl.textContent = "?";
    secondWindowEl.dataset.color = "";

    if (firstWindow) {
      firstWindowEl.classList.remove("grayed");
      firstWindowEl.dataset.color = firstWindow.color.toLowerCase();
      firstWindowEl.textContent = firstWindow.color;
    }
    if (secondWindow) {
      secondWindowEl.classList.remove("grayed");
      secondWindowEl.dataset.color = secondWindow.color.toLowerCase();
      secondWindowEl.textContent = secondWindow.color;
    }
  },

  setCorrectGameScreen: function () {
    view.elements.screen.game.classList.add("game--correct");
  },
  setWrongGameScreen: function () {
    view.elements.screen.game.classList.add("game--wrong");
  },
  setInGameMessage: function (message) {
    view.elements.inGameMessage.textContent = message;
  },
};

// >>=====>>====>>====#[<| Gamelogic |>]#====<<====<<=====<<

view.elements.button.handleOnClickStart(startGame);
view.elements.button.handleOnClickEnd(endGame);
view.elements.button.handleOnClickStop(endGame);
view.elements.button.handleOnClickRetry(retryGame);

function setLastGameStats(dataStats) {
  setCookie(dataStats, 365);
}

function readLastGameStats() {
  if (!getCookieData().isGameWon) return;
  view.setLastGameStats(getCookieData());
}
readLastGameStats();

function startGame() {
  view.setWindows({});
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

      setLastGameStats(gameState.getStats());
      readLastGameStats();
    }
  );
  view.setInGameMessage("");
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
  const firstClickedWindow = gameState.firstClickedWindow;

  if (!gameState.firstClickedWindow) {
    view.setInGameMessage("Primer clic");
    gameState.firstClickedWindow = clickedWindow;
    view.setWindows({
      firstWindow: gameState.firstClickedWindow,
    });
    view.setDefaultGameScreen();
    return;
  }
  view.setWindows({
    firstWindow: gameState.firstClickedWindow,
    secondWindow: clickedWindow,
  });
  gameState.resetClick();
  const firstColorName = firstClickedWindow.color,
    secondColorName = clickedWindow.color;

  if (firstColorName !== secondColorName) {
    view.setInGameMessage("¡Clica ventanas del mismo color!");
    view.setWrongGameScreen();
    return;
  }

  if (firstClickedWindow !== clickedWindow) {
    view.setInGameMessage("Ventanas cerradas");
    gameState.closeWindow(firstClickedWindow);
    gameState.closeWindow(clickedWindow);
    view.setCorrectGameScreen();
    gameState.activeWindows = gameState.activeWindows.filter(
      (openedWindow) => openedWindow !== this
    );

    if (!gameState.activeWindows.length) {
      gameState.setGameWon();
      view.setEndScreen(true);
      setLastGameStats(gameState.getStats());
      readLastGameStats();
      gameState.countdown.stop();
      view.setOpenedWindowsCount(gameState.totalWindowsOpened);
    }
    return;
  }
  clickedWindow.setRandomColor();
  view.setInGameMessage("Ambos clics de la misma ventana");
  gameState.openNewWindow(handleWindowClick);
}
