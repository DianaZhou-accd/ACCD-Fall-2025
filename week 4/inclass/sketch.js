let posX
let posT

let velX
let velY

let radius = 20;

function setup() {
  createCanvas(600, 600);

  colorMode(HSB, 360, 100, 100);
  posX = width * 0.5;
  posY = height * 0.5;

  velX = -2;
  velY = 3;
}

function draw() {
  posX = posX + velX;
  posY = posY + velY;

  if (posY >= height || posY <= 0) {
    velY = velY * -1;
  }
  if (posX >= width || posX <= 0) {
    velX = velX * -1;
  }


  background(0, 0, 85);
  
  noStroke();
  
  fill(posX, 100, 100);
  
  circle(posX, posY, radius * 2);
  
  stroke(255, 0, 0);
  strokeWeight(4);

  fill(0, 100, 255);

  rect(width * 0.5 - 50, height * 0.5 - 50, 100, 100);
}