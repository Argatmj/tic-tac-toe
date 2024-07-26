function board() {
  const board = ["", "", "", "", "", "", "", "", ""];

  getBoard = () => board;

  setValue = (index, sign) => (board[index] = sign);

  getValue = () => board[index];

  reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, setValue, reset, getValue };
}

function gameController() {
  const gameBoard = board();
  let round = 0;
  let isOver = false;

  const players = [
    {
      name: "Player X",
      sign: "X",
    },
    {
      name: "Player O",
      sign: "O",
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchActivePlayer = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const findAllIndex = (arr, value) => {
    return arr.reduce((indices, element, index) => {
      if (element === value) {
        indices.push(index);
      }
      return indices;
    }, []);
  };

  const restart = () => {
    isOver = false;
    round = 0;
    activePlayer = players[0];
    gameBoard.reset();
  };

  const checkWin = () => {
    const board = gameBoard.getBoard();
    const indexX = findAllIndex(board, players[0].sign);
    const indexO = findAllIndex(board, players[1].sign);

    const winIndex = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const isWinPattern = (indices, winCombination) =>
      winCombination.every((index) => indices.includes(index));

    const xWin = winIndex.some((winCombination) =>
      isWinPattern(indexX, winCombination)
    );
    const oWin = winIndex.some((winCombination) =>
      isWinPattern(indexO, winCombination)
    );

    if (xWin || oWin) {
      return true;
    }
  };

  const playRound = (index) => {
    if (isOver) return;
    gameBoard.setValue(index, activePlayer.sign);
    console.log(gameBoard.getBoard());
    round++;

    if (checkWin()) {
      isOver = true;
    } else if (round === 9) {
      isOver = true;
    } else {
      switchActivePlayer();
    }
  };

  return {
    getActivePlayer,
    isOver: () => isOver,
    playRound,
    checkWin,
    restart,
    getBoard: () => gameBoard.getBoard(),
  };
}

function screenController() {
  const game = gameController();
  const cells = game.getBoard();

  const containerDiv = document.querySelector(".board");
  const infoDiv = document.querySelector(".info");
  const resetBtn = document.querySelector(".restart");

  const updateInfo = () => {
    if (game.isOver()) {
      infoDiv.textContent = game.checkWin()
        ? `${game.getActivePlayer().name} Wins!`
        : "It's a tie!";
    } else {
      infoDiv.textContent = `${game.getActivePlayer().name}'s turn!`;
    }
  };

  const updateDisplay = () => {
    containerDiv.innerHTML = "";

    cells.forEach((cell, index) => {
      const cellBtn = document.createElement("button");
      cellBtn.classList.add("cell");
      cellBtn.textContent = cell;
      cellBtn.addEventListener("click", () => {
        game.playRound(index);
        updateDisplay();
        updateInfo();
      });
      containerDiv.appendChild(cellBtn);
    });
  };

  updateDisplay();
  updateInfo();

  resetBtn.addEventListener("click", () => {
    game.restart();
    updateDisplay();
    updateInfo();
  });
}

screenController();
