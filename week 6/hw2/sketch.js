/* global createCanvas, random, map, sin, PI, TWO_PI, width, height, lerp, background, fill, circle, text, textAlign, textSize, noStroke, constrain, stroke, strokeWeight, line */

let rodBalls = [];     // 30 particles for the fishing rod
let fishBalls = [];    // 5 particles for the fish (separate system)

let initTargets = [];
let rodTargets = [];
let fishTargets = [];

let rodEnd = { x: 0, y: 0 }; // end point of the rod (former bending point)

let state = 0;         // 0 init, 1 rod, 2 rod + fish + line

function setup() {
  let c = createCanvas(800, 500);
  c.parent("container");

  noStroke();
  textAlign(CENTER);
  textSize(16);

  // Create 30 rod particles
  // ---------------------------------
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = random(height);

    // fixed size: thicker bottom -> thinner top
    let t = i / 29;
    let s = lerp(18, 6, t) + random(-1, 1);
    s = constrain(s, 4, 20);

    rodBalls.push(new Ball(x, y, s));
    initTargets.push({ x, y });
  }

  // ---------------------------------
  // Create 5 fish particles (largest -> smallest)
  // ---------------------------------
  for (let i = 0; i < 5; i++) {
    let s = lerp(18, 6, i / 4);
    fishBalls.push(new Ball(-999, -999, s)); // hidden at start
  }

  buildRodTargets();
  buildFishTargets();
}

function draw() {
  background(15, 20, 40);

  // draw rod
  for (let b of rodBalls) {
    b.update();
    b.display();
  }

  // draw fish + line only in state 2
  if (state === 2) {
    drawFishingLine(rodEnd.x, rodEnd.y, fishBalls[0].x, fishBalls[0].y);

    for (let f of fishBalls) {
      f.update();
      f.display();
    }
  }

  // UI text
  fill(255);
  if (state === 0) text("Click to FORM a FISHING ROD", width / 2, height - 20);
  else if (state === 1) text("Click to FORM a FISH", width / 2, height - 20);
  else if (state === 2) text("Click to RETURN to START", width / 2, height - 20);
}

function mousePressed() {
  if (state === 0) {
    // init -> rod
    for (let i = 0; i < rodBalls.length; i++) {
      rodBalls[i].setTarget(rodTargets[i].x, rodTargets[i].y);
    }
    state = 1;

  } else if (state === 1) {
    // rod -> rod + fish
    for (let i = 0; i < fishBalls.length; i++) {
      fishBalls[i].setTarget(fishTargets[i].x, fishTargets[i].y);
    }
    state = 2;

  } else if (state === 2) {
    // back to init
    for (let i = 0; i < rodBalls.length; i++) {
      rodBalls[i].setTarget(initTargets[i].x, initTargets[i].y);
    }
    for (let i = 0; i < fishBalls.length; i++) {
      fishBalls[i].setTarget(-999, -999);
    }
    state = 0;
  }
}

// =====================================================
// TARGET BUILDERS
// =====================================================

function buildRodTargets() {
  rodTargets = [];

  // fishing rod: straight body ending at the bend point
  let baseX = width * 0.28;
  let baseY = height * 0.86;

  let endX = width * 0.42;
  let endY = height * 0.32;

  for (let i = 0; i < rodBalls.length; i++) {
    let t = i / (rodBalls.length - 1);

    let x = lerp(baseX, endX, t);
    let y = lerp(baseY, endY, t);

    // subtle organic wobble
    x += sin(t * PI) * 4;

    rodTargets.push({ x, y });

    // save the last point as rod end
    if (i === rodBalls.length - 1) {
      rodEnd.x = x;
      rodEnd.y = y;
    }
  }
}

function buildFishTargets() {
  fishTargets = [];

  let startX = width * 0.62;
  let y = height * 0.45;
  let spacing = 26;

  for (let i = 0; i < fishBalls.length; i++) {
    fishTargets.push({
      x: startX + i * spacing,
      y: y + sin(i * 0.8) * 8
    });
  }
}

// =====================================================
// RELATIONSHIP VISUAL: fishing line
// =====================================================

function drawFishingLine(x1, y1, x2, y2) {
  let segments = 20;
  let sag = 20;

  stroke(220, 220, 255, 140);
  strokeWeight(1);

  let px = x1;
  let py = y1;

  for (let i = 1; i <= segments; i++) {
    let t = i / segments;

    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);

    y += sin(t * PI) * sag;
    y += sin(t * TWO_PI * 2) * 3;

    line(px, py, x, y);
    px = x;
    py = y;
  }

  noStroke();
}

// =====================================================
// CLASS
// =====================================================

class Ball {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.tx = x;
    this.ty = y;
  }

  setTarget(tx, ty) {
    this.tx = tx;
    this.ty = ty;
  }

  update() {
    this.x = lerp(this.x, this.tx, 0.07);
    this.y = lerp(this.y, this.ty, 0.07);
  }

  display() {
    fill(100, 180, 255, 200);
    circle(this.x, this.y, this.s);
  }
}
