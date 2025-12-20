class Particle {
  constructor(_x, _y) {
    this.pos = createVector(_x, _y);
    this.vel = createVector(random(-3, 3), random(-4, 4));
    this.acc = createVector(0, 0);

    this.radius = random(2, 4);
    this.clr = color(random(TWO_PI), 0.9, 0.9);
  }

  applyForce(_force) {
    this.acc.add(_force);
  }

  move() {
    this.vel.add(this.acc);
    this.vel.limit(4);
    this.pos.add(this.vel);

    // IMPORTANT: clear acceleration each frame
    this.acc.mult(0);
  }

  inBounds() {
    if (
      this.pos.x + this.radius < 0 ||
      this.pos.x - this.radius > width ||
      this.pos.y - this.radius > height ||
      this.pos.y + this.radius < 0
    ) {
      return false;
    }
    return true;
  }

  display() {
    noStroke();
    fill(this.clr);
    circle(this.pos.x, this.pos.y, this.radius * 2);
  }
}
