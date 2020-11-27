window.addEventListener("load", init);
window.addEventListener("keydown", shooterMoveLeft);
window.addEventListener("keydown", shooterMoveRight);
window.addEventListener("keydown", shoot );


const canvas = document.querySelector("canvas");
canvas.height = 900;
canvas.width = 900;
const ctx = canvas.getContext("2d");

let grid = {};
const gap = 1;
const pixel =10;
const actPixel = pixel - gap;
const columns = canvas.width/pixel;
const rows = canvas.height/pixel;
const baseColor = "black";

// Set up the properties of the base grid
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
}

// Function that iterates over the grid and draws
grid.draw = function() {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            ctx.fillStyle = this[`row${row}`][`column${column}`].color;
            ctx.fillRect(this[`row${row}`][`column${column}`].left + gap, 
            this[`row${row}`][`column${column}`].top + gap, actPixel, actPixel);
        }
    }
}
function init() {
    canvas.height = 900;
    canvas.width = 900;

    // Create and draw initial blank grid
    baseGrid();
    grid.draw();

    // Impose shooter on base grid and redraw grid
    shooter.impose();
    grid.draw();
}

function Shooter(leftColumn, topRow, shooterColumns, rows, color, grid) {
    this.x = leftColumn,
    this.y = topRow,
    this.columns = shooterColumns,
    this.rows = rows, 
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

function Shot(shooterX, shooterY, shooterColumns, shotColor, grid) {
    this.x = shooterX,
    this.y =shooterY,
    this.columns = shooterColumns,
    this.shotColor = shotColor,
    this.dy = 1,
    this.bullet = function() {
        grid[`row${this.y - 1}`][`column${this.x + (this.columns-1)/2}`].color = this.shotColor;
    }
    this.update = function() {
        this.bullet();
            
        if (this.y - this.dy > 0) {
            this.y -= this.dy;
        } else {
            shots.splice(shots.indexOf(this), 1);
        }
    }
}


// Initial shooter definition
const shooterCols = 21;
const shooterRows = 10;
const shooterGap = 2;
const shooterColStart = (columns/2) - (shooterCols-1)/2;
const shooterRowStart = (rows - shooterRows - shooterGap); 
const shooterColor = "yellow";
const shooterColStep = 1;
const shotColor = "red";
let shooter = new Shooter(shooterColStart, shooterRowStart, shooterCols, shooterRows, shooterColor, grid);


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
let shots =[];
function shoot(e) {
    if (e.code == "Space") {
        shot = new Shot(shooter.x, shooter.y, shooter.columns, shotColor, grid);
        shot.update();
        shots.push(shot);
    }
}



function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    baseGrid();
    shooter.impose();
    for (let i = 0; i < shots.length ; i++) {
        shots[i].update();
    }
    grid.draw();
}

animate(); 