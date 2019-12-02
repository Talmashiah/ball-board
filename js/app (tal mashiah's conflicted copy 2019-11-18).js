var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var gInterval;
var gBallsCounter = 0;
var gAllBalls = 2;
var gElBoard = document.querySelector('.board');
var gElContainer = document.querySelector('.container');
var GAMER_IMG = '<img src="img/gamer.png">';
var BALL_IMG = '<img src="img/ball.png">';

var gGamerPos = { i: 2, j: 9 };
var gBoard



function initGame() {
	console.log('init game!')
	gBoard = buildBoard();
	renderBoard(gBoard);
	gInterval = setInterval(addRandomBall, 2500);
}

function checkIfGameOver() {
	if (gAllBalls === gBallsCounter) {
		clearInterval(gInterval);
		var containerHTML = '';
		containerHTML += `<div>Game Over!</div>`
		gElContainer.innerHTML = containerHTML;
	}
}

function buildBoard() {
	var board = [];
	var rowsLength = 10;
	var columnLength = 12;
	for (var i = 0; i < rowsLength; i++) {
		board[i] = []
		for (var j = 0; j < columnLength; j++) {
			board[i][j] = { type: FLOOR, gameElement: null }
			if (i === 0 || i === rowsLength - 1) board[i][j].type = WALL
			if (j === 0 || j === columnLength - 1) board[i][j].type = WALL
		}

	}
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
	board[3][2].gameElement = BALL
	board[4][5].gameElement = BALL
	console.log(board);
	return board;
}

function renderBoard(board) {

	var elBallsCounter = document.querySelector('.balls-counter');
	var boardHTML = '';
	var BallsCounterHTML = '';
	BallsCounterHTML += `Balls Colected: ${gBallsCounter}`;

	for (var i = 0; i < board.length; i++) {
		boardHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })
			// debugger
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			boardHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				boardHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				boardHTML += BALL_IMG;
			}

			boardHTML += '\t</td>\n';
		}
		boardHTML += '</tr>\n';
	}
	console.log('boardHTML is:');
	console.log(boardHTML);
	gElBoard.innerHTML = boardHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iDiff = (i - gGamerPos.i);
	var jDiff = (j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	// debugger
	if (iDiff === 0 && (Math.abs(jDiff)) === 1 || Math.abs(iDiff) === 1 && jDiff === 0) {

		if (targetCell.gameElement === BALL) {
			gBallsCounter++;
			checkIfGameOver();
			console.log('Collecting!');
		}
		gBoard[i][j].gameElement = GAMER
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
		renderCell(gGamerPos, '')
		gGamerPos.i = i
		gGamerPos.j = j
		renderCell(gGamerPos, GAMER_IMG)


	} else console.log('TOO FAR');

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	// .cell-0-1
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	// var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);

	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
	var i = gGamerPos.i;
	var j = gGamerPos.j;
	var key = event.key

	switch (key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	// var cellClass = 'cell-' + location.i + '-' + location.j;
	var cellClass = `cell-${location.i}-${location.j}`
	return cellClass;
}

function addRandomBall() {
	var randomRow = Math.floor(Math.random() * 8 + 1);
	var randomCol = Math.floor(Math.random() * 10 + 1);
	if (!gBoard[randomRow][randomCol].gameElement) {
		gBoard[randomRow][randomCol].gameElement = BALL;
		gAllBalls++;
	} else {
		addRandomBall()
	}
	renderBoard(gBoard);
}

