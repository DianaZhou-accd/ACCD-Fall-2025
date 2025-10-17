// Non-interactive, non-linear motion using Perlin-noise flow field
// Adds image sprite + optional ambience sound (click once to enable due to browser policy)

let motes = [];
const COUNT = 160;

let fieldScale = 0.0016;
let timeScale  = 0.00025;
let zoff = 0;

let imgSprite;
let gfxFallback;
let ambience;
let filt, revb;
let soundReady = false;


function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100);
  noStroke();

  // 生成一个柔光贴图作为后备
  gfxFallback = createGraphics(64, 64);
  gfxFallback.clear();
  gfxFallback.noStroke();
  for (let r=30; r>0; r--) {
    const a = map(r, 30, 0, 16, 255);
    gfxFallback.fill(200, 80, 100, a);
    gfxFallback.circle(32, 32, r*2);
  }

  // 创建粒子
  for (let i=0; i<COUNT; i++) {
    motes.push(new Mote(random(width), random(height)));
  }

  // 声音链路（有文件则播放文件；无则合成器降级）
  filt = new p5.LowPass();
  revb = new p5.Reverb();
  if (!ambience) {
    ambience = new p5.Oscillator('sine');
    ambience.disconnect(); ambience.connect(filt);
    revb.process(filt, 3, 2);
  } else {
    ambience.disconnect(); ambience.connect(filt);
    revb.process(filt, 3, 2);
  }
}

function draw() {
  // 半透明清屏，形成拖影
  background(230, 10, 95, 8);

  // 噪声 z 维推进（非线性场随时间演化）
  zoff += deltaTime * timeScale;

  // 更新与绘制
  let avgSpeed = 0;
  for (const m of motes) {
    m.followField();
    m.update();
    m.wrap();
    m.draw();
    avgSpeed += m.vel.mag();
  }
  avgSpeed /= motes.length;

  // 声音参数随“平均速度”变化（更快→更明亮）
  if (soundReady) {
    const cutoff = constrain(map(avgSpeed, 0.2, 2.0, 300, 6000), 200, 8000);
    filt.freq(cutoff, 0.15);
    if (ambience.type && ambience.type()==='sine') {
      const n = noise(frameCount*0.002);
      ambience.freq(map(n,0,1,140,320));
    }
  }

  // 中心静态“地标”，强调“非交互、轨迹弯曲穿梭”
  push();
  stroke(0, 0, 100, 70); strokeWeight(2); noFill();
  rectMode(CENTER);
  rect(width*0.5, height*0.5, 120, 120, 12);
  pop();
}

// 仅用于解锁音频设备；运动逻辑不依赖交互
function mousePressed(){
  if (!soundReady) {
    userStartAudio();
    if (ambience.type && ambience.type()==='sine') {
      ambience.start(); ambience.amp(0.05, 1.5);
    } else {
      ambience.loop(); ambience.setVolume(0.35, 1.5);
    }
    soundReady = true;
  }
}

class Mote {
  constructor(x,y){
    this.pos = createVector(x,y);
    this.vel = p5.Vector.random2D().mult(random(0.2,1.0));
    this.acc = createVector(0,0);
    this.size = random(10,24);
    this.hue  = random([190, 205, 220, 235]);
    this.alpha= random(140, 220);
    this.bias = random(-0.6, 0.6);   // 个体微偏置
  }

  followField(){
    // 非线性：用 Perlin 噪声生成角度；乘以 3 圈提升曲折度
    const n = noise(this.pos.x*fieldScale, this.pos.y*fieldScale, zoff);
    const angle = n*TAU*3.0 + this.bias;
    const force = p5.Vector.fromAngle(angle).mult(0.07);
    this.acc.add(force);
    // 轻微随机扰动，保持有机但不抖
    this.acc.add(p5.Vector.random2D().mult(0.02));
  }

  update(){
    this.vel.add(this.acc);
    this.vel.limit(2.2);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.mult(0.995);
  }

  wrap(){
    // 环面包裹，持续流动无碰撞
    if (this.pos.x < -20) this.pos.x = width+20;
    if (this.pos.x > width+20) this.pos.x = -20;
    if (this.pos.y < -20) this.pos.y = height+20;
    if (this.pos.y > height+20) this.pos.y = -20;
  }

  draw(){
    push();
    translate(this.pos.x, this.pos.y);
    const a = this.alpha + 30 * sin(frameCount*0.01 + this.hue);
    // 颜色用 HSB：随位置微变
    const h = (this.hue + this.pos.x*0.05) % 360;
    tint(h, 80, 100, a);

    // 沿速度方向拉伸，强化“流动感”
    rotate(this.vel.heading());
    const w = this.size * map(this.vel.mag(), 0, 2.2, 1.0, 1.6, true);
    const hgt = this.size;

    imageMode(CENTER);
    if (imgSprite) image(imgSprite, 0, 0, w, hgt);
    else image(gfxFallback, 0, 0, this.size*1.2, this.size*1.2);
    pop();
  }
}
