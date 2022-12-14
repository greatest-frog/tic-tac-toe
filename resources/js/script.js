const Player = (sign, name = sign) => {
  const getSign = () => sign;
  const getName = () => name;
  const changeName = (newName) => (name = newName);
  return { getSign, getName, changeName };
};

const gameboard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const setField = (position, element) => {
    board[position] = element;
  };
  const getField = (position) => {
    return board[position];
  };
  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };
  return {
    setField,
    getField,
    resetBoard,
  };
})();

const gameController = (() => {
  const player1 = Player("X");
  const player2 = Player("O");

  let action = player1.getSign();
  let status_msg = `${player1.getName()}'s turn`;
  let end = false;

  const isWin = (sign) => {
    const winCombination = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];
    for (let combination of winCombination) {
      if (
        gameboard.getField(combination[0] - 1) == sign &&
        gameboard.getField(combination[1] - 1) == sign &&
        gameboard.getField(combination[2] - 1) == sign
      ) {
        return true;
      }
    }
    return false;
  };

  const updateStatus = () => {
    let any = false;
    if (isWin(player1.getSign())) {
      end = true;
      status_msg = `${player1.getName()} won`;
      return;
    } else if (isWin(player2.getSign())) {
      end = true;
      status_msg = `${player2.getName()} won`;
      return;
    }
    for (let i = 0; i < 9; i++) {
      if (!gameboard.getField(i)) {
        any = true;
      }
    }
    if (!any) {
      end = true;
      status_msg = "Tie";
    } else {
      status_msg = `${
        player1.getSign() == action ? player1.getName() : player2.getName()
      }'s turn`;
    }
  };

  const round = (index) => {
    gameboard.setField(index, action);
    if (action == player1.getSign()) {
      action = player2.getSign();
    } else {
      action = player1.getSign();
    }
    updateStatus();
  };

  const getStatus = () => {
    return status_msg;
  };

  const isEnd = () => {
    return end;
  };

  const resetGame = () => {
    gameboard.resetBoard();
    end = false;
    action = player1.getSign();
    status_msg = `${player1.getName()}'s turn`;
  };

  const startBtn = document.querySelector(".start-button");
  startBtn.addEventListener("click", () => {
    const player1Input = document.getElementById("player-1");
    const player2Input = document.getElementById("player-2");
    player1.changeName(player1Input.value || "X");
    player2.changeName(player2Input.value || "O");
    updateStatus();
  });

  return {
    getStatus,
    round,
    isEnd,
    resetGame,
  };
})();

const displayController = (() => {
  const startBtn = document.querySelector(".start-button");
  const menu = document.querySelector(".menu");
  const main = document.querySelector(".main-wrapper");
  startBtn.addEventListener("click", () => {
    menu.classList.add("disabled");
    main.classList.remove("disabled");
    updateStatus(gameController.getStatus());
  });
  const fields = document.querySelectorAll(".field");
  const updateBoard = () => {
    fields.forEach(
      (field) => (field.textContent = gameboard.getField(field.id - 1))
    );
  };

  const blockFields = () => {
    fields.forEach((field) => {
      if (field.classList.contains("not-used")) {
        field.classList.remove("not-used");
        field.classList.add("used");
      }
    });
  };

  const resetFields = () => {
    fields.forEach((field) => {
      if (field.classList.contains("used")) {
        field.classList.remove("used");
        field.classList.add("not-used");
      }
    });
  };
  const status_msg = document.querySelector(".status-message");
  const updateStatus = (status) => {
    status_msg.textContent = status;
    if (gameController.isEnd()) {
      blockFields();
    }
  };

  fields.forEach((field) =>
    field.addEventListener("click", () => {
      if (!gameController.isEnd() && !gameboard.getField(field.id - 1)) {
        gameController.round(field.id - 1);
        field.classList.remove("not-used");
        field.classList.add("used");
        updateBoard();
        updateStatus(gameController.getStatus());
      }
    })
  );

  const resetBtn = document.querySelector(".reset-button");
  resetBtn.addEventListener("click", () => {
    gameController.resetGame();
    resetFields();
    updateBoard();
    updateStatus(gameController.getStatus());
  });
})();
