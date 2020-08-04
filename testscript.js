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
})