/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//Capturing what is in the DOM: 
// globalBoard = document.querySelector("#board");
body = document.querySelector("body");
game = document.querySelector("#game");



const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i=0; i < HEIGHT; i++){
    const arr = [];
    arr.length = WIDTH;
    board.push(arr.fill())
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector("#board");

  // TODO: add comment for this code
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for(let y = HEIGHT -1; y >= 0; y--){
    if(!board[y][x]){
      return y
    }
  }
  return;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement('div');
  const cell = document.getElementById(`${y}-${x}`);
  piece.classList.add(`piece`,`p${currPlayer}`);
  cell.append(piece);

  //animating the piec (or at least trying)
  setTimeout(function(){
    piece.style.opacity = 1;
    piece.style.top = 0;
  },0)
}

/** endGame: announce game end */

function endGame(msg) {
  // alert();
  if (msg === 'Player 1 won!'){
    Swal.fire({
      title: `${msg}`,
      width: 600,
      padding: '3em',
      color: '#ff0000',
      background: '#fff url(/images/trees.png)',
      backdrop: `
        rgba(250,0,0,0.4)
        url("neon-cat-rainbow.gif")
        left top
        no-repeat
      `
    })
  }
  else if (msg === 'Player 2 won!'){
    Swal.fire({
      title: `${msg}`,
      width: 600,
      padding: '3em',
      color: '#0000ff',
      background: '#fff url(/images/trees.png)',
      backdrop: `
        rgba(0,0,250,0.4)
        url("neon-cat-rainbow.gif")
        left top
        no-repeat
      `
    })
  }
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  if(board[0][x]){return};
  board[y][x]= currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every((row) => (row.every(col => col)))){
    return endGame("It's a tie!")
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // This function checks with each click if there are four in a row (diagnolly, horizontally, or vertically) by checking at each value of y and x if there is any combination of what is below.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
