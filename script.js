"use strict";

let boardState, counter;
let turn = true;
let victoryFlag = false;

const gameContainer = document.querySelector(".game-container");
const restartBtn = document.querySelector(".restart-btn");

////////Functions
////Resets boardState variable and clears all html squares
const clearBoard = function () {
  init();
};

const acceptInput = function (square) {
  if (
    turn &&
    !victoryFlag &&
    boardState[square.dataset.row][square.dataset.column].valueOf() === ""
  ) {
    boardState[square.dataset.row][square.dataset.column] = "x";
    square.innerHTML = `<img src="img/icon-x.svg" alt="" />`;
    console.table(boardState);
    counter++;
    turn = !turn;
    checkWin("x");
    const delay = (Math.random() * 1.5).toFixed(3);
    setTimeout(() => cpuInput(), delay * 1000);
  }
};

const cpuInput = function () {
  let row, column, i;
  if (!turn && counter < 9 && !victoryFlag) {
    do {
      row = Math.trunc(Math.random() * 3);
      column = Math.trunc(Math.random() * 3);
      i++;
    } while (boardState[row][column].valueOf() !== "");
    boardState[row][column] = "o";
    counter++;
    document.querySelector(
      `[data-row="${row}"][data-column="${column}"]`
    ).innerHTML = `<img src="img/icon-o.svg" alt="" />`;
    turn = !turn;
    checkWin("o");
  }
};

const checkWin = function (player) {
  function check(var1, var2, var3, var4 = 0, var5 = 1, var6 = 2) {
    if (
      boardState[var4][var1].valueOf() !== "" &&
      boardState[var4][var1].valueOf() === boardState[var5][var2].valueOf() &&
      boardState[var4][var1].valueOf() === boardState[var6][var3].valueOf()
    ) {
      console.log(player, "victory");
      victoryFlag = true;
    }
  }
  for (let i = 0; i < 3; i++) {
    check(0, 1, 2, i, i, i);
    check(i, i, i);
  }
  check(0, 1, 2);
  check(2, 1, 0);
  if (counter === 9) console.log("its a tie");
};

const init = function () {
  boardState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  counter = 0;
  turn = true;
  victoryFlag = false;
  document
    .querySelectorAll(".square")
    .forEach((square) => (square.innerHTML = ""));
};
////////Listeners

gameContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("square")) acceptInput(e.target);
});

restartBtn.addEventListener("click", function () {
  init();
});

init();
