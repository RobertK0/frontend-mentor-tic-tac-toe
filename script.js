"use strict";

const container = document.querySelector(".container");
const modal = document.querySelector(".modal");
const newGame = document.querySelector(".new-game-container");

const gameContainer = document.querySelector(".game-container");
const restartBtn = document.querySelector(".restart-btn");
const turnImg = document.querySelector(".turn-img");
const quitBtn = document.querySelector(".quit-btn");
const nextBtn = document.querySelector(".next-btn");
const newBtn = document.querySelector(".new-btn");
const markToggle = document.querySelector(".mark-toggle");

const turnXSrc = "img/icon-x-gray.svg";
const turnOSrc = "img/icon-o-gray.svg";

let boardState, counter;
let turn = true;

let victoryFlag = false;
let mark = "x";

let scores = { x: 0, tie: 0, o: 0 };

class App {
  constructor() {}
}

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
    boardState[square.dataset.row][square.dataset.column] = `${mark}`;
    square.innerHTML = `<img src="img/icon-${mark}.svg" alt="" />`;
    console.table(boardState);
    counter++;
    turn = !turn;
    checkWin(`${mark}`);
    if (mark.valueOf() === "x") {
      turnImg.src = turnOSrc;
    } else {
      turnImg.src = turnXSrc;
    }
    const delay = (Math.random() * 1.5).toFixed(3);
    setTimeout(() => cpuInput(), delay * 1000);
  }
};

const cpuInput = function () {
  let row, column;
  const cpuMark = mark.valueOf() === "o" ? "x" : "o";
  if (!turn && counter < 9 && !victoryFlag) {
    do {
      row = Math.trunc(Math.random() * 3);
      column = Math.trunc(Math.random() * 3);
    } while (boardState[row][column].valueOf() !== "");
    boardState[row][column] = `${cpuMark}`;
    counter++;
    document.querySelector(
      `[data-row="${row}"][data-column="${column}"]`
    ).innerHTML = `<img src="img/icon-${cpuMark}.svg" alt="" />`;
    turn = !turn;
    if (mark.valueOf() === "x") {
      turnImg.src = turnXSrc;
    } else {
      turnImg.src = turnOSrc;
    }
    checkWin(`${cpuMark}`);
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
  text.innerHTML = `It's a tie`;
  if (winner !== "tie")
    text.innerHTML = `<img src="img/icon-${winner}.svg" alt="" /> takes the round`;
  let announcement = text.previousElementSibling;
  if (winner === "x") {
    text.style.color = "#31c3bd";
    mark === "x"
      ? (announcement.innerHTML = "You won!")
      : (announcement.innerHTML = "You lost...");
  } else if (winner === "o") {
    text.style.color = "#f2b137";
    mark === "o"
      ? (announcement.innerHTML = "You won!")
      : (announcement.innerHTML = "You lost...");
  } else {
    text.style.color = "#31c3bd";
    announcement.innerHTML = `Awh...`;
  }
  toggleModal();
};

const toggleModal = function () {
  document.querySelector(".modal").classList.toggle("hidden");
  document.querySelector(".overlay").classList.toggle("hidden");
};

const changeSelection = function (selection) {
  document
    .querySelectorAll(".mark-icon")
    .forEach((element) => element.classList.toggle("selected"));
  console.log(selection);
  mark = selection;
};

const init = function () {
  boardState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  counter = 0;
  if (mark.valueOf() === "x") {
    turn = true;
  } else {
    turn = false;
    const delay = (Math.random() * 1.5).toFixed(3);
    setTimeout(() => cpuInput(), delay * 1000);
  }

  victoryFlag = false;

  document
    .querySelectorAll(".square")
    .forEach((square) => (square.innerHTML = ""));
};

const toggleRadio = function (e) {
  let unchecked;
  if (e.target.parentNode.querySelector(".mark")) {
    markToggle.querySelectorAll(".mark").forEach((element) => {
      if (!element.checked) unchecked = element;
    });
    unchecked.checked = !unchecked.checked;
    changeSelection(unchecked.value);
  }
};

////////Listeners

container.addEventListener("click", function (e) {
  if (e.target.classList.contains("square")) acceptInput(e.target);
  if (e.target.classList.contains("restart-btn")) init();
});

modal.addEventListener("click", function (e) {
  if (e.target.classList.contains("next-btn")) {
    init();
    toggleModal();
  }
  if (e.target.classList.contains("quit-btn")) toggleModal();
});

newGame.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("new-btn")) {
    init();
    document.querySelector(".new-game-overlay").classList.toggle("hidden");
  }
  if (e.target.closest(".mark-toggle")) toggleRadio(e);
});
