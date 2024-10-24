"use strict";
const btnPlay = document.querySelector(".btn-play");

let number;

btnPlay.addEventListener("click", () => {
  number = Math.round(Math.random() * 10);
  console.log(number);
});
