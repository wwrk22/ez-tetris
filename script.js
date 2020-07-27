document.addEventListener('DOMContentLoaded', () => {
    "use strict"

    const myName = "Won Rhim";
    alert(`Welcome!\nEnjoy the game!\nBuilt by ${myName}`);

    /* Board is 10 blocks wide, with each block being 30px by 30px. */
    const boardWidth = 10;
    /* This is the width of the small board that is to the right of the game board. */
    const miniBoardWidth = 4;

    /* --Tetrominoes-- */
    const lTetrominoA = [
        [0, boardWidth, boardWidth + 1, boardWidth + 2],
        [1, 2, boardWidth + 1, boardWidth * 2 + 1],
        [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 2],
        [1, boardWidth + 1, boardWidth * 2, boardWidth * 2 + 1]
    ]

    const lTetrominoB = [
        [2, boardWidth, boardWidth + 1, boardWidth + 2],
        [1, boardWidth + 1, boardWidth * 2 + 1, boardWidth * 2 + 2],
        [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth * 2],
        [0, 1, boardWidth + 1, boardWidth * 2 + 1]
    ]

    const zTetrominoA = [
        [0, 1, boardWidth + 1, boardWidth + 2],
        [2, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 1],
        [boardWidth, boardWidth + 1, boardWidth * 2 + 1, boardWidth * 2 + 2],
        [1, boardWidth, boardWidth + 1, boardWidth * 2]
    ]

    const zTetrominoB = [
        [1, 2, boardWidth, boardWidth + 1],
        [1, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 2],
        [boardWidth + 1, boardWidth + 2, boardWidth * 2, boardWidth * 2 + 1],
        [0, boardWidth, boardWidth + 1, boardWidth * 2 + 1]
    ]

    const tTetromino = [
        [1, boardWidth, boardWidth + 1, boardWidth + 2],
        [1, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 1],
        [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 1],
        [1, boardWidth, boardWidth + 1, boardWidth * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, boardWidth, boardWidth + 1],
        [0, 1, boardWidth, boardWidth + 1],
        [0, 1, boardWidth, boardWidth + 1],
        [0, 1, boardWidth, boardWidth + 1]
    ]

    const iTetromino = [
        [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth + 3],
        [2, boardWidth + 2, boardWidth * 2 + 2, boardWidth * 3 + 2],
        [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth + 3],
        [1, boardWidth + 1, boardWidth * 2 + 1, boardWidth * 3 + 1]
    ]

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
        lTetrominoA, // 0
        lTetrominoB, // 1
        zTetrominoA, // 2
        zTetrominoB, // 3
        tTetromino,  // 4
        oTetromino,  // 5
        iTetromino   // 6
    ]

    const tetrominoNumbers = {
        lA: 0,
        lB: 1,
        zA: 2,
        zB: 3,
        t: 4,
        o: 5,
        i: 6
    }

    /* Up-next tetrominoe positions */
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

    const boardInfo = {
        /* board is where the game is played, and it contains individual blocks */
        board: document.querySelector('#board'),
        /* Board blocks have to be manipulated to show movement of tetrominoes */
        boardBlocks: Array.from(document.querySelectorAll('#board div'))
    }

    const upNextBoardInfo = {
        /* upNextBoard is where the up-next tetromino will be displayed for the user to see */
        upNextBoard: document.querySelector('#up-next-board'),
        /* use board blocks to display the up-next tetromino */
        upNextBoardBlocks: Array.from(document.querySelectorAll('#up-next-board div'))
    }
    
    const gameInfo = {
        gameStarted: false,
        gameOver: false,
        scoreDisplay: document.querySelector('#score-display'),
        startBtn: document.querySelector('#start-btn'),
        score: 0,
        /* Used to move a tetromino every one second. */
        timer: undefined,
        /* Tetromino will be 'currentPosition' blocks to the right of the left wall of the board. */
        currentPosition: 4,
        /* Indicates the rotation the current tetromino is. */
        currentRotation: 0,
        /* Used to determine the rate at which tetromino drops. */
        instantDrop: false
    }

    /* Used for choosing next-up tetromino randomly. */
    let nextUpRandomIndex = 0
    /* Randomly select a tetromino in its first rotation. 'randomIndex' is used to index a tetromino,
       and currentRotation is used to index the first rotation of the randomly chosen tetromino. */
    let randomIndex = Math.floor(Math.random() * tetrominoes.length)
    let currentTetromino = tetrominoes[randomIndex][gameInfo.currentRotation]

    /* Let's destructure objects and extract values. */
    const { board, boardBlocks } = boardInfo;
    const { upNextBoard, upNextBoardBlocks } = upNextBoardInfo;

    /* Draws the randomly chosen tetromino in the rotation indexed
     * by currentRotation.
     */
    function draw() {
        /* Move iTetromino one block to the left, and leave the other tetrominoes as they are. */
        if (!gameInfo.gameStarted && randomIndex === 6) {
            gameInfo.currentPosition--
        }
        currentTetromino.forEach(index => {
            boardInfo.boardBlocks[gameInfo.currentPosition + index].style.backgroundColor = colors[randomIndex];
        })
    }

    /*
     * Simply removes the tetromino from the board, so it can be redrawn one position below.
     */
    function undraw() {
        currentTetromino.forEach(index => {
            boardInfo.boardBlocks[gameInfo.currentPosition + index].style.backgroundColor = ""
        })
    }

    /**
     * Assign functions to keyCodes to move and rotate tetrominoes.
     * We can object-destructure 'gameInfo' here because we're only checking
     * the value of 'gameStarted', and not changing it.
     */
    function controls(event, { gameStarted }) {
        /* Prevent calling the move functions if the game has not started. */
        if (gameStarted) {
            switch (event.keyCode) {
                case 32: /* Spacebar */
                    instantDropTrue();
                    break;
                case 37: /* Left Arrow */
                    moveLeft()
                    break
                case 38: /* Up Arrow */
                    rotate()
                    break
                case 39: /* Right Arrow */
                    moveRight()
                    break
                case 40: /* Down Arrow */
                    if (!checkRowBelow(boardInfo)) {
                        moveDown();
                        console.log("foo foo");
                    }
            }
        }
    }

    function keyDown() {
        if (event.keyCode === 40) {
            if (!checkRowBelow(boardInfo)) {
                moveDown();
            }
        }
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
        clearInterval(gameInfo.timer);
        gameInfo.timer = null;
        gameInfo.timer = setInterval(moveDown, 0);
    }


    /*
     * Moves the current tetromino down by one line.
     */
    function moveDown() {
        /* Player may move the tetromino sideways right before it moves down, so we need to
           make sure the tetromino is not drawn on top of an existing one below. */
        if (!checkRowBelow(boardInfo)) {
            undraw()
            gameInfo.currentPosition += boardWidth
            draw()
        }
        
        /* Give time for tetromino to move or rotate before freezing in place */
        if (checkRowBelow(boardInfo)) {
            clearInterval(gameInfo.timer)

            const delayTime = gameInfo.instantDrop ? 0 : 1000;

            /* Tetromino may have moved, so we should only call freeze() if it
               hits a wall */
            setTimeout(() => {
                if (checkRowBelow(boardInfo)) {
                    freeze()
                    if (!gameInfo.gameOver) {
                        gameInfo.timer = setInterval(moveDown, 1000);
                    }
                } else {
                    moveDown()
                }
            }, delayTime);

            gameInfo.instantDrop = false;
        }
    }

    /*
     * Moves the current tetromino left by one column.
     */
    function moveLeft() {
        undraw()

        /* Check to see if the tetromino is at the left wall */
        const isAtLeftWall = currentTetromino.some(index => (gameInfo.currentPosition + index) % boardWidth === 0)
        
        if (!isAtLeftWall) {
            gameInfo.currentPosition -= 1
        }

        /* If any of the blocks in the tetromino's new position are occupied, then stop it from moving. */
        if (currentTetromino.some(index => boardInfo.boardBlocks[gameInfo.currentPosition + index].classList.contains('occupied-block'))) {
            gameInfo.currentPosition += 1
        }

        draw()
    }

    /*
     * Moves the current tetromino right by one column.
     */
    function moveRight() {
        undraw()

        /* Check to see if the tetromino is at the right wall */
        const isAtRightWall = currentTetromino.some(index => (gameInfo.currentPosition + index + 1) % boardWidth === 0)

        if (!isAtRightWall) {
            gameInfo.currentPosition += 1
        }

        /* If any of the blocks in the tetromino's new position are occupied, then stop it from moving. */
        if (currentTetromino.some(index => boardInfo.boardBlocks[gameInfo.currentPosition + index].classList.contains('occupied-block'))) {
            gameInfo.currentPosition -= 1
        }

        draw()
    }

    /*
     * If the row right below the tetromino is out-of-bounds, then 
     * the tetromino is frozen in place.
     */
    function freeze() {
        if (checkRowBelow(boardInfo)) {
            /* Prevent other tetrominoes from using the blocks on which the current tetromino has been frozen. */
            currentTetromino.forEach(
                index => boardInfo.boardBlocks[gameInfo.currentPosition + index].classList.add('occupied-block'))
            /* Update score */
            updateScore()
            /* Generate new random tetromino */
            randomIndex = nextUpRandomIndex
            nextUpRandomIndex = Math.floor(Math.random() * tetrominoes.length)
            currentTetromino = tetrominoes[randomIndex][0]
            gameInfo.currentPosition = 4
            gameOver()

            if (!gameInfo.gameOver) {
                draw()
                displayUpNext()
            }
        }
    }

    /*
     * Pressing the START/PAUSE button will
     * start/resume/pause the game.
     */
    gameInfo.startBtn.addEventListener('click', () => {
        if (gameInfo.timer) {
            clearInterval(gameInfo.timer)
            gameInfo.timer = null
        } else {
            /* Only call this if the game has not started to prevent the game from 
               drawing up a new tetromino every time the game is paused and resumed */
            if (!gameInfo.gameStarted) {
                /* Make game respond to keyboard input */
                document.addEventListener('keyup', (event) => { controls(event, gameInfo); });
                document.onkeydown = keyDown;

                /* Display the tetromino that will be spawned next. */
                displayUpNext()
                gameInfo.gameStarted = true
            }
            draw()
            gameInfo.timer = setInterval(moveDown, 1000)
            nextUpRandomIndex = Math.floor(Math.random() * tetrominoes.length)            
        }
    })
    
    /*
     * Displays the up-next tetromino on the up-next board.
     */
    function displayUpNext() {
        /* Remove the previous up-next tetromino by removing the colors from the board blocks */
        upNextBoardInfo.upNextBoardBlocks.forEach(block => {
            block.style.backgroundColor = ''
        })

        /* Display the up-next tetromino by coloring the board blocks with the chosen shape */
        upNextTetrominoes[nextUpRandomIndex].forEach(index => {
            upNextBoardInfo.upNextBoardBlocks[index].style.backgroundColor = colors[nextUpRandomIndex]
        })
    }

    /*
     * Rotates the current tetromino 90 degrees clockwise.
     */
    function rotate() {
        undraw()
        /* Get the next rotation of the tetromino, and make sure to loop back to the first
           rotation if the index is out of bounds */
        gameInfo.currentRotation++
        
        if (gameInfo.currentRotation === 4) {
            gameInfo.currentRotation = 0
        }

        currentTetromino = tetrominoes[randomIndex][gameInfo.currentRotation]

        /* We need to check to see if any of the newly rotated tetromino's blocks
           are out of place on the next row or the previous row. */
        checkRotation()
        
        draw()
    }
    
    /**
     * Called, whenever freeze() is called, to check for rows that
     * are full with tetromino blocks.  Each full row awards ten points.
     * The way I have it implemented now seems to be inefficient.  Maybe
     * I can improve it later.
     */
    function updateScore() {
        /* After clearing the full rows, move the remaining tetromino blocks
           by 'numRowsRemoved' rows. */
        let numRowsRemoved = 0

        /* Check every row, starting from the bottom, for ones full with tetromino blocks. */
        for (let i = boardInfo.boardBlocks.length - 20; i >= 10; i -= 10) {
            let occupiedBlockCount = 0

            /* Check if the entire row is full with tetromino blocks */
            for (let j = i; j < (i + 10); j++) {
                if (boardInfo.boardBlocks[j].classList.contains('occupied-block')) {
                    occupiedBlockCount++
                }
            }

            /* If a row is full, then occupiedBlockCount should be equal to ten, and
               ten points are to be awarded. */
            if (occupiedBlockCount === 10) {
                gameInfo.score += 10
                numRowsRemoved++
            }

        }

        /* Clear all the rows that are full. */
        let i = boardInfo.boardBlocks.length - 20
        let saveNumRowsRemoved = numRowsRemoved
        while (numRowsRemoved > 0) {
            console.log("This should only print once.")
            for (let j = i; j < (i + 10); j++) {
                boardInfo.boardBlocks[j].classList.remove('occupied-block')
                boardInfo.boardBlocks[j].style.backgroundColor = ''
            }

            numRowsRemoved--
            i -= 10
        }

        /* Move the remaining tetromino blocks down. */
        if (saveNumRowsRemoved > 0) {
            let numBlocksToMoveDown = ((boardInfo.boardBlocks.length - 20) - i)
            while (i >= 0) {
                for (let j = i; j < (i + 10); j++) {
                    if (boardInfo.boardBlocks[j].classList.contains('occupied-block')) {
                        boardInfo.boardBlocks[j + numBlocksToMoveDown].classList.add('occupied-block')
                        boardInfo.boardBlocks[j + numBlocksToMoveDown].style.backgroundColor = boardInfo.boardBlocks[j].style.backgroundColor
                        boardInfo.boardBlocks[j].classList.remove('occupied-block')
                        boardInfo.boardBlocks[j].style.backgroundColor = ''
                    }
                }

                i -= 10
            }
        }

        /* Update and display the score */
        gameInfo.scoreDisplay.innerHTML = gameInfo.score
    }

    /**
     * Ends the game if the game board is filled all the way up to the
     * third row, and a new tetromino is spawned.
     * Although an iTetromino spawns on the second row and would leave
     * an open first row, the tetromino cannot rotate, and the up-next
     * tetromino will not have room to spawn, regardless of its shape.
     */
    function gameOver() {
        /* What shape tetromino is the up-next one? */
        if (currentTetromino.some(index => boardInfo.boardBlocks[gameInfo.currentPosition + index].classList.contains('occupied-block'))) {
            /* For now, let's just pause the game when the game is over. */
            clearInterval(gameInfo.timer)
            gameInfo.gameOver = true
        }
        /* Check it's indices added to the currentPosition to see
           if any of them are occupied.  If so, then GAME OVER! */

    }


    /* ---------------------------------- Helper Functions ---------------------------------- */
    /*
     * Helper function to check to see if the row right below the current tetromino
     * is occupied in any blocks, so that the tetromino freezes in place.
     * Returns true if row below is occupied, false otherwise.
     */
    function checkRowBelow({ boardBlocks }) {
        return currentTetromino.some(index => boardBlocks[gameInfo.currentPosition + index + boardWidth].classList.contains('occupied-block'))
    }

    /*
     * Checks to see if a tetromino was at or close enough to a wall, then repositions it one index
     * to the left or right to correctly place it in its newly rotated position.
     */ 
    function checkRotation() {
        /* iTetromino is a special case on its own */
        if (randomIndex === tetrominoNumbers.i) {
            if ((gameInfo.currentPosition + 3) % boardWidth === 0) {
                if (currentTetromino.some(index => (gameInfo.currentPosition + index + 1) % boardWidth === 0)) {
                    gameInfo.currentPosition--
                }
            } 

            if ((gameInfo.currentPosition + 2) % boardWidth === 0) {
                if (currentTetromino.some(index => (gameInfo.currentPosition + index) % boardWidth === 0)) {
                    if (gameInfo.currentRotation === 0) {
                        gameInfo.currentPosition -= 2
                    }
                    if (gameInfo.currentRotation === 2) {
                        gameInfo.currentPosition += 2
                    }
                }
            }

            if ((gameInfo.currentPosition + 1) % boardWidth === 0) {
                if (currentTetromino.some(index => (gameInfo.currentPosition + index + 1) % boardWidth === 0)) {
                    gameInfo.currentPosition++
                }
            }
        } else {
            /* All other tetrominoes */
            /* Tetromino is at left wall */
            if ((gameInfo.currentPosition + 1) % boardWidth === 0) {
                if (currentTetromino.some(index => (gameInfo.currentPosition + index + 1) % boardWidth === 0)) {
                    gameInfo.currentPosition++
                }            
            }

            /* Tetromino is at right wall */
            if ((gameInfo.currentPosition + 2) % boardWidth === 0) {
                if (currentTetromino.some(index => (gameInfo.currentPosition + index + 1) % boardWidth === 0)) {
                    gameInfo.currentPosition--
                }
            }
        }
    }
})
