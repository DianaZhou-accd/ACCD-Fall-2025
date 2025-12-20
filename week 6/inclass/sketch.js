let particles = [];
let PPF = 10;
let gravity;

function setup() {
  createCanvas(400, 600);
  colorMode(HSB, TWO_PI, 1, 1);
  gravity = createVector(0, 0.18);
}

function draw() {
  background(0);

  for (let i = 0; i < PPF; i++) {
    particles.push(new Particle(random(width), 0));
  }

  // iterate backwards so splice won't break indexing
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    p.applyForce(gravity);
    p.move();
    p.display();

    if (!p.inBounds()) {
      particles.splice(i, 1);
    }
  }
}
