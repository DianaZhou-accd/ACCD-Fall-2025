let numLines = 10;
let time = 0;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, TWO_PI, 1, 1);
}

function draw() {
  background(TWO_PI * 0.75, 0.2, 0.9);

  time += 0.02;

  // oscillating grid density
  let oscillation = sin(time);
  numLines = 10 + oscillation * 5;
  numLines = floor(numLines);

  // Layer A
  push();
  rotate(QUARTER_PI * 0.2);
  drawGrid(numLines);
  pop();

  // Layer B + Anchor
  push();
  translate(width * 0.5, height * 0.5);
  rotate(-QUARTER_PI);
  drawGrid(numLines);

  // anchor/reference shape
  rectMode(CENTER);
  rect(0, 0, 100, 100);
  pop();
}

function drawGrid(lines) {
  lines = max(1, lines);

  for (let y = 0; y <= lines; y++) {
    line(0, (y * height) / lines, width, (y * height) / lines);
  }
  for (let x = 0; x <= lines; x++) {
    line((x * width) / lines, 0, (x * width) / lines, height);
  }
}
