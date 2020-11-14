"use strict";

class Player {
  constructor(color) {
    this.color = color
  }
}

/*
* instance variables:
 - WIDTH
 - HEIGHT
 - entire board
 - current player
 */

class Game {
  constructor(HEIGHT, WIDTH, player1, player2) {
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    this.board = [];
    this.currPlayer = player1;
    this.currPlayersArray = [player1, player2];
    this.gameOver = false;
    
    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }    

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const boardDOM = document.getElementById('board');
    boardDOM.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    boardDOM.append(top);

    // make main part of boardDOM
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      boardDOM.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick = evt => {
    if(this.gameOver) return;
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer === this.currPlayersArray[0] ? 
        'one' : 'two'} won!`);
    }

    // check for tie
    //optimize by only looping through board[0]
    if (this.board[0].every(cell => cell)) {
      this.gameOver = true;
      return this.endGame('Tie!');
    }

    // switch players
    return this.currPlayer = this.currPlayer === this.currPlayersArray[0]
     ? this.currPlayersArray[1] 
     : this.currPlayersArray[0];
  };

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    let _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

}

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// const HEIGHT = 6;
// const WIDTH = 7;

// let currPlayer = 1; // active player: 1 or 2
// let board = []; // array of rows, each row is array of cells  (board[y][x])

// makeBoard();
// makeHtmlBoard();

const playerColorSelect = document.querySelector('form');

function startGame() {
  const p1color = document.getElementById('player1').value;
  const p2color = document.getElementById('player2').value;

  let player1 = new Player(p1color);
  let player2 = new Player(p2color);

  new Game(6,7,player1, player2);
}

// make top level
playerColorSelect.addEventListener('submit', startGame);


