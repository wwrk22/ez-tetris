document.addEventListener('DOMContentLoaded', () => {
    "use strict"

    /* Board is 10 blocks wide, with each block being 30px by 30px. */
    const boardWidth = 10;

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
        lTetrominoA,
        lTetrominoB,
        zTetrominoA,
        zTetrominoB,
        tTetromino,
        oTetromino,
        iTetromino
    ]

    const boardInfo = {
        /* Board is where the game is played, and it contains individual blocks. */
        board: document.querySelector('#board'),
        /* Board blocks have to be manipulated to show movement of tetrominoes. */
        boardBlocks: Array.from(document.querySelectorAll('#board div'))
    }
    
    const gameInfo = {
        gameStarted: false,
        scoreDisplay: document.querySelector('#score-display'),
        startBtn: document.querySelector('#start-btn'),
        score: 0,
        /* Used to move a tetromino every one second. */
        timer: undefined,
        /* Tetromino will be 'currentPosition' blocks to the right of the left wall of the board. */
        currentPosition: 4,
        /* Indicates the rotation the current tetromino is. */
        currentRotation: 0,
    }

    /* Used for choosing next-up tetromino randomly. */
    let nextUpRandomIndex = 0
    /* Randomly select a tetromino in its first rotation. 'randomIndex' is used to index a tetromino,
       and currentRotation is used to index the first rotation of the randomly chosen tetromino. */
    let randomIndex = Math.floor(Math.random() * tetrominoes.length)
    let currentTetromino = tetrominoes[randomIndex][gameInfo.currentRotation]

    /* Draws the randomly chosen tetromino in the rotation indexed
     * by currentRotation.
     */
    function draw() {
        /* Move iTetromino one block to the left, and leave the other tetrominoes as they are. */
        if (!gameInfo.gameStarted && randomIndex === 6) {
            gameInfo.currentPosition--
            gameInfo.gameStarted = true
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

    /* Assign functions to keyCodes to move and rotate tetrominoes. */
    function controls(event) {
        switch (event.keyCode) {
            case 37:
                moveLeft()
                break
            case 38:
                rotate()
                break
            case 39:
                moveRight()
                break
            case 40:
                moveDown()
        }
    }
    document.addEventListener('keyup', controls);

    /*
     * Moves the current tetromino down by one line.
     */
    function moveDown() {
        /* Player may move the tetromino sideways right before it moves down, so we need to
           make sure the tetromino is not drawn on top of an existing one below. */
        if (!checkRowBelow()) {
            undraw()
            gameInfo.currentPosition += boardWidth
            draw()
        }
        freeze()
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

        
    }

    /*
     * If the row right below the tetromino is out-of-bounds, then 
     * the tetromino is frozen in place.
     */
    function freeze() {
        if (currentTetromino.some(index => boardInfo.boardBlocks[gameInfo.currentPosition + index + boardWidth].classList.contains('occupied-block'))) {
            /* Prevent other tetrominoes from using the blocks on which the current tetromino has been frozen. */
            currentTetromino.forEach(
                index => boardInfo.boardBlocks[gameInfo.currentPosition + index].classList.add('occupied-block'))
            /* Generate new random tetromino */
            randomIndex = nextUpRandomIndex
            nextUpRandomIndex = Math.floor(Math.random() * tetrominoes.length)
            currentTetromino = tetrominoes[randomIndex][0]
            gameInfo.currentPosition = 4
            draw()

        }
    }

    /*
     * Helper function to check to see if the row right below the current tetromino
     * is occupied in any blocks, so that the tetromino freezes in place.
     * Returns true if row below is occupied, false otherwise.
     */
    function checkRowBelow() {
        return currentTetromino.some(index => boardInfo.boardBlocks[gameInfo.currentPosition + index + boardWidth].classList.contains('occupied-block'))
    }

    /* When game starts, draw() has to be called once first. */
    draw()
    gameInfo.timer = setInterval(moveDown, 1000)
})
