"use strict";

let boardState, counter;
let turn = true;
let victoryFlag = false;

const gameContainer = document.querySelector(".game-container");
const restartBtn = document.querySelector(".restart-btn");
const turnImg = document.querySelector(".turn-img");
const quitBtn = document.querySelector(".quit-btn");
const nextBtn = document.querySelector(".next-btn");

const turnXSrc = "img/icon-x-gray.svg";
const turnOSrc = "img/icon-o-gray.svg";
let scores = { x: 0, tie: 0, o: 0 };

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
    turnImg.src = turnOSrc;
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
    turnImg.src = turnXSrc;
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
      scores[player]++;

      victoryFlag = true;
      updateScoreboard();
      showWinner(player);
    }
  }
  for (let i = 0; i < 3; i++) {
    check(0, 1, 2, i, i, i);
    check(i, i, i);
  }
  check(0, 1, 2);
  check(2, 1, 0);
  if (!victoryFlag && counter === 9) {
    scores.tie++;
    showWinner();
  }
  updateScoreboard();
};

const updateScoreboard = function () {
  for (const element in scores) {
    document.querySelector(`.score-value-${element}`).innerHTML =
      scores[element];
  }
};

const showWinner = function (winner = "tie") {
  const text = document.querySelector(".text-winner");
  if (winner !== "tie")
    text.innerHTML = `<img src="img/icon-${winner}.svg" alt="" /> takes the round`;

  if (winner === "x") {
    text.style.color = "#31c3bd";
    text.previousElementSibling.innerHTML = "You won!";
  } else if (winner === "o") {
    text.style.color = "#f2b137";
    text.previousElementSibling.innerHTML = "You lost...";
  } else {
    text.style.color = "#31c3bd";
    text.previousElementSibling.innerHTML = `Awh...`;
  }
  toggleModal();
};

const toggleModal = function () {
  document.querySelector(".modal").classList.toggle("hidden");
  document.querySelector(".overlay").classList.toggle("hidden");
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
  turnImg.src = turnXSrc;

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

quitBtn.addEventListener("click", function (e) {
  toggleModal();
});

nextBtn.addEventListener("click", function (e) {
  init();
  toggleModal();
});

window.addEventListener("beforeunload", function () {
  localStorage.setItem("scores", JSON.stringify(scores));
  // if (!victoryFlag)
  //   localStorage.setItem("boardState", JSON.stringify(boardState));
});

if (localStorage.scores) {
  scores = JSON.parse(localStorage.getItem("scores"));
}

init();
updateScoreboard();
