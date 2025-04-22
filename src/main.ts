import './style.css';

const gameBoard = (() => {
	let board = [];

	for (let i = 0; i < 9; i++) {
		board[i] = { id: i, value: '' };
	}

	const getBoard = () => board;

	const updateBoardWithMove = (cell, player) => {
		let boardCellSelectedIndex = board.findIndex((obj) => obj.id == cell);
		const playerValue = player;

		if (board[boardCellSelectedIndex].value === '') {
			board[boardCellSelectedIndex].value = playerValue;
		} else {
			alert('Please select an empty square to make move');
			return;
		}
	};

	const printBoard = () => console.log(board);

	return {
		getBoard,
		updateBoardWithMove,
		printBoard,
	};
})();

const game = (() => {
	let roundNumber = 1;

	const handleRound = () => {
		let playerValue = player.getActivePlayer().value;
		let emptyCells = gameBoard
			.getBoard()
			.filter((board) => board.value == '');

		if (emptyCells.length === 0) {
			checkForTie(emptyCells);
		} else if (roundNumber >= 3) {
			checkForWin();
		}

		let cellChosen = emptyCells[0].id;
		gameBoard.updateBoardWithMove(cellChosen, playerValue);
		player.switchTurn();
		console.log(roundNumber);
		roundNumber++;
	};

	const checkForTie = (cells) => {
		if (cells.length === 0) {
			alert('Tie Game!');
			resetBoard();

			if (player.getActivePlayer().value === 'o') {
				player.switchTurn();
				return;
			} else if (player.getActivePlayer().value === 'x') {
				return;
			}
		}
	};

	const checkForWin = () => {
		let oCells = gameBoard
			.getBoard()
			.filter((board) => board.value === 'o');
		let xCells = gameBoard
			.getBoard()
			.filter((board) => board.value === 'x');
		const winCombinations = [
			[0, 1, 2],
			[0, 3, 6],
			[0, 4, 8],
			[1, 4, 7],
			[2, 4, 6],
			[2, 5, 8],
			[3, 4, 5],
			[6, 7, 8],
		];

		for (let i = 0; i < winCombinations.length; i++) {
			let winTest = [];
			let oValues = oCells.map((cell) => cell.id);
			let xValues = xCells.map((cell) => cell.id);
			winCombinations[i].map((number) => winTest.push(number));

			const isSubset = (array1, array2) =>
				array2.every((element) => array1.includes(element));

			let oWinStatus = isSubset(oValues, winTest);
			let xWinStatus = isSubset(xValues, winTest);

			if (oWinStatus === true) {
				alert('Game Over! Player 2 is the winner!');
				resetBoard();

				if (player.getActivePlayer().value === 'o') {
					player.switchTurn();
					return;
				} else if (player.getActivePlayer().value === 'x') {
					return;
				}
			} else if (xWinStatus === true) {
				alert('Game Over! Player 1 is the winner!');
				resetBoard();

				if (player.getActivePlayer().value === 'o') {
					player.switchTurn();
					return;
				} else if (player.getActivePlayer().value === 'x') {
					return;
				}
			}
		}
	};

	const resetBoard = () => {
		gameBoard.getBoard().forEach((board) => (board.value = ''));
		roundNumber = 1;
	};
	return {
		handleRound,
		checkForWin,
	};
})();

const player = (() => {
	const players = [
		{
			name: 'Player 1',
			value: 'x',
		},
		{
			name: 'Player 2',
			value: 'o',
		},
	];

	let activePlayer = players[0];

	const switchTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	return {
		switchTurn,
		getActivePlayer,
	};
})();
