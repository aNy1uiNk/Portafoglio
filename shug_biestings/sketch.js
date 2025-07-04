let cols = 60;
let rows = 60;
let noiseScale = 0.03;
let t = 0;
let zOffset = 0;
let glowLayer;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 255, 255, 255);
  glowLayer = createGraphics(width, height);
  noStroke();
  blendMode(ADD);
}

function draw() {
  background(0, 0, 0, 12);

  glowLayer.clear();
  glowLayer.colorMode(HSB, 360, 255, 255, 255);
  glowLayer.translate(width / 2, height / 2);
  glowLayer.rotate(sin(frameCount * 0.002 + mouseX * 0.0005) * 0.3);

  for (let x = -cols / 2; x < cols / 2; x++) {
    for (let y = -rows / 2; y < rows / 2; y++) {
      let nx = x * noiseScale + t;
      let ny = y * noiseScale + t;
      let nz = zOffset;

      let noiseVal = noise(nx, ny, nz);
      let angle = noiseVal * TWO_PI * 5;
      let radius = map(noiseVal, 0, 1, 8, 90);

      let sx = x * 18 + cos(angle) * radius;
      let sy = y * 18 + sin(angle) * radius;

      let depth = sin(t * 1.2 + x * 0.3 + y * 0.3);
      let size = map(depth, -1, 1, 3, 10);
      let hue = (angle * 60 + frameCount * 0.5 + mouseY * 0.3) % 360;
      let alpha = map(radius, 10, 90, 60, 200);

      glowLayer.fill(hue, 200, 255, alpha);
      glowLayer.ellipse(sx, sy, size, size);
    }
  }

  drawRadiantShell(glowLayer);
  drawPulseRing(glowLayer);
  drawNebulaDust(glowLayer);

  image(glowLayer, 0, 0);

  drawStarField();

  t += 0.004;
  zOffset += 0.001;
}

function drawRadiantShell(pg) {
  pg.push();
  pg.rotate(-frameCount * 0.0015);
  pg.noFill();
  pg.strokeWeight(1.2);
  pg.beginShape();
  for (let a = 0; a < TWO_PI; a += 0.03) {
    let r = 150 + 40 * sin(6 * a + t * 5);
    let x = r * cos(a);
    let y = r * sin(a);
    pg.stroke((a * 90 + frameCount * 1.5) % 360, 150, 255, 120);
    pg.vertex(x, y);
  }
  pg.endShape(CLOSE);
  pg.pop();
}

function drawPulseRing(pg) {
  pg.push();
  pg.rotate(frameCount * 0.003);
  for (let i = 0; i < 14; i++) {
    let r = 230 + 25 * sin(t * 6 + i);
    let angle = TWO_PI / 14 * i + t;
    let x = cos(angle) * r;
    let y = sin(angle) * r;

    pg.fill((angle * 180 + frameCount * 1.5) % 360, 255, 255, 70);
    pg.ellipse(x, y, 20 + 8 * sin(t * 2.5 + i), 20 + 8 * cos(t * 2.5 + i));
  }
  pg.pop();
}

function drawStarField() {
  push();
  noStroke();
  for (let i = 0; i < 70; i++) {
    let angle = random(TWO_PI);
    let r = random(300, 450);
    let x = width / 2 + cos(angle) * r;
    let y = height / 2 + sin(angle) * r;
    fill(0, 0, 255, random(8, 24));
    ellipse(x, y, random(1, 2.5), random(1, 2.5));
  }
  pop();
}

function drawNebulaDust(pg) {
  for (let i = 0; i < 40; i++) {
    let angle = random(TWO_PI);
    let r = random(100, 300);
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    pg.fill((angle * 100 + t * 200) % 360, 80, 255, 10);
    pg.ellipse(x, y, random(20, 40), random(20, 40));
  }
}
