document.addEventListener('DOMContentLoaded', () => {
    "use strict"

    /* Board is 10 blocks wide, with each block being 30px by 30px. */
    const boardWidth = 10;
    /* This is the width of the small board that is to the right of the game board. */
    const miniBoardWidth = 4;

    /* --Tetromino Colors-- */
    const colors = [
        '#B348DA', // lTetrominoA
        '#DA48C6', // lTetrominoB
        '#F8A055', // zTetrominoA
        '#Fa6E59', // zTetrominoB
        '#4897D8', // tTetromino
        '#48DA71', // oTetromino
        '#FFDB5C'  // iTetromino
    ]

    /* Randomly select a tetromino from this array */
    const tetrominoes = [
        /* lTetrominoA - 0 */
        [
            [0, boardWidth, boardWidth + 1, boardWidth + 2],
            [1, 2, boardWidth + 1, boardWidth * 2 + 1],
            [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 2],
            [1, boardWidth + 1, boardWidth * 2, boardWidth * 2 + 1]
        ],

        /* lTetrominoB - 1 */
        [
            [2, boardWidth, boardWidth + 1, boardWidth + 2],
            [1, boardWidth + 1, boardWidth * 2 + 1, boardWidth * 2 + 2],
            [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth * 2],
            [0, 1, boardWidth + 1, boardWidth * 2 + 1]
        ],

        /* zTetrominoA - 2 */
        [
            [0, 1, boardWidth + 1, boardWidth + 2],
            [2, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 1],
            [boardWidth, boardWidth + 1, boardWidth * 2 + 1, boardWidth * 2 + 2],
            [1, boardWidth, boardWidth + 1, boardWidth * 2]
        ],

        /* zTetrominoB - 3 */
        [
            [1, 2, boardWidth, boardWidth + 1],
            [1, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 2],
            [boardWidth + 1, boardWidth + 2, boardWidth * 2, boardWidth * 2 + 1],
            [0, boardWidth, boardWidth + 1, boardWidth * 2 + 1]
        ],

        /* tTetromino - 4 */
        [
            [1, boardWidth, boardWidth + 1, boardWidth + 2],
            [1, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 1],
            [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 1],
            [1, boardWidth, boardWidth + 1, boardWidth * 2 + 1]
        ],

        /* oTetromino - 5 */
        [
            [0, 1, boardWidth, boardWidth + 1],
            [0, 1, boardWidth, boardWidth + 1],
            [0, 1, boardWidth, boardWidth + 1],
            [0, 1, boardWidth, boardWidth + 1]
        ],

        /* iTetromino - 6 */
        [
            [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth + 3],
            [2, boardWidth + 2, boardWidth * 2 + 2, boardWidth * 3 + 2],
            [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth + 3],
            [1, boardWidth + 1, boardWidth * 2 + 1, boardWidth * 3 + 1]
        ]

    ]

    /* Up-next tetrominoes mini-board positions */
    const upNextTetrominoes = [
        /* lTetrominoA */
        [miniBoardWidth + 1, miniBoardWidth * 2 + 1, miniBoardWidth * 2 + 2, miniBoardWidth * 2 + 3],
        /* lTetrominoB */
        [miniBoardWidth + 3, miniBoardWidth * 2 + 1, miniBoardWidth * 2 + 2, miniBoardWidth * 2 + 3],
        /* zTetrominoA */
        [miniBoardWidth + 1, miniBoardWidth + 2, miniBoardWidth * 2 + 2, miniBoardWidth * 2 + 3],
        /* zTetrominoB */
        [miniBoardWidth + 2, miniBoardWidth + 3, miniBoardWidth * 2 + 1, miniBoardWidth * 2 + 2],
        /* tTetromino */
        [miniBoardWidth + 2, miniBoardWidth * 2 + 1, miniBoardWidth * 2 + 2, miniBoardWidth * 2 + 3],
        /* oTetromino */
        [miniBoardWidth + 1, miniBoardWidth + 2, miniBoardWidth * 2 + 1, miniBoardWidth * 2 + 2],
        /* iTetromino */
        [miniBoardWidth, miniBoardWidth + 1, miniBoardWidth + 2, miniBoardWidth + 3]
    ]

    /* ----------------------------------------------------------------------*/
    /* Generate div tags to create the game board and the */
    /* up-next tetromino display mini-board.              */
    var blocks = ""

    /* Create 200 regular blocks */
    for (let i = 0; i < 200; i++) {
        blocks += '<div class="board-block"></div>'
    }

    /* Create 10 occupied blocks */
    for (let i = 0; i < 10; i++) {
        blocks += '<div class="occupied-block"></div>'
    }

    document.getElementById("game-board-0").innerHTML = blocks


    /* Array of divs that form the game board */
    const boardBlocks = Array.from(document.querySelectorAll('#game-board-0 div'));

    /* Mini-board blocks where the up-next tetromino is displayed */
    const upNextBoardBlocks = Array.from(document.querySelectorAll('#mini-board-0 div'));

    /* Use getters and setters to control access to an object */
    class GameInfo {

        constructor(playerName) {

            this._playerName = playerName
            this._gameStarted = false
            this._gameOver = false
            this._gamePaused = true
            this._forceFreeze = false
			this._stopDoubleMoveDown = false
            this._score = document.querySelector("#score-value-0")
            this._pauseResumeBtn = document.querySelector("#pause-resume-btn")
            this._startNewBtn = document.querySelector("#start-new-btn")
            this._timer = null
            this._currentPosition = 4
            this._currentRotation = 0
            this._instantDrop = false
            this._nextUpRandomIndex = 0
            this._randomIndex = Math.floor(Math.random() * tetrominoes.length)
            this._currentTetromino = null

        }

        /* -- Getters -- */
        get playerName() {
            return this._playerName
        }

        get gameStarted() {
            return this._gameStarted
        }

        get gameOver() {
            return this._gameOver
        }

        get gamePaused() {
            return this._gamePaused
        }

        get forceFreeze() {
            return this._forceFreeze
        }

		get stopDoubleMoveDown() {
			return this._stopDoubleMoveDown	
		}
		
        get score() {
            return this._score
        }

        get pauseResumeBtn() {
            return this._pauseResumeBtn
        }

        get startNewBtn() {
            return this._startNewBtn
        }

        get timer() {
            return this._timer
        }

        get currentPosition() {
            return this._currentPosition
        }

        get currentRotation() {
            return this._currentRotation
        }

        get instantDrop() {
            return this._instantDrop
        }

        get nextUpRandomIndex() {
            return this._nextUpRandomIndex
        }

        get randomIndex() {
            return this._randomIndex
        }

        get currentTetromino() {
            return this._currentTetromino
        }

        /* -- Setters -- */
        set playerName(updatePlayerName) {
            this._playerName = updatePlayerName
        }

        set gameStarted(updateGameStarted) {
            this._gameStarted = updateGameStarted
        }

        set gameOver(updateGameOver) {
            this._gameOver = updateGameOver
        }

        set gamePaused(updateGamePaused) {
            this._gamePaused = updateGamePaused
        }

        set forceFreeze(updateForceFreeze) {
            this._forceFreeze = updateForceFreeze
        }

		set stopDoubleMoveDown(updateStopDoubleMoveDown) {
			this._stopDoubleMoveDown = updateStopDoubleMoveDown
		}
		
        set timer(updateTimer) {
            this._timer = updateTimer
        }

        set currentPosition(updateCurrentPosition) {
            this._currentPosition = updateCurrentPosition
        }

        set currentRotation(updateCurrentRotation) {
            this._currentRotation = updateCurrentRotation
        }

        set instantDrop(updateInstantDrop) {
            this._instantDrop = updateInstantDrop
        }

        set nextUpRandomIndex(updateNextUpRandomIndex) {
            this._nextUpRandomIndex = updateNextUpRandomIndex
        }

        set randomIndex(updateRandomIndex) {
            this._randomIndex = updateRandomIndex
        }

        set currentTetromino(updateCurrentTetromino) {
            this._currentTetromino = updateCurrentTetromino
        }

    }

    const gameInfo = new GameInfo("New Player")

    /* Use class syntax to define a constructor function for an object
        in which functions are defined */
    class Pencil {

        constructor(owner) {

            this.owner = owner

            this.draw = () => {

                if (!gameInfo.gameStarted && gameInfo.randomIndex === 6) {
                    gameInfo.currentPosition--;
                }

                gameInfo.currentTetromino.forEach(index => {
                    boardBlocks[gameInfo.currentPosition + index].style.backgroundColor = colors[gameInfo.randomIndex];
                });

            }

            this.undraw = () => {

                gameInfo.currentTetromino.forEach(index => {
                    boardBlocks[gameInfo.currentPosition + index].style.backgroundColor = ""
                });

            }

        }

    }

    const pencil = new Pencil("Tetris")

    /**
     * Assign functions to keyCodes to move and rotate tetrominoes.
     * We can object-destructure 'gameInfo' here because we're only checking
     * the value of its properties and not changing it.
     */
    function keyDown(event, { gameStarted, gameOver, gamePaused }) {

        /* Prevent calling the move functions if the game has not started. */
        if (gameStarted && !gameOver && !gamePaused) {

            switch (event.keyCode) {

                case 32: /* Spacebar */
                    instantDropTrue()
                    break

                case 37: /* Left */
                    moveLeft()
                    break

                case 38: /* Up */
                    rotate()
                    break

                case 39: /* Right */
                    moveRight()
                    break

                case 40: /* Down */
                    /* If there is space below the current tetromino, then move it down,
                    otherwise freeze it immediately. */
                    if (checkRowBelow()) {
                        gameInfo.forceFreeze = true
						gameInfo.stopDoubleMoveDown = true
                    }
                    moveDown()
                    break

            }

        }
    }

    function keyDownCaller(event) {
        keyDown(event, gameInfo)
    }


    /**
     * Instantly drops tetromino to the bottom then freezes it in place
     * without giving the player time to rotate the tetromino at all.
     */
    function instantDropTrue() {
        /* Reduce the timer down to 100 ms and turn a flag ON. */
        /* When the tetromino freezes, if the flag is ON, the flag should be turned off
            and the timer should be reset to normal speed. */
        gameInfo.instantDrop = true;
        gameInfo.timer = clearInterval(gameInfo.timer);
        if (!gameInfo.timer) {
            gameInfo.timer = setInterval(moveDown, 0);
        }
    }


    /*
        * Moves the current tetromino down by one line.
        */
    function moveDown() {
        if (gameInfo.forceFreeze) {
			
            gameInfo.timer = clearInterval(gameInfo.timer)
            gameInfo.forceFreeze = false
            gameInfo.instantDrop = false
            freeze()
            if (!gameInfo.gameOver && !gameInfo.timer) {
                gameInfo.timer = setInterval(moveDown, 1000)
            }

        } else {

            /* Player may move the tetromino sideways right before it moves down, so we need to
            make sure the tetromino is not drawn on top of an existing one below. */
            if (!checkRowBelow()) {
                pencil.undraw();
                gameInfo.currentPosition += boardWidth;
                pencil.draw();
            }

            /* Give time for tetromino to move or rotate before freezing in place */
            if (checkRowBelow()) {
                
                gameInfo.timer = clearInterval(gameInfo.timer);

                const delayTime = gameInfo.instantDrop ? 0 : 1000;

                setTimeout(() => {
                    /* Tetromino may have moved, so we should only call freeze() if it hits a wall */
                    if (checkRowBelow()) {
                        freeze()
						
                        if (!gameInfo.gameOver && !gameInfo.timer) {
                            gameInfo.timer = setInterval(moveDown, 1000);
                        }
                    } else {
						if (gameInfo.stopDoubleMoveDown) {
							gameInfo.stopDoubleMoveDown = false
						} else {
                        	moveDown()
						}
                    }
                }, delayTime);

                gameInfo.instantDrop = false;

            }

        }
        
    }

    /*
        * Moves the current tetromino left by one column.
        */
    function moveLeft() {
        pencil.undraw()

        /* Check to see if the tetromino is at the left wall */
        const isAtLeftWall = gameInfo.currentTetromino.some(index => (gameInfo.currentPosition + index) % boardWidth === 0)

        if (!isAtLeftWall) {
            gameInfo.currentPosition--;
        }

        /* If any of the blocks in the tetromino's new position are occupied, then stop it from moving. */
        if (gameInfo.currentTetromino.some(index => boardBlocks[gameInfo.currentPosition + index].classList.contains('occupied-block'))) {
            gameInfo.currentPosition++;
        }

        pencil.draw()
    }

    /*
        * Moves the current tetromino right by one column.
        */
    function moveRight() {
        pencil.undraw()

        /* Check to see if the tetromino is at the right wall */
        const isAtRightWall = gameInfo.currentTetromino.some(index => (gameInfo.currentPosition + index + 1) % boardWidth === 0)

        if (!isAtRightWall) {
            gameInfo.currentPosition++;
        }

        /* If any of the blocks in the tetromino's new position are occupied, then stop it from moving. */
        if (gameInfo.currentTetromino.some(index => boardBlocks[gameInfo.currentPosition + index].classList.contains('occupied-block'))) {
            gameInfo.currentPosition--;
        }

        pencil.draw()
    }

    /*
        * If the row right below the tetromino is out-of-bounds, then 
        * the tetromino is frozen in place.
        */
    function freeze() {
        if (checkRowBelow()) {
            /* Prevent other tetrominoes from using the blocks on which the current tetromino has been frozen. */
            gameInfo.currentTetromino.forEach(
                index => boardBlocks[gameInfo.currentPosition + index].classList.add('occupied-block'))

            /* Update score */
            updateScore()

            /* Generate new random tetromino */
            gameInfo.randomIndex = gameInfo.nextUpRandomIndex;

            gameInfo.nextUpRandomIndex = Math.floor(Math.random() * tetrominoes.length)
            gameInfo.currentRotation = 0
            gameInfo.currentTetromino = tetrominoes[gameInfo.randomIndex][gameInfo.currentRotation]
            gameInfo.currentPosition = 4

            if (gameInfo.randomIndex === 6) {
                gameInfo.currentPosition--
            }

            /* Check to see if game is over */
            checkGameOver()

            if (!gameInfo.gameOver) {
                displayUpNext()
                pencil.draw()
            }
        }
    }


    /**
     * Start new game button
     */
    gameInfo.startNewBtn.addEventListener('click', () => {

        /* Clear the board */
        for (let i = 0; i < boardBlocks.length - 10; i++) {
            boardBlocks[i].classList.remove("occupied-block")
            boardBlocks[i].style.backgroundColor = ""
        }

        gameInfo.gameStarted = true

        /* Make game respond to keyboard input */
        /* Remove the event listener first to prevent duplicates */
        document.removeEventListener("keydown", keyDownCaller)
        document.addEventListener("keydown", keyDownCaller)

        /* Set the score to zero for a new game */
        gameInfo.score.innerHTML = 0

        /* Display the tetromino that will be spawned next */
        gameInfo.nextUpRandomIndex = Math.floor(Math.random() * tetrominoes.length)
        displayUpNext()

        /* Initialize the first tetromino */
        /* First, set randomIndex to a new random value! */
        gameInfo.randomIndex = Math.floor(Math.random() * tetrominoes.length)
        gameInfo.currentTetromino = tetrominoes[gameInfo.randomIndex][gameInfo.currentRotation]

        /* gameInfo.currentPosition needs to be reset to 4 also */
        gameInfo.currentPosition = 4

        /* Re-position iTetromino to be placed exactly in the center */
        if (gameInfo.randomIndex === 6) {
            gameInfo.currentPosition--
        }

        /* Enable game keyboard input */
        gameInfo.gamePaused = false

        /* Prevent browser scroll from responding to the keys */
        /* Remove the event listener first to prevent duplicates */
        window.removeEventListener("keydown", keyDownHandler, false)
        window.addEventListener("keydown", keyDownHandler, false)

        /* Make sure to remove the timer if it's already set */
        clearInterval(gameInfo.timer)
        pencil.draw()
        gameInfo.timer = setInterval(moveDown, 1000)
    })


    /**
     * Pressing the PAUSE/RESUME button will
     * pause or resume the game.
     */
    gameInfo.pauseResumeBtn.addEventListener('click', () => {
		
        if (gameInfo.timer) {
            
            /* Allow browser to respond to keys */
            window.removeEventListener("keydown", keyDownHandler, false)
            
            /* Disable game keyboard input */
            gameInfo.gamePaused = true

            clearInterval(gameInfo.timer)
            gameInfo.timer = null

        } else {
            /* Only call this if the game has not started to prevent the game from 
                drawing up a new tetromino every time the game is paused and resumed */
            if (!gameInfo.gameStarted) {
                
                gameInfo.gameStarted = true

                /* Make game respond to keyboard input */
                document.addEventListener("keydown", (event) => { keyDown(event, gameInfo) })
                
                /* Display the tetromino that will be spawned next. */
                gameInfo.nextUpRandomIndex = Math.floor(Math.random() * tetrominoes.length);
                displayUpNext();

                /* Initialize the first tetromino */
                gameInfo.currentTetromino = tetrominoes[gameInfo.randomIndex][gameInfo.currentRotation];

                /* Re-position iTetromino to be placed exactly in the center */
                if (gameInfo.randomIndex === 6) {
                    gameInfo.currentPosition--
                }

            }

            /* Enable game keyboard input */
            gameInfo.gamePaused = false
                
            /* Prevent browser scroll from responding to the keys */
            window.addEventListener("keydown", keyDownHandler, false)

            pencil.draw()
            gameInfo.timer = setInterval(moveDown, 1000)
        }
		
		document.activeElement.blur()
    })

    const keyDownHandler = function (event) {
        switch (event.keyCode) {
            case 32:
            case 37:
            case 38:
            case 39:
            case 40:
                event.preventDefault()
        }
    }

    /*
        * Displays the up-next tetromino on the up-next board.
        */
    function displayUpNext() {
        /* Remove the previous up-next tetromino by removing the colors from the board blocks */
        upNextBoardBlocks.forEach(block => {
            block.style.backgroundColor = ''
        })

        /* Display the up-next tetromino by coloring the board blocks with the chosen shape */
        upNextTetrominoes[gameInfo.nextUpRandomIndex].forEach(index => {
            upNextBoardBlocks[index].style.backgroundColor = colors[gameInfo.nextUpRandomIndex]
        })
    }

    /*
        * Rotates the current tetromino 90 degrees clockwise.
        */
    function rotate() {

        pencil.undraw()
        /* Get the next rotation of the tetromino, and make sure to loop back to the first
            rotation if the index is out of bounds */
        if (++gameInfo.currentRotation === 4) {
            gameInfo.currentRotation = 0
        }

        /* We need to check to see if any of the newly rotated tetromino's blocks
            are out of place on the next row or the previous row. */
        checkRotation()
        gameInfo.currentTetromino = tetrominoes[gameInfo.randomIndex][gameInfo.currentRotation]

        pencil.draw()
    }

    /**
     * Called, whenever freeze() is called, to check for rows that
     * are full with tetromino blocks.  Each full row awards one point.
     * The way I have it implemented now seems to be inefficient.  Maybe
     * I can improve it later.
     */
    function updateScore() {

		const clearedRows = []
		
        /* Check every row, starting from the bottom, for ones full with tetromino blocks */
        for (let rowNum = boardBlocks.length - 20; rowNum >= 0; rowNum -= 10) {
            let occupiedBlockCount = 0

            /* Check if the entire row is full with tetromino blocks */
            if (boardBlocks.slice(rowNum, rowNum + 10).every(value => value.classList.contains("occupied-block"))) {

                occupiedBlockCount = 10

            }

            /* If a row is full, then occupiedBlockCount should be equal to ten, and
                ten points are to be awarded */
            if (occupiedBlockCount === 10) {
                gameInfo.score.innerHTML = parseInt(gameInfo.score.innerHTML) + 1;

                /* Clear the row */
				for (let colNum = rowNum; colNum < rowNum + 10; colNum++) {
					
					boardBlocks[colNum].style.backgroundColor = ""
					boardBlocks[colNum].classList.remove("occupied-block")
					
				}
				
				/* Save the empty row */
				clearedRows.push(boardBlocks.splice(rowNum, 10))
            }
        }
		
		/* Now insert the cleared rows in the very front to shift all remaining rows down */
		clearedRows.forEach(row => {
			boardBlocks.unshift(...row)
			for (let blockIndex = 9; blockIndex >= 0; blockIndex--) {
					
				const firstBlock = document.getElementById("game-board-0").firstChild
				document.getElementById("game-board-0").insertBefore(boardBlocks[blockIndex], firstBlock)
					
			}
		})
				
    }

    /**
     * Ends the game if the game board is filled all the way up to the
     * third row, and a new tetromino is spawned.
     * Although an iTetromino spawns on the second row and would leave
     * an open first row, the tetromino cannot rotate, and the up-next
     * tetromino will not have room to spawn, regardless of its shape.
     */
    function checkGameOver() {

        if (gameInfo.currentTetromino.some(index => boardBlocks[gameInfo.currentPosition + index].classList.contains('occupied-block'))) {
            /* For now, let's just pause the game when the game is over. */
            clearInterval(gameInfo.timer)
            gameInfo.gameOver = true
        }

    }


    /* ---------------------------------- Helper Functions ---------------------------------- */
    /*
        * Helper function to check to see if the row right below the current tetromino
        * is occupied in any blocks, so that the tetromino freezes in place.
        * Returns true if row below is occupied, false otherwise.
        */
    function checkRowBelow() {
        return gameInfo.currentTetromino.some(index => boardBlocks[gameInfo.currentPosition + index + boardWidth].classList.contains('occupied-block'))
    }

    /*
        * Checks to see if a tetromino was at or close enough to a wall, then repositions it one index
        * to the left or right to correctly place it in its newly rotated position.
        */ 
    function checkRotation() {

        /* iTetromino */
        switch (gameInfo.randomIndex) {

            case 0:

            case 1:

            case 2:

            case 3:

            case 4:

                /* Left Wall */
                if (gameInfo.currentRotation === 2 && (gameInfo.currentPosition + 1) % boardWidth === 0) {

                    gameInfo.currentPosition++;

                }

                /* Right Wall */
                if (gameInfo.currentRotation === 0 && (gameInfo.currentPosition + 2) % boardWidth === 0) {

                    gameInfo.currentPosition--;

                }

                break;

            case 6:

                /* Left Wall */
                if (gameInfo.currentRotation === 0 && (gameInfo.currentPosition + 1) % boardWidth === 0) {

                    gameInfo.currentPosition++;

                }

                if (gameInfo.currentRotation === 2 && (gameInfo.currentPosition + 2) % boardWidth === 0) {

                    gameInfo.currentPosition += 2;

                }

                /* Right Wall */
                if (gameInfo.currentRotation === 0 && (gameInfo.currentPosition + 2) % boardWidth === 0) {

                    gameInfo.currentPosition -= 2;

                }

                if (gameInfo.currentRotation === 2 && (gameInfo.currentPosition + 3) % boardWidth === 0) {

                    gameInfo.currentPosition--;

                }

                break;

        }

        /* Tetromino is right on top of other tetrominoes that are frozen in place */
        const rotationToCheck = tetrominoes[gameInfo.randomIndex][gameInfo.currentRotation]
        if (rotationToCheck.some(index => boardBlocks[gameInfo.currentPosition + index].classList.contains("occupied-block"))) {

            /* Revert the tetromino to its previous rotation */
            gameInfo.currentRotation = (--gameInfo.currentRotation === -1) ? 3 : gameInfo.currentRotation

        }
    }
})