// one image particle wandering with Perlin noise + edge-hit sound

let img;                 // 粒子图片
let pos, vel, acc;
let zoff = 0;
const SCALE = 0.0016, TSPEED = 0.00025, MAXS = 2.0, SIZE = 36;

// sound
let hit;                 // 短音效 buffer（优先）
let blipOsc, env;        // 合成器降级
let audioReady = false;

// --- assets ---
function preload() {
  loadImage('libraries/particle.jpg', p => img = p, () => img = null);
  soundFormats('wav','mp3','ogg');
  hit = loadSound('libraries/hit.mp3', () => {}, () => { hit = null; });
}

// --- setup ---
function setup() {
  createCanvas(600, 600);
  imageMode(CENTER); noStroke();
  pos = createVector(random(width), random(height));
  vel = createVector(0, 0);
  acc = createVector(0, 0);

  // 如果没有外部音效，则准备一个“哔”的合成器
  if (!hit) {
    blipOsc = new p5.Oscillator('triangle');
    env = new p5.Envelope();
    env.setADSR(0.001, 0.05, 0.0, 0.05); // 短促
    env.setRange(0.3, 0);                // 音量
    blipOsc.start(); blipOsc.amp(0);     // 先静音
  }
}

// 仅用于解锁音频上下文（视觉仍然非交互）
function mousePressed() {
  if (!audioReady) { userStartAudio(); audioReady = true; }
}

// --- main loop ---
function draw() {
  background(240, 240, 248, 25);

  // 非线性力：Perlin 噪声 -> 角度 -> 力
  const n = noise(pos.x * SCALE, pos.y * SCALE, zoff);
  const angle = n * TAU * 3.0;
  const force = p5.Vector.fromAngle(angle).mult(0.07);
  acc.add(force);

  // 速度/位置
  vel.add(acc).limit(MAXS);
  pos.add(vel);
  acc.set(0, 0);
  vel.mult(0.995);
  zoff += deltaTime * TSPEED;

  // --- 碰撞检测：碰到四边就反弹 + 播放声音 ---
  // 用“是否越界”判断，并在反弹那一刻触发音效；避免在边缘多帧重复触发，
  // 采用“先回到边界内 + 翻转速度”的典型做法。
  let collided = false;

  if (pos.x < 0)  { pos.x = 0;  vel.x *= -1; collided = true; }
  if (pos.x > width) { pos.x = width; vel.x *= -1; collided = true; }
  if (pos.y < 0)  { pos.y = 0;  vel.y *= -1; collided = true; }
  if (pos.y > height) { pos.y = height; vel.y *= -1; collided = true; }

  if (collided && audioReady) triggerHitSound(vel.mag());

  // 绘制粒子（沿速度方向微旋转）
  push();
  translate(pos.x, pos.y);
  rotate(vel.heading());
  if (img) image(img, 0, 0, SIZE * 1.2, SIZE);
  else { fill(80, 150); circle(0, 0, SIZE); }
  pop();
}

// 根据速度大小调一点“音高/音量”，让撞击更有表情
function triggerHitSound(speed) {
  const vol = constrain(map(speed, 0, MAXS, 0.15, 0.5), 0.1, 0.6);

  if (hit) {
    // 播放外部音效；改变速率获得不同的“音高”
    const rate = constrain(map(speed, 0, MAXS, 0.8, 1.4), 0.7, 1.6);
    hit.rate(rate);
    hit.setVolume(vol);
    // 重置到起点再播，避免很短的音效在已播放末尾无声
    hit.stop();
    hit.play();
  } else if (blipOsc && env) {
    // 合成器降级：根据速度调频率
    const freq = map(speed, 0, MAXS, 220, 880);
    blipOsc.freq(freq);
    env.play(blipOsc);
  }
}
