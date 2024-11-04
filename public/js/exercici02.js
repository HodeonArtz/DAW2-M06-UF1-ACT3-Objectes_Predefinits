"use strict";

const countDownElement = document.querySelector(".count-down"),
  countDownTimeStart = 30,
  windowWidthPx = 320,
  windowHeightPx = 160,
  backgroundColors = ["Amarillo", "Verde", "Cian", "Morado"];

let windows = [],
  countDownTime = countDownTimeStart,
  totalWindowsOpened = 0,
  firstClickedWindow = null;

let countDownInterval = setInterval(() => {
  // View countdown
  countDownElement.textContent = --countDownTime;

  // Stop countdown
  if (countDownTime <= 0) clearInterval(countDownInterval);
}, 1000);

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function setRandomBgColor(colorWindow) {
  const randomColor =
    backgroundColors[Math.round(random(0, backgroundColors.length - 1))];

  colorWindow.window.top.document.title = randomColor;
  colorWindow.document.body.classList.add(randomColor.toLowerCase());
  // setting this class automatically changes window's color
  colorWindow.document.querySelector(".color-name").textContent = randomColor;
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

  try {
    newWindow.addEventListener("load", () => {
      setRandomBgColor(newWindow);
      totalWindowsOpened++;
      newWindow.addEventListener("click", () => {
        // mostrar animación de seleccionado
        if (newWindow.document.hasFocus) handleWindowClick(newWindow);
      });
      windows.push(newWindow);
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
    windows = windows.filter((openedWindow) => openedWindow !== colorWindow);
  });
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
    firstClickedWindow = null;
    return;
  }

  if (firstClickedWindow !== clickedWindow) {
    console.log("Second click: windows are different");
    closeColorWindow(firstClickedWindow, clickedWindow);
    firstClickedWindow = null;
    return;
  }
  console.log("Second click: same window clicked");
  openNewColorWindow();
  firstClickedWindow = null;
}
