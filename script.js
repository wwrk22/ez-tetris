document.addEventListener('DOMContentLoaded', () => {
    /* Tetrominoes */
    const lTetrominoA = [
        [0, width, width + 1, width + 2],
        [1, 2, width + 1, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2, width * 2 + 1]
    ]

    const lTetrominoB = [
        [2, width, width + 1, width + 2],
        [1, width + 1, width * 2 + 1, width * 2 + 2],
        [width, width + 1, width + 2, width * 2],
        [0, 1, width + 1, width * 2 + 1]
    ]

    const zTetrominoA = [
        [0, 1, width + 1, width + 2],
        [2, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width * 2 + 1, width * 2 + 2],
        [1, width, width + 1, width * 2]
    ]

    const zTetrominoB = [
        [1, 2, width, width + 1],
        [1, width + 1, width + 2, width * 2 + 2],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [width, width + 1, width + 2, width + 3],
        [2, width + 2, width * 2 + 2, width * 3 + 2],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1]
    ]

    /* Tetromino Colors */
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

    /* Board is where the game is played, and it contains individual blocks. */
    const board = document.querySelector('#board')
    /* Board blocks have to be manipulated to show movement of tetrominoes. */
    let boardBlocks = Array.from(document.querySelectorAll('#board div'))
    const scoreDisplay = document.querySelector('#score-display')
    const startBtn = document.querySelector('#start-btn')
    /* Add 10 (board width) to the position of a block of a tetromino to move it down. */
    const width = 10
    let score = 0
    /* Used for choosing next-up tetromino randomly. */
    let nextUpRandom = 0;
    /* Used to move a tetromino every one second. */
    let timer
    /* Tetromino will be 'currentPosition' blocks to the right of the left wall of the board. */
    let currentPosition = 4
    /* Indicates the rotation the current tetromino is. */
    let currentRotation = 0
})