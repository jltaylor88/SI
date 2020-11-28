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

// ARRAY OF COLLISION OBJECTS
let collisions =[];

// ARRAY OF SHOTS (BULLETS) OBJECTS
let shots =[];

// ARRAY OF INVADER OBJECTS
let invaders = [];

// SHIELD VARS
const shieldColor = "yellow";
// Even width
const shieldWidth = 16;
// Even height
const shieldHeight = 10;
const shieldTop = 25;

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

    // Shield One
    for (let row = rows- shieldTop; row < rows-shieldTop + shieldHeight; row++) {
        for (let column = 5; column < 5 +shieldWidth; column++) {
            grid[`row${row}`][`column${column}`].color = shieldColor;
        }
    }

    // Shield Two
    for (let row = rows- shieldTop; row < rows-shieldTop + shieldHeight; row++) {
        for (let column = 30; column < 30 +shieldWidth; column++) {
            grid[`row${row}`][`column${column}`].color = shieldColor;
        }
    }

    // Shield Three
    for (let row = rows- shieldTop; row < rows-shieldTop + shieldHeight; row++) {
        for (let column = 55; column < 55 +shieldWidth; column++) {
            grid[`row${row}`][`column${column}`].color = shieldColor;
        }
    }

    // Shield Four
    for (let row = rows- shieldTop; row < rows-shieldTop + shieldHeight; row++) {
        for (let column = 80; column < 80 +shieldWidth; column++) {
            grid[`row${row}`][`column${column}`].color = shieldColor;
        }
    }
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
    grid.draw();

    // Impose shooter on base grid and redraw grid
    shooter.impose();
    grid.draw();
}


// Initial shooter definition
const shooterCols = 11;
const shooterRows = 5;
const shooterGap = 2;
const shooterColStart = (columns/2) - (shooterCols-1)/2;
const shooterRowStart = (rows - shooterRows - shooterGap); 
const shooterColor = "yellow";
const shooterColStep = 1;
const shotColor = "red";
let shooter = new Shooter(shooterColStart, shooterRowStart, shooterCols, shooterRows, shooterColor, grid);



// CREATE INVADERS AND PUSH TO ARRAY
let invader = new Invader();
invaders.push(invader);

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
    for (let i = 0; i < invaders.length; i++) {
        invaders[i].impose();
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
        for (let row = this.y; row < this.y + this.rows; row++) {
            for (let column = this.x; column < this.x + this.columns ; column++) {
                grid[`row${row}`][`column${column}`].color = this.color;
            }
        }
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
    this.dy = 1,
    this.bullet = function() {
        grid[`row${this.y}`][`column${this.x}`].color = this.shotColor;
    }
    this.update = function() {
        this.bullet();

        // Check to see if next pixel up contains a shield
        if (grid[`row${this.y - this.dy}`][`column${this.x}`].color == "yellow") {
            collision = new Collision(this.x, this.y, grid);
            collisions.push(collision);
            shots.splice(shots.indexOf(this)); 
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
                grid[`row${row}`][`column${column}`].color = "white";
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
        shot = new Shot(shooter.x, shooter.y, shooter.columns, shotColor, grid);
        shot.update();
        shots.push(shot);
    }
}
