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

class App {
  #boardState;
  #counter;
  #turn = true;
  #victoryFlag = false;
  #mark = "x";
  #scores = { x: 0, tie: 0, o: 0 };

  constructor() {
    container.addEventListener(
      "click",
      function (e) {
        if (e.target.classList.contains("square")) this.#acceptInput(e.target);
        if (e.target.classList.contains("restart-btn")) this.#init();
      }.bind(this)
    );

    modal.addEventListener(
      "click",
      function (e) {
        if (e.target.classList.contains("next-btn")) {
          this.#init();
          this.#toggleModal();
        }
        if (e.target.classList.contains("quit-btn")) this.#toggleModal();
      }.bind(this)
    );

    newGame.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        if (e.target.classList.contains("new-btn")) {
          this.#init();
          document
            .querySelector(".new-game-overlay")
            .classList.toggle("hidden");
        }
        if (e.target.closest(".mark-toggle")) this.#toggleRadio(e);
      }.bind(this)
    );
  }
  ////Methods

  #toggleRadio(e) {
    let unchecked;
    if (e.target.parentNode.querySelector(".mark")) {
      markToggle.querySelectorAll(".mark").forEach((element) => {
        if (!element.checked) unchecked = element;
      });
      unchecked.checked = !unchecked.checked;
      this.#changeSelection(unchecked.value);
    }
  }

  #changeSelection = function (selection) {
    document
      .querySelectorAll(".mark-icon")
      .forEach((element) => element.classList.toggle("selected"));
    this.#mark = selection;
  };

  #init() {
    this.#boardState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

    this.#counter = 0;

    if (this.#mark === "x") {
      this.#turn = true;
    } else {
      document.querySelector(".score-x .score-text").innerHTML = "X (CPU)";
      document.querySelector(".score-o .score-text").innerHTML = "O (You)";
      this.#turn = false;
      const delay = (Math.random() * 1.5).toFixed(3);
      setTimeout(() => this.#cpuInput(), delay * 1000);
    }

    this.#victoryFlag = false;

    document
      .querySelectorAll(".square")
      .forEach((square) => (square.innerHTML = ""));
  }

  //done
  #toggleModal() {
    document.querySelector(".modal").classList.toggle("hidden");
    document.querySelector(".overlay").classList.toggle("hidden");
  }
  //done
  #acceptInput(square) {
    if (
      this.#turn &&
      !this.#victoryFlag &&
      this.#boardState[square.dataset.row][square.dataset.column].valueOf() ===
        ""
    ) {
      this.#boardState[square.dataset.row][square.dataset.column] = `${
        this.#mark
      }`;
      square.innerHTML = `<img src="img/icon-${this.#mark}.svg" alt="" />`;
      this.#counter++;
      this.#turn = !this.#turn;
      this.#checkWin(`${this.#mark}`);
      if (this.#mark.valueOf() === "x") {
        turnImg.src = turnOSrc;
      } else {
        turnImg.src = turnXSrc;
      }
      const delay = (Math.random() * 1.5).toFixed(3);
      setTimeout(() => this.#cpuInput(), delay * 1000);
    }
  }

  #cpuInput() {
    let row, column;
    const cpuMark = this.#mark.valueOf() === "o" ? "x" : "o";
    if (!this.#turn && this.#counter < 9 && !this.#victoryFlag) {
      do {
        row = Math.trunc(Math.random() * 3);
        column = Math.trunc(Math.random() * 3);
      } while (this.#boardState[row][column].valueOf() !== "");
      this.#boardState[row][column] = `${cpuMark}`;
      this.#counter++;
      document.querySelector(
        `[data-row="${row}"][data-column="${column}"]`
      ).innerHTML = `<img src="img/icon-${cpuMark}.svg" alt="" />`;
      this.#turn = !this.#turn;
      if (this.#mark.valueOf() === "x") {
        turnImg.src = turnXSrc;
      } else {
        turnImg.src = turnOSrc;
      }
      this.#checkWin(`${cpuMark}`);
    }
  }

  #checkWin(player) {
    function check(var1, var2, var3, var4 = 0, var5 = 1, var6 = 2) {
      if (
        this.#boardState[var4][var1].valueOf() !== "" &&
        this.#boardState[var4][var1].valueOf() ===
          this.#boardState[var5][var2].valueOf() &&
        this.#boardState[var4][var1].valueOf() ===
          this.#boardState[var6][var3].valueOf()
      ) {
        console.log(player, "victory");
        this.#scores[player]++;

        this.#victoryFlag = true;
        this.#updateScoreboard();
        this.#showWinner(player);
      }
    }

    for (let i = 0; i < 3; i++) {
      check.bind(this, 0, 1, 2, i, i, i)();

      check.bind(this, i, i, i)();
    }
    check.bind(this, 0, 1, 2)();
    check.bind(this, 2, 1, 0)();
    console.log(this.#victoryFlag, this.#counter);
    if (!this.#victoryFlag && this.#counter === 9) {
      this.#scores.tie++;
      this.#showWinner();
    }
    this.#updateScoreboard();
  }

  #updateScoreboard() {
    for (const element in this.#scores) {
      document.querySelector(`.score-value-${element}`).innerHTML =
        this.#scores[element];
    }
  }

  #showWinner(winner = "tie") {
    const text = document.querySelector(".text-winner");
    text.innerHTML = `It's a tie`;
    if (winner !== "tie")
      text.innerHTML = `<img src="img/icon-${winner}.svg" alt="" /> takes the round`;
    let announcement = text.previousElementSibling;
    if (winner === "x") {
      text.style.color = "#31c3bd";
      this.#mark === "x"
        ? (announcement.innerHTML = "You won!")
        : (announcement.innerHTML = "You lost...");
    } else if (winner === "o") {
      text.style.color = "#f2b137";
      this.#mark === "o"
        ? (announcement.innerHTML = "You won!")
        : (announcement.innerHTML = "You lost...");
    } else {
      text.style.color = "#31c3bd";
      announcement.innerHTML = `Awh...`;
    }
    this.#toggleModal();
  }
}

const app = new App();
