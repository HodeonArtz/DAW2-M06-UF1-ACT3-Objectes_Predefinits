"use strict";
const btnPlay = document.querySelector(".btn-play");

let number;

function setBtnPlayRed() {
  btnPlay.classList.remove("btn-play--green");
  btnPlay.classList.add("btn-play--red");
}

function setBtnPlayGreen() {
  btnPlay.classList.remove("btn-play--red");
  btnPlay.classList.add("btn-play--green");
}

function handleBtnPlayColor() {
  if (number < 5) {
    setBtnPlayRed();
    return;
  }
  setBtnPlayGreen();
}

btnPlay.addEventListener("click", () => {
  number = Math.round(Math.random() * 10);
  handleBtnPlayColor();
  window.open(
    "./encerta.html",
    undefined,
    `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=100,height=100,left=0,top=0`
  );
});
