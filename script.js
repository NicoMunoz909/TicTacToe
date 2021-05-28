const DisplayController = (() => {

  const hide = (element) => {
    element.classList.add("hide");
  };
  const show = (element) => {
    element.classList.remove("hide");
  };

  const titlePage = document.getElementById("main-page-buttons");
  const nameSelect1p = document.getElementById("1p-name-select");
  const nameSelect2p = document.getElementById("2p-name-select");
  const gameboardAndScore = document.getElementById("gameboard-score");
  const ongoingGameButtons = document.getElementById("ongoing-game-buttons");
  const finishedGameButtons = document.getElementById("finished-game-buttons");
  const announcer = document.getElementById('announcer');

  const display1PlayerNameSelect = () => {
    //alert("AI Not implemented yet");
    hide(titlePage);
    show(nameSelect1p);
  };
  const display2PlayersNameSelect = () => {
    hide(titlePage);
    show(nameSelect2p);
  };
  const display1PlayerGame = () => {
    hide(nameSelect1p);
    document.getElementById("p1-name").textContent = document.getElementById("player-name-form").value; //Set Player 1 Name
    document.getElementById("p2-name").textContent = "Blitzcranck"; //Set AI Bot Name
    nameSelect1p.reset();
    show(gameboardAndScore);
    show(announcer);
    show(ongoingGameButtons);
  };
  const display2PlayersGame = () => {
    hide(nameSelect2p);
    document.getElementById("p1-name").textContent = document.getElementById("p1-name-form").value; //Set Player 1 Name
    document.getElementById("p2-name").textContent = document.getElementById("p2-name-form").value; //Set Player 2 Name
    nameSelect2p.reset();
    show(gameboardAndScore);
    show(announcer);
    show(ongoingGameButtons);
  };
  const displayFinishedGameButtons = () => {
    hide(ongoingGameButtons);
    show(finishedGameButtons);
  };
  const displayTitlePage = () => {
    hide(finishedGameButtons);
    hide(nameSelect1p);
    hide(nameSelect2p);
    hide(gameboardAndScore);
    hide(announcer);
    show(titlePage);
  };
  const hideFinishedGameButtons = () => {
    hide(finishedGameButtons);
  };
  const showResetButton = () => {
    show(ongoingGameButtons);
  }

  document.getElementById('1p-game').addEventListener('click', display1PlayerNameSelect);
  document.getElementById('2p-game').addEventListener('click', display2PlayersNameSelect);
  document.getElementById("1p-start").addEventListener('click', display1PlayerGame);
  document.getElementById("2p-start").addEventListener('click', display2PlayersGame);
  document.getElementById("main-page").addEventListener('click', displayTitlePage);

  return {displayFinishedGameButtons, hideFinishedGameButtons, showResetButton};

})();

const Game = (() => {

  let p1Score = 0;
  let p2Score = 0;

  const Gameboard = (() => {

    const board = {
      topLeft : {value: NaN, div: document.getElementById('top-left')},
      topCenter : {value: NaN, div: document.getElementById('top-center')},
      topRight : {value: NaN, div: document.getElementById('top-right')},
      midLeft : {value: NaN, div: document.getElementById('mid-left')},
      midCenter : {value: NaN, div: document.getElementById('mid-center')},
      midRight : {value: NaN, div: document.getElementById('mid-right')},
      botLeft : {value: NaN, div: document.getElementById('bot-left')},
      botCenter : {value: NaN, div: document.getElementById('bot-center')},
      botRight : {value: NaN, div: document.getElementById('bot-right')}
    };
  
    const markCell = (cell,mark) => {
      board[cell.dataset.name].value = mark,
      board[cell.dataset.name].div.textContent = mark
    };
  
    const restartBoard = () => {
      for (const cell in board) {
        board[cell].value = NaN;
        board[cell].div.textContent = ""
      }
    };

    const addP1Score = () => {
      p1Score ++
      document.getElementById('p1-score').textContent = p1Score;
    };

    const addP2Score = () => {
      p2Score ++
      document.getElementById('p2-score').textContent = p2Score;
    };

    const resetScore = () => {
      p1Score = 0;
      p2Score = 0;
      document.getElementById('p1-score').textContent = p1Score;
      document.getElementById('p2-score').textContent = p2Score;
    };

    const updateAnnouncer = (text) => {
      document.getElementById('announcer-text').textContent = text;
    };

    document.getElementById('reset-score').addEventListener('click',resetScore);
    document.getElementById('main-page').addEventListener('click',resetScore);
  
    return {board, markCell, restartBoard, addP1Score, addP2Score, updateAnnouncer};
  
  })();
  
  const Player = (playerName,playerMark,playerType) => {
  
    const name = playerName;
    const mark = playerMark;
    const type = playerType;
  
    const editName = (newName) => {name = newName};
  
    const markCell = (cell) => {
      Gameboard.markCell(cell,mark);
    }

    const getCell = () => {
      cells = []
      for (let key in Gameboard.board) {
        if (Gameboard.board[key].value != 'X' && Gameboard.board[key].value != 'O'){ 
          cells.push(Gameboard.board[key].div)
        }
      }
      console.log(cells);
      let cell = cells[Math.floor(Math.random() * cells.length)];
      return cell
    }
  
    return {markCell, getCell, name, type};
  
  }

  let p1Turn = true;
  let player1 = undefined;
  let player2 = undefined;


  const create1Player = () => {
    let playerName = document.getElementById('p1-name').textContent;
    player1 = Player(playerName, 'X', "human")
    player2 = Player("Blitzcranck", 'O', "bot")
  };

  const create2Players = () => {
    let player1Name = document.getElementById('p1-name').textContent;
    let player2Name = document.getElementById('p2-name').textContent;
    player1 = Player(player1Name, 'X', "human")
    player2 = Player(player2Name, 'O', "human") 
  };

  const checkGameOver  = () => {
    if (checkVertical()[0]) {
      gameOver(checkVertical()[1]);
      return true;
    } else if (checkHorizontal()[0]) {
      gameOver(checkHorizontal()[1]);
      return true;
    } else if (checkDiagonal()[0]) {
      gameOver(checkDiagonal()[1]);
      return true;
    }
    else {
      let count = 0;
      for (const cell in Gameboard.board) {
        if (Gameboard.board[cell].value == "X" || Gameboard.board[cell].value == "O") {
          count ++;
        }
      }
      if (count == 9) {
        gameOver("tie");
        return true;
      }
      }
  };
  const checkVertical = () => {
    if (Gameboard.board.topLeft.value == Gameboard.board.midLeft.value && Gameboard.board.midLeft.value == Gameboard.board.botLeft.value) {
      return [true,Gameboard.board.topLeft.value];
    } else if (Gameboard.board.topCenter.value == Gameboard.board.midCenter.value && Gameboard.board.midCenter.value == Gameboard.board.botCenter.value) {
      return [true,Gameboard.board.topCenter.value];
    } else if (Gameboard.board.topRight.value == Gameboard.board.midRight.value && Gameboard.board.midRight.value == Gameboard.board.botRight.value) {
      return [true,Gameboard.board.topRight.value];
    } else {
      return false;
    }
  };
  const checkHorizontal = () => {
    if (Gameboard.board.topLeft.value == Gameboard.board.topCenter.value && Gameboard.board.topCenter.value == Gameboard.board.topRight.value) {
      return [true,Gameboard.board.topLeft.value];
    } else if (Gameboard.board.midLeft.value == Gameboard.board.midCenter.value && Gameboard.board.midCenter.value == Gameboard.board.midRight.value) {
      return [true,Gameboard.board.midLeft.value];
    } else if (Gameboard.board.botLeft.value == Gameboard.board.botCenter.value && Gameboard.board.botCenter.value == Gameboard.board.botRight.value) {
      return [true,Gameboard.board.botLeft.value];
    } else {
      return false;
    }
  };
  const checkDiagonal = () => {
    if (Gameboard.board.topLeft.value == Gameboard.board.midCenter.value && Gameboard.board.midCenter.value == Gameboard.board.botRight.value) {
      return [true,Gameboard.board.topLeft.value];
    } else if (Gameboard.board.topRight.value == Gameboard.board.midCenter.value && Gameboard.board.midCenter.value == Gameboard.board.botLeft.value) {
      return [true,Gameboard.board.topRight.value];
    } else {
      return false;
    }
  };

  const switchTurn = () => {
    if (p1Turn) {
      p1Turn = false;
    } else {
      p1Turn = true;
    }
  };

  const startGame = () => {
    p1Turn = true;
    DisplayController.hideFinishedGameButtons();
    DisplayController.showResetButton();
    Gameboard.restartBoard();
    Gameboard.updateAnnouncer(`${player1.name}'s turn`);
    activateCells();
  };

  const gameOver = (winner) => {
    if (winner == "X") {
      Gameboard.addP1Score();
      Gameboard.updateAnnouncer(`${player1.name} wins!`);
    } else if (winner == "O") {
      Gameboard.addP2Score();
      Gameboard.updateAnnouncer(`${player2.name} wins!`);
    } else {
      Gameboard.updateAnnouncer("It's a tie!")
    }
    DisplayController.displayFinishedGameButtons();
    deactivateCells();
  };

  function markCell() {
    let cell = this;
    if (!p1Turn && player2.type == "bot") {cell = player2.getCell()}
    if (p1Turn) {
      player1.markCell(cell);
    } else {
      player2.markCell(cell);
    }
    switchTurn();
    if (p1Turn) {
      Gameboard.updateAnnouncer(`${player1.name}'s turn`);
    } else {
      Gameboard.updateAnnouncer(`${player2.name}'s turn`);
    }
    cell.classList.add('marked')
    cell.removeEventListener('click',markCell);
    if (checkGameOver()){return};
    if (!p1Turn && player2.type == "bot" ) {markCell()}
  };

  const restartGame = () => {
    Gameboard.restartBoard();
    Gameboard.updateAnnouncer(`${player1.name}'s turn`);
    activateCells();
  };

  const activateCells = () => {
    cells = document.querySelectorAll('div.cell')
    for (let i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click',markCell);
      cells[i].classList.remove('marked');
    }
  };

  const deactivateCells = () => {
    cells = document.querySelectorAll('div.cell')
    for (let i = 0; i < cells.length; i++) {
      cells[i].removeEventListener('click',markCell);
      cells[i].classList.add('marked');
    }
  };

  document.getElementById('play-again').addEventListener('click', startGame);
  document.getElementById("1p-start").addEventListener('click', create1Player);
  document.getElementById("1p-start").addEventListener('click', startGame);
  document.getElementById("2p-start").addEventListener('click', create2Players);
  document.getElementById("2p-start").addEventListener('click', startGame);
  document.getElementById('restart-game').addEventListener('click', restartGame);

})();



