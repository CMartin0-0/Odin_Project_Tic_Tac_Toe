import './style.css';

const gameBoard = (() => {
	let board = [];

	for (let i = 0; i < 9; i++) {
		board[i] = { id: i, value: '' };
	}

	const getBoard = () => board;

	const updateBoardWithMove = (cell: number) => {
		let boardCellSelectedIndex = board.findIndex((obj) => obj.id == cell);
		const playerValue = player.getActivePlayer().value;

		if (board[boardCellSelectedIndex].value !== '') {
			alert('Please select an empty square to make move');
			return;
		} else {
			board[boardCellSelectedIndex].value = playerValue;
			if (game.getRoundNumber() >= 3) {
				game.checkForEndCondition();
			}
		}
	};

	return {
		getBoard,
		updateBoardWithMove,
	};
})();

const game = (() => {
	let roundNumber = 1;

	const getRoundNumber = () => roundNumber;

	const increaseRoundNumber = (value: number) => {
		roundNumber = roundNumber + value;
	};

	const setRoundNumber = (value: number) => {
		roundNumber = value;
	};

	const handleRound = (cell: number) => {
		let cellChosen = cell;
		roundNumber = game.getRoundNumber();

		gameBoard.updateBoardWithMove(cellChosen);
		player.switchTurn();
		game.increaseRoundNumber(1);
	};

	const checkForEndCondition = () => {
		let oCells = gameBoard
			.getBoard()
			.filter((board) => board.value === 'o');
		let xCells = gameBoard
			.getBoard()
			.filter((board) => board.value === 'x');
		let emptyCells = gameBoard
			.getBoard()
			.filter((board) => board.value == '');

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

		const isSubset = (array1: Array<number>, array2: Array<number>) =>
			array2.every((element) => array1.includes(element));

		let oValues = oCells.map((cell) => cell.id);
		let xValues = xCells.map((cell) => cell.id);
		let emptyValues = emptyCells.map((cell) => cell.id);
		let xTieValues = xValues.concat(emptyValues);
		let oTieValues = oValues.concat(emptyValues);

		let oTies = [];
		let xTies = [];

		for (let i = 0; i < winCombinations.length; i++) {
			let winTest: Array<number> = [];

			winCombinations[i].map((number) => winTest.push(number));

			let oWinStatus = isSubset(oValues, winTest);
			let xWinStatus = isSubset(xValues, winTest);
			xTies.push(isSubset(xTieValues, winTest));
			oTies.push(isSubset(oTieValues, winTest));

			if (oWinStatus === true) {
                alert("Player 2 Won!")
				game.resetGame();
			}

			if (xWinStatus === true) {
                alert("Player 1 Won!")
				game.resetGame();
			}

			if (
				oTies.every((x) => x === false) &&
				xTies.every((x) => x === false)
			) {
                alert("Tie Game!")
				game.resetGame();
                return
			}
		}
	};

	const resetGame = () => {
		setTimeout(() => {
			gameBoard.getBoard().forEach((board) => (board.value = ''));
		}, 500);

		setTimeout(() => {
			game.setRoundNumber(1);
			handleGameDisplay.playerTurnDisplay.classList.add('hidden');
			handleGameDisplay.roundNumberDisplay.classList.add('hidden');
		}, 600);

		setTimeout(() => {
			handleGameDisplay.getGameInfoToDisplay();
		}, 700);
		player.setActivePlayer(1);
	};

	return {
		handleRound,
		getRoundNumber,
		increaseRoundNumber,
		resetGame,
		checkForEndCondition,
		setRoundNumber,
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

	const setActivePlayer = (playerNumber: number) => {
		activePlayer = players[playerNumber];
	};

	return {
		switchTurn,
		getActivePlayer,
		setActivePlayer,
	};
})();

const handleGameDisplay = (() => {
	const gameBoardDisplay = <HTMLDivElement>(
		document.getElementById('gameboard')
	);
	const roundNumberDisplay = <HTMLParagraphElement>(
		document.getElementById('round-number')
	);
	const playerTurnDisplay = <HTMLParagraphElement>(
		document.getElementById('player-turn-info')
	);
    const resetButton = <HTMLButtonElement>(
        document.getElementById('reset')
    );

	const getGameInfoToDisplay = () => {
		const formattedBoard = gameBoard
			.getBoard()
			.map(
				(cell) => `
       <button id=${cell.id} class='board-cell' type='button'>${cell.value}</button>
       `
			)
			.join('');

		gameBoardDisplay.innerHTML = formattedBoard;
		roundNumberDisplay.innerHTML = `Round: ${game.getRoundNumber()}`;
		playerTurnDisplay.innerHTML = `${
			player.getActivePlayer().name
		}'s Turn!`;
	};

	gameBoardDisplay?.addEventListener('click', (event) => {
		setTimeout(() => {
			playerTurnDisplay.classList.remove('hidden');
			roundNumberDisplay.classList.remove('hidden');
		}, 200);

		setTimeout(() => {
			let cellSelectedIndex = (event.target as HTMLElement)
				.closest('button')
				?.getAttribute('id');
			game.handleRound(cellSelectedIndex as any);

			getGameInfoToDisplay();
		}, 1000);
	});

    resetButton.addEventListener('click', () => {
        
        
        game.resetGame();
        player.setActivePlayer(0);
       
    });

	return { getGameInfoToDisplay, roundNumberDisplay, playerTurnDisplay };
})();

handleGameDisplay.getGameInfoToDisplay();
