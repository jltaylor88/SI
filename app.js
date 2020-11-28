window.addEventListener("load", init);
window.addEventListener("keydown", shooterMoveLeft);
window.addEventListener("keydown", shooterMoveRight);
window.addEventListener("keydown", shoot );


const canvas = document.querySelector("canvas");
canvas.height = 800;
canvas.width = 1000;
const ctx = canvas.getContext("2d");

// BASE GRID VARS
let grid = {};
const gap = 0;
const pixel =5;
const actPixel = pixel - gap;
const columns = canvas.width/pixel;
const rows = canvas.height/pixel;
const baseColor = "black";
const SIGreen = "#33ff00";
const SIWhite = "#ffffff";

// ARRAY OF COLLISION OBJECTS
let collisions =[];

// ARRAY OF SHOTS (BULLETS) OBJECTS
let shots =[];

// ARRAY OF INVADER OBJECTS
let invaders = [];

// SHIELD VARS
const shieldColor = SIGreen;
// Even width
const shieldWidth = 22;
// Even height
const shieldHeight = 18;

// Shield bottom
const bottomGap = 30;
const shieldBottom = rows - bottomGap;

// Shield Lefts
const shieldOneLeft = 20;
const shieldTwoLeft = shieldOneLeft + shieldWidth + 24;
const shieldThreeLeft = shieldTwoLeft + shieldWidth + 24;
const shieldFourLeft = shieldThreeLeft + shieldWidth + 24;

// SETUP OF BASE GRID
function baseGrid() {
    for (let row = 0; row < rows ; row++ ) {
        grid[`row${row}`] = {};
        for (let column = 0; column < columns; column++) {
            grid[`row${row}`][`column${column}`] = {
                color: baseColor,
                top: row*pixel,
                left: column*pixel,
            };
        }
    }

    // IMPOSE SHIELDS
    shield(shieldOneLeft, shieldBottom);
    shield(shieldTwoLeft, shieldBottom);
    shield(shieldThreeLeft, shieldBottom);
    shield(shieldFourLeft, shieldBottom);

}

// FUNCTION THAT DRAWS THE GRID
grid.draw = function() {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            ctx.fillStyle = this[`row${row}`][`column${column}`].color;
            ctx.fillRect(this[`row${row}`][`column${column}`].left + gap, 
            this[`row${row}`][`column${column}`].top + gap, actPixel, actPixel);
        }
    }
}

// INITIALISE CANVAS SETUP WITH BASE GRID AND SHOOTER
function init() {
    canvas.height = 800;
    canvas.width = 1000;

    // Create and draw initial blank grid
    baseGrid();
   

    // Impose shooter on base grid and redraw grid
    shooter.impose();
    grid.draw();
}


// Initial shooter definition
// ODD NUMBER
const shooterCols = 15;
const shooterRows = 4;
const shooterGap = 2;
const shooterColStart = (columns/2) - (shooterCols-1)/2 + 1;
const shooterRowStart = (rows - shooterRows - shooterGap); 
const shooterColor = SIGreen;
const shooterColStep = 4;
const shotColor = SIWhite;
let shooter = new Shooter(shooterColStart, shooterRowStart, shooterCols, shooterRows, shooterColor, grid);



// CREATE INVADERS AND PUSH TO ARRAY
let squids = [];
let squid = new Squid(20, 20);
squids.push(squid);

let crabs = [];
let crab = new Crab(20, 40);
crabs.push(crab);

let octopi = [];
let octopus = new Octopus(20, 60);
octopi.push(octopus);

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    baseGrid();
    shooter.impose();
    for (let i = 0; i < collisions.length; i++) {
        collisions[i].impose(); 
    }
    for (let i = 0; i < shots.length ; i++) {
        shots[i].update();
    }
    for (let i = 0; i < squids.length; i++) {
        squids[i].impose();
    }
    for (let i = 0; i < crabs.length ; i++) {
        crabs[i].impose();
    }
    for (let i = 0; i < octopi.length; i++) {
        octopi[i].impose();
    }
    
    grid.draw();
}

animate(); 

//////////////////0BJECT AND FUNCTION DEFINITIONS/////////////////////////

// SHOOTER OBJECT 
function Shooter(leftColumn, topRow, shooterColumns, shooterRows, color, grid) {
    this.x = leftColumn,
    this.y = topRow,
    this.columns = shooterColumns,
    this.rows = shooterRows, 
    this.color = color,
    this.dx = shooterColStep,
    this.impose = function() {
        // Base rectangle of shooter
        for (let row = this.y; row < this.y + this.rows; row++) {
            for (let column = this.x; column < this.x + this.columns ; column++) {
                grid[`row${row}`][`column${column}`].color = this.color;
            }
        }
        // Middle row of shooter
        for (let column = this.x + 1 ; column < this.x + this.columns-1; column++) {
            grid[`row${this.y - 1}`][`column${column}`].color = this.color;
        }
        // Wide middle aperture
        grid[`row${this.y - 2}`][`column${this.x + (this.columns-1)/2 - 1}`].color = this.color;
        grid[`row${this.y - 2}`][`column${this.x + (this.columns-1)/2}`].color = this.color;
        grid[`row${this.y - 2}`][`column${this.x + (this.columns-1)/2 + 1}`].color = this.color;
        grid[`row${this.y - 3}`][`column${this.x + (this.columns-1)/2 - 1}`].color = this.color;
        grid[`row${this.y - 3}`][`column${this.x + (this.columns-1)/2}`].color = this.color;
        grid[`row${this.y - 3}`][`column${this.x + (this.columns-1)/2 + 1}`].color = this.color;

        // Aperture
        grid[`row${this.y - 4}`][`column${this.x + (this.columns-1)/2}`].color = this.color;


    }

    this.moveLeft = function() {
        if (this.x - this.dx > 0) {
            this.x -= this.dx;
        } else {
            this.x = 0;
        }
    }

    this.moveRight = function() {
        if (this.x + this.dx < columns - this.columns) {
            this.x += this.dx;
        } else {
            this.x = columns - this.columns;
        }
    }

}

// SHOT OBJECT
function Shot(shooterX, shooterY, shooterColumns, shotColor, grid) {
    this.x = shooterX + (shooterColumns-1)/2,
    this.y =shooterY,
    this.columns = shooterColumns,
    this.shotColor = shotColor,
    this.dy = 5,
    this.bullet = function() {
        grid[`row${this.y}`][`column${this.x}`].color = this.shotColor;
    }
    this.update = function() {
        this.bullet();

        // Check to see if next pixel up contains a shield
        if (grid[`row${this.y - this.dy}`][`column${this.x}`].color == SIGreen) {
            collision = new Collision(this.x, this.y, grid);
            collisions.push(collision);
            shots.splice(shots.indexOf(this), 1); 
        } else {
            if (this.y - this.dy > 0) {
                this.y -= this.dy;
            } else if(this.y - this.dy <= 0) {
                shots.splice(shots.indexOf(this), 1);
            } 
        }
    }
}

// COLLISION OBJECT
function Collision(x, y, grid) {
    this.impose = function() {
        for (let row =1; row < 6; row++) {
            for (let column = -2; column < 3; column++) {
                grid[`row${y-row}`][`column${x + column}`].color = baseColor;
            }
        }
    }
    
}

// INVADER OBJECT
function Invader() {
    this.impose = function() {
        for (let row = 10; row < 20; row++) {
            for (let column = 20; column < 40; column++) {
                grid[`row${row}`][`column${column}`].color = SIWhite;
            }
        }
    }
}

// SHOOTER MOVEMENT FUNCTIONS 
function shooterMoveLeft(e) {
    if (e.key == "ArrowLeft") {
        shooter.moveLeft();
        shooter.impose();
    }
}

function shooterMoveRight(e) {
    if (e.key == "ArrowRight") {
        shooter.moveRight();
        shooter.impose();
    }
}

function shoot(e) {
    if (e.code == "Space") {
        shot = new Shot(shooter.x , shooter.y-4, shooter.columns, shotColor, grid);
        shot.update();
        shots.push(shot);
    }
}


//SHIELDS
// x, y represent the bottom left of each shield 
function shield(x, y) {
    // Left column (leave three pixels at top)
    for (let row = y; row > y - shieldHeight + 3; row--) {
        for (let column =x; column < x + shieldWidth/4; column++) {
            grid[`row${row}`][`column${column}`].color = shieldColor;
        }
    }

    // Top left step
    grid[`row${y - shieldHeight + 3}`][`column${x + 1}`].color = shieldColor;
    grid[`row${y - shieldHeight + 3}`][`column${x + 2}`].color = shieldColor;
    grid[`row${y - shieldHeight + 3}`][`column${x + 3}`].color = shieldColor;
    grid[`row${y - shieldHeight + 3}`][`column${x + 4}`].color = shieldColor;
    grid[`row${y - shieldHeight + 3}`][`column${x + 5}`].color = shieldColor;

    grid[`row${y - shieldHeight + 2}`][`column${x + 2}`].color = shieldColor;
    grid[`row${y - shieldHeight + 2}`][`column${x + 3}`].color = shieldColor;
    grid[`row${y - shieldHeight + 2}`][`column${x + 4}`].color = shieldColor;
    grid[`row${y - shieldHeight + 2}`][`column${x + 5}`].color = shieldColor;

    grid[`row${y - shieldHeight + 1}`][`column${x +3}`].color = shieldColor;
    grid[`row${y - shieldHeight + 1}`][`column${x +4}`].color = shieldColor;
    grid[`row${y - shieldHeight + 1}`][`column${x +5}`].color = shieldColor;

    // Top middle column
    for (let row  = y - shieldHeight/2-1; row > y - shieldHeight; row--) {
        for (let column = x + 6 ; column < x + shieldWidth - 5; column++) {
            grid[`row${row}`][`column${column}`].color = shieldColor;
        }
    }

    // Right column (leave three pixels at top)
    for (let row = y; row > y - shieldHeight + 3; row--) {
        for (let column = x + shieldWidth - 5; column < x + shieldWidth-5 +shieldWidth/4; column++) {
            grid[`row${row}`][`column${column}`].color = shieldColor;
        }
    }

    // Top right step
    grid[`row${y - shieldHeight + 3}`][`column${x + shieldWidth - 1}`].color = shieldColor;
    grid[`row${y - shieldHeight + 3}`][`column${x + shieldWidth - 2}`].color = shieldColor;
    grid[`row${y - shieldHeight + 3}`][`column${x + shieldWidth - 3}`].color = shieldColor;
    grid[`row${y - shieldHeight + 3}`][`column${x + shieldWidth - 4}`].color = shieldColor;
    grid[`row${y - shieldHeight + 3}`][`column${x + shieldWidth - 5}`].color = shieldColor;

    grid[`row${y - shieldHeight + 2}`][`column${x + shieldWidth - 2}`].color = shieldColor;
    grid[`row${y - shieldHeight + 2}`][`column${x + shieldWidth - 3}`].color = shieldColor;
    grid[`row${y - shieldHeight + 2}`][`column${x + shieldWidth - 4}`].color = shieldColor;
    grid[`row${y - shieldHeight + 2}`][`column${x + shieldWidth - 5}`].color = shieldColor;

    grid[`row${y - shieldHeight + 1}`][`column${x + shieldWidth - 3}`].color = shieldColor;
    grid[`row${y - shieldHeight + 1}`][`column${x + shieldWidth - 4}`].color = shieldColor;
    grid[`row${y - shieldHeight + 1}`][`column${x + shieldWidth - 5}`].color = shieldColor;


    // Inside left diagonal
    grid[`row${y - shieldHeight/2}`][`column${x + shieldWidth/2 - 2}`].color = shieldColor;
    grid[`row${y - shieldHeight/2}`][`column${x + shieldWidth/2 - 3}`].color = shieldColor;
    grid[`row${y - shieldHeight/2}`][`column${x + shieldWidth/2 - 4}`].color = shieldColor;
    grid[`row${y - shieldHeight/2}`][`column${x + shieldWidth/2 - 5}`].color = shieldColor;
    grid[`row${y - shieldHeight/2}`][`column${x + shieldWidth/2 + 2}`].color = shieldColor;
    grid[`row${y - shieldHeight/2}`][`column${x + shieldWidth/2 + 3}`].color = shieldColor;
    grid[`row${y - shieldHeight/2}`][`column${x + shieldWidth/2 + 4}`].color = shieldColor;
    grid[`row${y - shieldHeight/2}`][`column${x + shieldWidth/2 + 5}`].color = shieldColor;

    ;
    grid[`row${y - shieldHeight/2 + 1}`][`column${x + shieldWidth/2 - 3}`].color = shieldColor;
    grid[`row${y - shieldHeight/2 + 1}`][`column${x + shieldWidth/2 - 4}`].color = shieldColor;
    grid[`row${y - shieldHeight/2 + 1}`][`column${x + shieldWidth/2 - 5}`].color = shieldColor;
    grid[`row${y - shieldHeight/2 + 1}`][`column${x + shieldWidth/2 + 3}`].color = shieldColor;
    grid[`row${y - shieldHeight/2 + 1}`][`column${x + shieldWidth/2 + 4}`].color = shieldColor;
    grid[`row${y - shieldHeight/2 + 1}`][`column${x + shieldWidth/2 + 5}`].color = shieldColor;

    
    grid[`row${y - shieldHeight/2 + 2}`][`column${x + shieldWidth/2 - 4}`].color = shieldColor;
    grid[`row${y - shieldHeight/2 + 2}`][`column${x + shieldWidth/2 - 5}`].color = shieldColor;
    grid[`row${y - shieldHeight/2 + 2}`][`column${x + shieldWidth/2 + 4}`].color = shieldColor;
    grid[`row${y - shieldHeight/2 + 2}`][`column${x + shieldWidth/2 + 5}`].color = shieldColor;

    grid[`row${y - shieldHeight/2 + 3}`][`column${x + shieldWidth/2 - 5}`].color = shieldColor;
    grid[`row${y - shieldHeight/2 + 3}`][`column${x + shieldWidth/2 + 5}`].color = shieldColor;    
}


// SQUID
// x, y represents the left pixel of the top middle of each squid
function Squid(x, y) {
    this.x = x,
    this.y = y,
    this.ident = "typeTwo",
    this.count = 0;
    this.typeOne = function() {
        grid[`row${this.y + 1}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y + 1}`][`column${this.x+1 }`].color = SIWhite;

        grid[`row${this.y+2}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+2}`].color = SIWhite;

        grid[`row${this.y + 3}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y + 3}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y + 3}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y + 3}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y + 3}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y + 3}`][`column${this.x+3}`].color = SIWhite;

        grid[`row${this.y + 4}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y + 4}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y + 4}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y + 4}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y + 4}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y + 4}`][`column${this.x+4}`].color = SIWhite;

        grid[`row${this.y + 5}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x+4}`].color = SIWhite;

        
        grid[`row${this.y + 6}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y + 6}`][`column${this.x+2}`].color = SIWhite;

        grid[`row${this.y + 7}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y + 7}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y + 7}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y + 7}`][`column${this.x+3}`].color = SIWhite;

        grid[`row${this.y + 8}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y + 8}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y + 8}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y + 8}`][`column${this.x+4}`].color = SIWhite;
    }

    this.typeTwo = function() {
        grid[`row${this.y + 1}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y + 1}`][`column${this.x+1 }`].color = SIWhite;

        grid[`row${this.y+2}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+2}`].color = SIWhite;

        grid[`row${this.y + 3}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y + 3}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y + 3}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y + 3}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y + 3}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y + 3}`][`column${this.x+3}`].color = SIWhite;

        grid[`row${this.y + 4}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y + 4}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y + 4}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y + 4}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y + 4}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y + 4}`][`column${this.x+4}`].color = SIWhite;

        grid[`row${this.y + 5}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y + 5}`][`column${this.x+4}`].color = SIWhite;

        grid[`row${this.y + 6}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y + 6}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y + 6}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y + 6}`][`column${this.x+3}`].color = SIWhite;

        grid[`row${this.y + 7}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y + 7}`][`column${this.x+4}`].color = SIWhite;
        
        grid[`row${this.y + 8}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y + 8}`][`column${this.x+3}`].color = SIWhite;
    }

    this.impose = function() {
        if (this.count % 10 == 0 && this.count != 0) {
            switch (this.ident) {
                case "typeOne":
                    this.ident = "typeTwo";
                    break;
                case "typeTwo":
                    this.ident = "typeOne";
                    break;
            }
        }
        this[`${this.ident}`]();
        this.count++;
    }
}


// CRAB
// x, y represents the pixel at top middle
function Crab(x,y) {
    this.x = x,
    this.y = y,
    this.ident = "typeOne",
    this.count = 0;
    this.typeOne = function() {        

        grid[`row${this.y-2}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y-2}`][`column${this.x+3}`].color = SIWhite;
        
        grid[`row${this.y-1}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y-1}`][`column${this.x+2}`].color = SIWhite;


        grid[`row${this.y}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x+3}`].color = SIWhite;

        grid[`row${this.y+1}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+4}`].color = SIWhite;

        grid[`row${this.y+2}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+5}`].color = SIWhite;

        grid[`row${this.y+3}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+5}`].color = SIWhite;

        grid[`row${this.y+4}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+5}`].color = SIWhite;

        grid[`row${this.y+5}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x+2}`].color = SIWhite;
    }

    this.typeTwo = function() {
        grid[`row${this.y-2}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y-2}`][`column${this.x+3}`].color = SIWhite;
        
        grid[`row${this.y-1}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y-1}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y-1}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y-1}`][`column${this.x+5}`].color = SIWhite;


        grid[`row${this.y}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x+5}`].color = SIWhite;


        grid[`row${this.y+1}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+5}`].color = SIWhite;

        grid[`row${this.y+2}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+5}`].color = SIWhite;

        grid[`row${this.y+3}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+4}`].color = SIWhite;

     
        grid[`row${this.y+4}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+3}`].color = SIWhite;
    

        grid[`row${this.y+5}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x+4}`].color = SIWhite;
    }

    this.impose = function() {
        if (this.count % 10 == 0 && this.count != 0) {
            switch (this.ident) {
                case "typeOne":
                    this.ident = "typeTwo";
                    break;
                case "typeTwo":
                    this.ident = "typeOne";
                    break;
            }
        }
        this[`${this.ident}`]();
        this.count++;
    }
    
}

// x, y represents the top left-middle pixel
function Octopus(x, y) {
    this.x = x,
    this.y = y,
    this.count = 0,
    this.ident = "typeOne",
    this.typeOne = function() {
        
        grid[`row${this.y}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x+2}`].color = SIWhite;


        grid[`row${this.y+1}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+5}`].color = SIWhite;
  

        grid[`row${this.y+2}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+5}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+6}`].color = SIWhite;

    
        grid[`row${this.y+3}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+5}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+6}`].color = SIWhite;

        grid[`row${this.y+4}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+5}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+6}`].color = SIWhite;

        grid[`row${this.y+5}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x+3}`].color = SIWhite;

        grid[`row${this.y+6}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+6}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+6}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+6}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+6}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+6}`][`column${this.x+4}`].color = SIWhite;

        grid[`row${this.y+7}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+7}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+7}`][`column${this.x+5}`].color = SIWhite;
        grid[`row${this.y+7}`][`column${this.x+6}`].color = SIWhite;
    }
    this.typeTwo = function() {
        grid[`row${this.y}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y}`][`column${this.x+2}`].color = SIWhite;


        grid[`row${this.y+1}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+1}`][`column${this.x+5}`].color = SIWhite;
  

        grid[`row${this.y+2}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+5}`].color = SIWhite;
        grid[`row${this.y+2}`][`column${this.x+6}`].color = SIWhite;

    
        grid[`row${this.y+3}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+5}`].color = SIWhite;
        grid[`row${this.y+3}`][`column${this.x+6}`].color = SIWhite;

        grid[`row${this.y+4}`][`column${this.x-5}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+5}`].color = SIWhite;
        grid[`row${this.y+4}`][`column${this.x+6}`].color = SIWhite;

        grid[`row${this.y+5}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x-1}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x+2}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+5}`][`column${this.x+4}`].color = SIWhite;

        grid[`row${this.y+6}`][`column${this.x-4}`].color = SIWhite;
        grid[`row${this.y+6}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+6}`][`column${this.x}`].color = SIWhite;
        grid[`row${this.y+6}`][`column${this.x+1}`].color = SIWhite;
        grid[`row${this.y+6}`][`column${this.x+4}`].color = SIWhite;
        grid[`row${this.y+6}`][`column${this.x+5}`].color = SIWhite;

        grid[`row${this.y+7}`][`column${this.x-3}`].color = SIWhite;
        grid[`row${this.y+7}`][`column${this.x-2}`].color = SIWhite;
        grid[`row${this.y+7}`][`column${this.x+3}`].color = SIWhite;
        grid[`row${this.y+7}`][`column${this.x+4}`].color = SIWhite;
    }
    this.impose = function() {
        if (this.count % 10 == 0 && this.count != 0) {
            switch (this.ident) {
                case "typeOne":
                    this.ident = "typeTwo";
                    break;
                case "typeTwo":
                    this.ident = "typeOne";
                    break;
            }
        }
        this[`${this.ident}`]();
        this.count++;
    }
}