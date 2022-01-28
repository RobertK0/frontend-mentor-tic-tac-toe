"use strict";

let boardState = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const gameContainer = document.querySelector(".game-container");

const clearBoard = function () {};

const acceptInput = function (square) {
  boardState[square.dataset.row][square.dataset.column] = "x";
  console.log(square.dataset.column, square.dataset.row);
  console.table(boardState);
  checkWin();
};

const checkWin = function () {
  function check(var1, var2, var3, var4 = 0, var5 = 1, var6 = 2) {
    if (
      boardState[var4][var1].valueOf() !== "" &&
      boardState[var4][var1].valueOf() === boardState[var5][var2].valueOf() &&
      boardState[var4][var1].valueOf() === boardState[var6][var3].valueOf()
    ) {
      console.log("victory");
    }
  }
  for (let i = 0; i < 3; i++) {
    check(0, 1, 2, i, i, i);
    check(i, i, i);
  }
  check(0, 1, 2);
  check(2, 1, 0);
};

gameContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("square")) acceptInput(e.target);
});
