import processing.sound.*;
import processing.serial.*;

SoundFile s1;
SoundFile s2;
SoundFile s3;
SoundFile s4;

Serial connection;

// one-shot flags to prevent repeat while holding button
boolean[] flags = { true, true, true, true };

// butterfly system state
ArrayList<Butterfly> butterflies = new ArrayList<Butterfly>();
float butterflyScale = 1.0;
float butterflySpeed = 1.0;

void setup() {
  size(900, 500);
  smooth();

  // replace these with your own audio later
  s1 = new SoundFile(this, "HANDCLP2.WAV");
  s2 = new SoundFile(this, "HTADA.WAV");
  s3 = new SoundFile(this, "STAT0S0.WAV");
  s4 = new SoundFile(this, "HT7D3.WAV");

  printArray(Serial.list());
  connection = new Serial(this, "COM3", 115200);
  connection.bufferUntil('\n');
}

void draw() {
  background(15);

  // simple HUD so teacher can see parameters
  fill(255);
  text("BTN1 spawn | BTN2 size+ | BTN3 speed+ | BTN4 reset", 20, 25);
  text("Scale: " + nf(butterflyScale, 1, 2) + "   Speed: " + nf(butterflySpeed, 1, 2)
    + "   Butterflies: " + butterflies.size(), 20, 45);

  // update & draw butterflies
  for (int i = butterflies.size() - 1; i >= 0; i--) {
    Butterfly b = butterflies.get(i);
    b.update(butterflySpeed);
    b.display(butterflyScale);
    if (b.isDead()) butterflies.remove(i);
  }
}

void serialEvent(Serial conn) {
  String incoming = conn.readString();
  if (incoming == null) return;

  String[] values = split(trim(incoming), ',');
  if (values.length != 4) return;

  int b1 = int(values[0]); // 1 pressed
  int b2 = int(values[1]);
  int b3 = int(values[2]);
  int b4 = int(values[3]);

  // BTN1: spawn butterfly + sound 1
  if (b1 == 1) {
    if (flags[0]) {
      playOnce(s1);
      spawnButterfly();
      flags[0] = false;
    }
  } else {
    flags[0] = true;
  }

  // BTN2: size up + sound 2
  if (b2 == 1) {
    if (flags[1]) {
      playOnce(s2);
      butterflyScale += 0.2;
      butterflyScale = constrain(butterflyScale, 0.4, 2.5);
      flags[1] = false;
    }
  } else {
    flags[1] = true;
  }

  // BTN3: speed up + sound 3
  if (b3 == 1) {
    if (flags[2]) {
      playOnce(s3);
      butterflySpeed += 0.15;
      butterflySpeed = constrain(butterflySpeed, 0.3, 3.0);
      flags[2] = false;
    }
  } else {
    flags[2] = true;
  }

  // BTN4: reset + sound 4
  if (b4 == 1) {
    if (flags[3]) {
      playOnce(s4);
      butterflies.clear();
      butterflyScale = 1.0;
      butterflySpeed = 1.0;
      flags[3] = false;
    }
  } else {
    flags[3] = true;
  }
}

// ---------------- helpers ----------------
void playOnce(SoundFile sf) {
  // For one-shot drum samples, it's OK to retrigger quickly:
  // stop() then play() makes it feel responsive.
  if (sf.isPlaying()) sf.stop();
  sf.play();
}

void spawnButterfly() {
  float x = random(width * 0.25, width * 0.75);
  float y = random(height * 0.65, height * 0.9);
  butterflies.add(new Butterfly(x, y));
}

// ---------------- Butterfly class ----------------
class Butterfly {
  PVector pos;
  PVector vel;
  float life;     // frames
  float seed;     // for wing motion variation
  float baseSize;

  Butterfly(float x, float y) {
    pos = new PVector(x, y);
    vel = new PVector(random(-0.6, 0.6), random(-1.8, -0.8));
    life = 480; // ~8 sec @60fps
    seed = random(1000);
    baseSize = random(35, 60);
  }

  void update(float globalSpeed) {
    seed += 0.02;

    // gentle drifting
    float driftX = (noise(seed) - 0.5) * 0.9;
    vel.x = lerp(vel.x, driftX, 0.05);

    pos.add(PVector.mult(vel, globalSpeed));

    life -= 1;
  }

  void display(float globalScale) {
    pushMatrix();
    translate(pos.x, pos.y);
  
    float s = (baseSize / 55.0) * globalScale;
    scale(s);
  
    float a = map(life, 0, 480, 0, 255);
    a = constrain(a, 0, 255);
  
    // silhouette color
    fill(255, a);
    noStroke();
  
    // ---------- LEFT WING (static) ----------
    beginShape();
    vertex(0, 0);
    bezierVertex(-22, -38, -80, -30, -72, 12);
    bezierVertex(-70, 48, -26, 58, -12, 24);
    bezierVertex(-6, 12, -3, 6, 0, 0);
    endShape(CLOSE);
  
    // hind wing
    beginShape();
    vertex(0, 14);
    bezierVertex(-18, 20, -42, 48, -20, 58);
    bezierVertex(-6, 60, -2, 34, 0, 22);
    endShape(CLOSE);
  
    // ---------- RIGHT WING (mirror) ----------
    pushMatrix();
    scale(-1, 1);
  
    beginShape();
    vertex(0, 0);
    bezierVertex(-22, -38, -80, -30, -72, 12);
    bezierVertex(-70, 48, -26, 58, -12, 24);
    bezierVertex(-6, 12, -3, 6, 0, 0);
    endShape(CLOSE);
  
    beginShape();
    vertex(0, 14);
    bezierVertex(-18, 20, -42, 48, -20, 58);
    bezierVertex(-6, 60, -2, 34, 0, 22);
    endShape(CLOSE);
  
    popMatrix();
  
    // ---------- BODY ----------
    rectMode(CENTER);
    rect(0, 12, 6, 38, 6);
    ellipse(0, -10, 10, 10);
  
    // ---------- ANTENNAE ----------
    stroke(0, a);
    strokeWeight(3);
    noFill();
    bezier(0, -14, -6, -26, -18, -32, -14, -44);
    bezier(0, -14,  6, -26,  18, -32,  14, -44);
    noStroke();
  
    popMatrix();
  }



  boolean isDead() {
    return life <= 0 || pos.y < -80 || pos.x < -80 || pos.x > width + 80;
  }
}
