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
    var divTags = "";
    const boardBlockClass = "\"board-block\"";
    const occupiedBlockClass = "\"occupied-block\"";
    
    /* Create 200 regular blocks */
    for (let i = 0; i < 200; i++) {
        divTags += `<div class=${boardBlockClass}></div>`;
    }

    /* Create 10 occupied blocks */
    for (let i = 0; i < 10; i++) {
        divTags += `<div class=${occupiedBlockClass}></div>`;
    }
    
    document.getElementById("board").innerHTML = divTags;
    /* ----------------------------------------------------------------------*/

    /* Array of divs that form the game board */
    const boardBlocks = Array.from(document.querySelectorAll('#board div'));

    /* Mini-board blocks where the up-next tetromino is displayed */
    const upNextBoardBlocks = Array.from(document.querySelectorAll('#up-next-board div'));
    
    /* Apply usage of object literal */
    const createGameInfo = (
        gameStarted,
        gameOver,
        score,
        startBtn,
        timer,
        currentPosition,
        currentRotation,
        instantDrop,
        nextUpRandomIndex,
        randomIndex,
        currentTetromino
    ) => ({
        gameStarted,
        gameOver,
        score,
        startBtn,
        /* Used to move a tetromino every one second. */
        timer,
        /* Tetromino will be 'currentPosition' blocks to the right of the left wall of the board. */
        currentPosition,
        /* Indicates the rotation the current tetromino is. */
        currentRotation,
        /* Used to determine the rate at which tetromino drops. */
        instantDrop,
        /* Used for choosing next-up tetromino randomly. */
        nextUpRandomIndex,
        /* Randomly select a tetromino in its first rotation. 'randomIndex' is used to index a tetromino,
        and currentRotation is used to index the first rotation of the randomly chosen tetromino. */
        randomIndex,
        /* 1D array of indices that draw the tetromino */
        currentTetromino
    });

    const gameInfo = createGameInfo(
        false,
        false,
        document.querySelector("#score"),
        document.querySelector("#start-btn"),
        undefined,
        4,
        0,
        false,
        0,
        //Math.floor(Math.random() * tetrominoes.length),

        /* ----------- TESTING ------------------- */
        2,
        /* ----------- TESTING ------------------- */

        null
    );

    /* Draws the randomly chosen tetromino in the rotation indexed
     * by currentRotation.
     */
    function draw() {
        /* Move iTetromino one block to the left, and leave the other tetrominoes as they are. */
        if (!gameInfo.gameStarted && gameInfo.randomIndex === 6) {
            gameInfo.currentPosition--;
        }

        gameInfo.currentTetromino.forEach(index => {
            boardBlocks[gameInfo.currentPosition + index].style.backgroundColor = colors[gameInfo.randomIndex];
        });
    }

    /*
     * Simply removes the tetromino from the board, so it can be redrawn one position below.
     */
    function undraw() {
        gameInfo.currentTetromino.forEach(index => {
            boardBlocks[gameInfo.currentPosition + index].style.backgroundColor = ""
        });
    }

    /**
     * Assign functions to keyCodes to move and rotate tetrominoes.
     * We can object-destructure 'gameInfo' here because we're only checking
     * the value of its properties and not changing it.
     */
    function keyDown(event, { gameStarted, gameOver }) {

        /* Prevent calling the move functions if the game has not started. */
        if (gameStarted && !gameOver) {

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
                    if (!checkRowBelow()) {
                        moveDown()
                    }
                    break

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
        gameInfo.timer = setInterval(moveDown, 0);
    }


    /*
     * Moves the current tetromino down by one line.
     */
    function moveDown() {
        /* Player may move the tetromino sideways right before it moves down, so we need to
           make sure the tetromino is not drawn on top of an existing one below. */
        if (!checkRowBelow()) {
            undraw();
            gameInfo.currentPosition += boardWidth;
            draw();
        }
        
        /* Give time for tetromino to move or rotate before freezing in place */
        if (checkRowBelow()) {
            clearInterval(gameInfo.timer);

            const delayTime = gameInfo.instantDrop ? 0 : 1000;

            setTimeout(() => {
                /* Tetromino may have moved, so we should only call freeze() if it hits a wall */
                if (checkRowBelow()) {
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
        const isAtLeftWall = gameInfo.currentTetromino.some(index => (gameInfo.currentPosition + index) % boardWidth === 0)
        
        if (!isAtLeftWall) {
            gameInfo.currentPosition--;
        }

        /* If any of the blocks in the tetromino's new position are occupied, then stop it from moving. */
        if (gameInfo.currentTetromino.some(index => boardBlocks[gameInfo.currentPosition + index].classList.contains('occupied-block'))) {
            gameInfo.currentPosition++;
        }

        draw()
    }

    /*
     * Moves the current tetromino right by one column.
     */
    function moveRight() {
        undraw()

        /* Check to see if the tetromino is at the right wall */
        const isAtRightWall = gameInfo.currentTetromino.some(index => (gameInfo.currentPosition + index + 1) % boardWidth === 0)

        if (!isAtRightWall) {
            gameInfo.currentPosition++;
        }

        /* If any of the blocks in the tetromino's new position are occupied, then stop it from moving. */
        if (gameInfo.currentTetromino.some(index => boardBlocks[gameInfo.currentPosition + index].classList.contains('occupied-block'))) {
            gameInfo.currentPosition--;
        }

        draw()
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
            //gameInfo.randomIndex = gameInfo.nextUpRandomIndex;

            /* ----------- TESTING ------------------- */
            gameInfo.random = 2
            /* ----------- TESTING ------------------- */

            gameInfo.nextUpRandomIndex = Math.floor(Math.random() * tetrominoes.length)
            gameInfo.currentRotation = 0
            gameInfo.currentTetromino = tetrominoes[gameInfo.randomIndex][gameInfo.currentRotation]
            gameInfo.currentPosition = 4

            /* Check to see if game is over */
            checkGameOver()

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
                document.addEventListener("keydown", (event) => { keyDown(event, gameInfo); });

                /* Display the tetromino that will be spawned next. */
                gameInfo.nextUpRandomIndex = Math.floor(Math.random() * tetrominoes.length);
                displayUpNext();
                gameInfo.gameStarted = true

                /* Initialize the first tetromino */
                gameInfo.currentTetromino = tetrominoes[gameInfo.randomIndex][gameInfo.currentRotation];
            }

            draw()
            gameInfo.timer = setInterval(moveDown, 1000)
        }
    })
    
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

        /* ----- TESTING ----- */
        console.log("rotate() called")
        /* ----- TESTING ----- */

        undraw()
        /* Get the next rotation of the tetromino, and make sure to loop back to the first
           rotation if the index is out of bounds */
        if (++gameInfo.currentRotation === 4) {
            gameInfo.currentRotation = 0
        }

        /* We need to check to see if any of the newly rotated tetromino's blocks
           are out of place on the next row or the previous row. */
        checkRotation()
        gameInfo.currentTetromino = tetrominoes[gameInfo.randomIndex][gameInfo.currentRotation]

        draw()
    }
    
    /**
     * Called, whenever freeze() is called, to check for rows that
     * are full with tetromino blocks.  Each full row awards ten points.
     * The way I have it implemented now seems to be inefficient.  Maybe
     * I can improve it later.
     */
    function updateScore() {

        /* Check every row, starting from the bottom, for ones full with tetromino blocks. */
        for (let i = boardBlocks.length - 20; i >= 10; i -= 10) {
            let occupiedBlockCount = 0

            /* Check if the entire row is full with tetromino blocks */
            if (boardBlocks.slice(i, i + 10).every(value => value.classList.contains("occupied-block"))) {

                occupiedBlockCount = 10;

            }

            /* If a row is full, then occupiedBlockCount should be equal to ten, and
               ten points are to be awarded. */
            if (occupiedBlockCount === 10) {
                gameInfo.score.innerHTML = parseInt(gameInfo.score.innerHTML) + 1;

                /* First, clear the row. */
                for (let rowBlockIndex = i; rowBlockIndex < (i + 10); rowBlockIndex++) {
                    boardBlocks[rowBlockIndex].classList.remove("occupied-block");
                    boardBlocks[rowBlockIndex].style.backgroundColor = "";
                }

                /* Then, move all rows above it down by one. */
                for (let rowIndex = i - 10; rowIndex >= 0; rowIndex -= 10) {
                    
                    for (let colIndex = rowIndex; colIndex < (rowIndex + 10); colIndex++) {

                        if (boardBlocks[colIndex].classList.contains("occupied-block")) {

                            if (!boardBlocks[colIndex + 10].classList.contains("occupied-block")) {

                                boardBlocks[colIndex + 10].classList.add("occupied-block");
                                boardBlocks[colIndex + 10].style.backgroundColor = boardBlocks[colIndex].style.backgroundColor;

                                boardBlocks[colIndex].classList.remove("occupied-block");
                                boardBlocks[colIndex].style.backgroundColor = "";

                            }

                        }

                    }
                    
                }
            }

        }
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

        /* iTetromino is a special case on its own */
        if (gameInfo.randomIndex === 6) {
            
            

            
        } else {
            /* All other tetrominoes */
            /* Tetromino is at left wall */
            if ((gameInfo.currentPosition + 1) % boardWidth === 0) {
                if (gameInfo.currentTetromino.some(index => (gameInfo.currentPosition + index + 1) % boardWidth === 0)) {
                    gameInfo.currentPosition++
                }            
            }

            /* Tetromino is at right wall */
            if ((gameInfo.currentPosition + 2) % boardWidth === 0) {
                if (gameInfo.currentTetromino.some(index => (gameInfo.currentPosition + index + 1) % boardWidth === 0)) {
                    gameInfo.currentPosition--
                }
            }
        }

        /* Tetromino is right on top of other tetrominoes that are frozen in place */
        const rotationToCheck = tetrominoes[gameInfo.randomIndex][gameInfo.currentRotation]
        if (rotationToCheck.some(index => boardBlocks[gameInfo.currentPosition + index].classList.contains("occupied-block"))) {

            /* Revert the tetromino to its previous rotation */
            gameInfo.currentRotation = (--gameInfo.currentRotation === -1) ? 3 : gameInfo.currentRotation

        }
    }

});
