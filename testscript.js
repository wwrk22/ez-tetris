document.addEventListener("DOMContentLoaded", () => {
    "use strict"

    /* -- Define functions within objects -- */
    const pencil = {

        name: "Won's Pencil",

        draw() {

            console.log("drawing")

        }

    }

    
    /* -- Use class syntax to define a constructor function -- */
    class SpaceShuttle {

        constructor(targetPlanet) {

            this.targetPlanet = targetPlanet
            
            this.draw = () => {
                console.log("drawing")
            }

            this.undraw = () => {
                console.log("undrawing")
            }

        }
    }

    const rover = new SpaceShuttle("Mars")
    console.log(rover.targetPlanet);
    rover.draw()
    rover.undraw()


    /* Use getters and setters to control access to an object */
    class GameInfo {

        constructor(playerName) {

            this._playerName = playerName
            this._gameStarted = false
            this._gameOver = false
            this._score = document.querySelector("#score")
            this._startBtn = document.querySelector("#start-btn")
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

        get score() {
            return this._score
        }

        get startBtn() {
            return this._startBtn
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
})