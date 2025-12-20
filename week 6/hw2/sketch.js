let balls = [];
let ripples = [];
let targetsInit = [];
let targetsA = []; // fishing rod
let targetsB = []; // ripples + rod
let targetsC = []; // rod + fish
let state = 0;

function setup() {
  createCanvas(800, 500);
  noStroke();

  // --- create 150 balls ---
  for (let i = 0; i < 150; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(6, 18); // random size
    balls.push(new Ball(x, y, s));
    targetsInit.push({ x: x, y: y });
  }

  // --- Target A: fishing rod shape ---
  // vertical line on left, curved line for rod tip
  for (let i = 0; i < balls.length; i++) {
    let tx, ty;
    if (i < 100) {
      // rod stick
      tx = width / 3;
      ty = map(i, 0, 100, height / 5, height * 0.85);
    } else {
      // rod tip curve
      let t = map(i, 100, 150, 0, PI);
      tx = width / 3 + cos(t) * 80;
      ty = height / 5 + sin(t) * 50;
    }
    targetsA.push({ x: tx, y: ty });
  }

  // --- Target B: add ripples around the tip ---
  // use the same rod targets, then create ripple balls
  for (let i = 0; i < balls.length; i++) {
    targetsB.push({ x: targetsA[i].x, y: targetsA[i].y });
  }
  for (let i = 0; i < 100; i++) {
    let angle = random(TWO_PI);
    let radius = random(40, 140);
    let cx = width / 3 + 100;
    let cy = height / 5 + 80;
    let rx = cx + cos(angle) * radius;
    let ry = cy + sin(angle) * radius;
    ripples.push(new Ball(rx, ry, random(5, 10)));
  }

  // --- Target C: rod + small fish (5 bigger balls) ---
  for (let i = 0; i < balls.length; i++) {
    if (i < 145) {
      // most balls stay in rod position
      targetsC.push({ x: targetsA[i].x, y: targetsA[i].y });
    } else {
      // last 5 balls form fish
      let j = i - 145;
      let fx = width / 3 + 180 + j * 20;
      let fy = height / 5 + 120 + sin(j * 0.5) * 10;
      targetsC.push({ x: fx, y: fy });
    }
  }
}

function draw() {
  background(15, 20, 40);
  fill(200);

  // display and update main balls
  for (let b of balls) {
    b.update();
    b.display();
  }

  // when in ripple state, draw ripples
  if (state === 2) {
    for (let r of ripples) {
      r.display();
    }
  }

  // instruction text
  fill(255);
  textAlign(CENTER);
  textSize(16);
  if (state === 0) text("Click to form a FISHING ROD", width / 2, height - 20);
  else if (state === 1) text("Click to ADD RIPPLES", width / 2, height - 20);
  else if (state === 2) text("Click to FORM a FISH", width / 2, height - 20);
  else if (state === 3) text("Click to RETURN to START", width / 2, height - 20);
}

function mousePressed() {
  if (state === 0) {
    for (let i = 0; i < balls.length; i++) {
      balls[i].setTarget(targetsA[i].x, targetsA[i].y);
    }
    state = 1;
  } else if (state === 1) {
    for (let i = 0; i < balls.length; i++) {
      balls[i].setTarget(targetsB[i].x, targetsB[i].y);
    }
    state = 2;
  } else if (state === 2) {
    for (let i = 0; i < balls.length; i++) {
      balls[i].setTarget(targetsC[i].x, targetsC[i].y);
    }
    state = 3;
  } else if (state === 3) {
    for (let i = 0; i < balls.length; i++) {
      balls[i].setTarget(targetsInit[i].x, targetsInit[i].y);
    }
    ripples = []; // clear ripples
    state = 0;
  }
}

// Ball class
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
