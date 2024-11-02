"use strict";
const countDownElement = document.querySelector(".count-down"),
  countDownTimeStart = 30,
  windowSizePx = 320,
  backgroundColors = ["Amarillo", "Verde", "Cian", "Morado"];

const windows = [];

let countDownTime = countDownTimeStart;

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
  console.log(randomColor);

  colorWindow.window.top.document.title = randomColor;
  colorWindow.document.body.className = randomColor.toLowerCase();
  console.log(colorWindow.document);
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
    `fullscreen=no,height=${windowSizePx},width=${windowSizePx},resizable=no,titlebar=yes,
    left=${posX - windowSizePx / 2},top=${posY - windowSizePx / 2}`
  );
  windows.push(newWindow);

  newWindow.addEventListener("load", () => {
    setRandomBgColor(newWindow);
  });
}
