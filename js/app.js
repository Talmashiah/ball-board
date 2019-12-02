var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var PASSAGE = 'PASSAGE';
var gInterval;
var gBallsCounter = 0;
var gAllBalls = 2;
var gFirstMove = false;
var gElRestartButton = document.querySelector('.restart');
var GAMER_IMG = '<img src="img/gamer.png">';
var BALL_IMG = '<img src="img/ball.png">';

var gGamerPos = { i: 2, j: 9 };
var gBoard;



function initGame() {
	gElRestartButton.classList.add('hidden');
	clearInterval(gInterval);
	gBoard = buildBoard();
	renderBoard(gBoard);
}

function checkIfGameOver() {
	if (gAllBalls === gBallsCounter) {
		clearInterval(gInterval);
		gBallsCounter = 0;
		gAllBalls = 2;
		gElRestartButton.classList.remove('hidden');
		return true;
	}
	return false;
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
	board[0][5].type = PASSAGE;
	board[5][0].type = PASSAGE;
	board[5][11].type = PASSAGE;
	board[9][5].type = PASSAGE;
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
	board[3][2].gameElement = BALL
	board[4][5].gameElement = BALL

	return board;
}

function renderBoard(board) {
	var boardHTML = '';
	var elBoard = document.querySelector('.board');

	for (var i = 0; i < board.length; i++) {
		boardHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';
			else if (currCell.type === PASSAGE) cellClass += ' passage';

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
	elBoard.innerHTML = boardHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if (!gFirstMove) gInterval = setInterval(addRandomBall, 2500);
	gFirstMove = true;
	var coords = { i, j };
	coords = renderPassageCell(coords);

	var targetCell = gBoard[coords.i][coords.j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iDiff = (i - gGamerPos.i);
	var jDiff = (j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	// debugger
	if (iDiff === 0 && (Math.abs(jDiff)) === 1 || Math.abs(iDiff) === 1 && jDiff === 0) {
		if (targetCell.gameElement === BALL) {
			var eat = new Audio('./sound/eat.mp3');
			eat.play();
			gBallsCounter++;
			renderBallsCounter();

		}
		gBoard[coords.i][coords.j].gameElement = GAMER
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
		renderCell(gGamerPos, '')
		gGamerPos.i = coords.i
		gGamerPos.j = coords.j
		renderCell(gGamerPos, GAMER_IMG)
		var isOver = checkIfGameOver();
		if (isOver) return;

	}

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
	debugger
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

function renderBallsCounter() {
	var elBallsCounter = document.querySelector('.balls-counter');
	var strHTML = `<div class="balls-counter">Balls collected: ${gBallsCounter}</div>`;
	elBallsCounter.innerHTML = strHTML;
}

function renderPassageCell(coords) {
	if (coords.i < 0) coords.i = 9
	if (coords.i > 9) coords.i = 0;
	if (coords.j < 0) coords.j = 11
	if (coords.j > 11) coords.j = 0;
	return coords;
}

