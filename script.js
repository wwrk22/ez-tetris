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
        scoreDisplay: document.querySelector('#score-display'),
        startBtn: document.querySelector('#start-btn'),
        score: 0,
        /* Used for choosing next-up tetromino randomly. */
        nextUpRandom: 0,
        /* Used to move a tetromino every one second. */
        timer: undefined,
        /* Tetromino will be 'currentPosition' blocks to the right of the left wall of the board. */
        currentPosition: 4,
        /* Indicates the rotation the current tetromino is. */
        currentRotation: 0
    }

    
    /* Randomly select a tetromino in its first rotation.
       Random is used to index a tetromino, and currentRotation is used to index
       the first rotation of the randomly chosen tetromino. */
    let random = Math.floor(Math.random() * tetrominoes.length)
    let currentTetromino = tetrominoes[random][gameInfo.currentRotation]

    /* Draws the randomly chosen tetromino in the rotation indexed
     * by currentRotation.
     */
    function draw() {
        /* Move iTetromino one block to the left, and leave the other tetrominoes as they are. */
        if (random === 6) {
            gameInfo.currentPosition--;
        }
        currentTetromino.forEach(index => {
            boardInfo.boardBlocks[gameInfo.currentPosition + index].style.backgroundColor = colors[random];
        })
    }

    draw()
})