const canvas = document.querySelector("canvas");
canvas.width = 960;
canvas.height = 800;

const ctx = canvas.getContext("2d");

const pixel = 10;
const pixelGap = 1;
const totalRows = canvas.height / pixel;
const totalColumns = canvas.width / pixel;
const background = "black";

let grid = {};
for (let i = 0; i < totalRows; i++) {
    grid[`row${i}`] = {
        rowTop: i * pixel,
        columns: {}
    };
    for (let j = 0; j < totalColumns; j++){
        grid[`row${i}`].columns[`column${j}`] = {
            columnLeft: j * pixel,
            color: background
        };
    }
}

grid.draw = function() {
    for (let i = 0; i < totalRows; i++ ){
        const top = grid[`row${i}`].rowTop;
        for (let j = 0; j < totalColumns; j++) {
            const left = grid[`row${i}`].columns[`column${j}`].columnLeft;
            const fill = grid[`row${i}`].columns[`column${j}`].color;
            ctx.fillStyle = fill;
            ctx.fillRect(left, top, pixel-pixelGap, pixel-pixelGap);
        }
    }
}
grid.clear = function() {
    for (let i = 0; i < totalRows; i++) {
        for (let j = 0; j < totalColumns ; j++ ) {
            grid[`row${i}`].columns[`column${j}`].color = background;
        }
    }
}
let shooterLeft = 45;
const shooterWidth = 10;
const shooterTop = totalRows - 10;
const shooterBottom = totalRows - 1;
function Shooter(left, width, top, bottom) {
    this.left = left;
    this.width = width;
    this.dx = 2;
    this.draw = function() {
        for (let i = top; i < bottom ; i++ ){
            for (let j = this.left; j < this.left + this.width; j++ ){
            grid[`row${i}`].columns[`column${j}`].color = "green";
            }
        }
    }
    this.moveLeft = function() {
        if (this.left - this.dx <= 0) {
            this.left = 0;
        } else {
            this.left -= this.dx;
        }
        shooterLeft = this.left;
    }
    this.moveRight = function() {
        if (this.left + this.width + this.dx >= totalColumns) {
            this.left = totalColumns - this.width;
        } else {
            this.left += this.dx;
        }
        shooterLeft = this.left;
    }    
};

function Shot(x, y) {
    this.left = x + 4;
    this.top = y - 1 ;
    this.count = 0;
    this.shoot = function() {
        grid[`row${this.top}`].columns[`column${this.left}`].color = "green";
    }
    this.update = function() {
        this.shoot();
        if (this.count % 2 == 0 && this.count != 0 && this.top - 1 >= 0) {
            this.top -= 1; 
        } else if (this.count % 2 == 0 && this.count != 0 && this.top - 1 < 0) {
            shots.splice(shots.indexOf(this), 1);
        }
        this.count++;
    }
}
shooter = new Shooter(shooterLeft, shooterWidth, shooterTop, shooterBottom);
shots = [];

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.clear();
    shooter.draw();
    for (let i = 0; i < shots.length; i++) {
        shots[i].update();
    }
    grid.draw();

}


function shooterMove(e) {
    if (e.key == "ArrowLeft") {
        shooter.moveLeft();
    } else if (e.key == "ArrowRight") {
        shooter.moveRight();
    }
}
function newShot(e) {
    if (e.code == "Space") {
        shots.push(new Shot(shooterLeft, shooterTop));
    }
}
window.addEventListener("keydown", shooterMove);
window.addEventListener("keydown", newShot);
window.addEventListener("load", animate);
