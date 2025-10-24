let numLines = 10;
let time = 0;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, TWO_PI, 1, 1);
}

function draw() {
    background(TWO_PI * 0.75, 0.2, 0.9); 
    time += 0.02;
    numLines = 5 + Math.sin(time) * 12.5 + 12.5; 
    numLines = floor(numLines);

    push();
    rotate (QUARTER_PI * 0.2);
    drawGrid(numLines);
    pop();
    
    push();
    translate(width * 0.5, height * 0.5);
    rotate(-QUARTER_PI);
    drawGrid(numLines);
    rect(-50, -50, 100, 100);
    pop();
}

function drawGrid(lines) {
    for(let y = 0; y <= lines; y++) {
        line(0, y * height/lines, width, y * height/lines);
    }
    for(let x = 0; x <= lines; x++) {
        line(x * width/lines, 0, x * width/lines, height);
    }

}