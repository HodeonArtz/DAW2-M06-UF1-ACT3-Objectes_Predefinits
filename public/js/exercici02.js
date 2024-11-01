"use strict";
const countDownElement = document.querySelector(".count-down"),
  countDownTimeStart = 30;

let countDownTime = countDownTimeStart;

let countDownInterval = setInterval(() => {
  countDownElement.textContent = --countDownTime;
  if (countDownTime <= 0) clearInterval(countDownInterval);
}, 1000);
