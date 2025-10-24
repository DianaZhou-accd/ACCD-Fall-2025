let numArcs =10;
let initRadius;
let strWeight = 20;
let time = 0;

function setup() {
    createCanvas(800, 800);
    colorMode(HSB, TWO_PI, 1, 1);
    initRadius = width * 0.1;
    noFill();
}

function draw() {
    background(0);
    time += 0.02;
    
    let dynamicWeight = strWeight + sin(time * 2) * 2;

    numArcs = 5 + floor(sin(time) * 5 + 5);
    numArcs = constrain(numArcs, 1, 20);

    let angleOffset = time;

    strokeWeight(dynamicWeight);

    for(let i = 0; i < numArcs; i++) {
        let hue = (i * 0.2 + time) % TWO_PI;
        stroke(hue, 1, 1);

        push();
        translate(width * 0.5, height * 0.5);
        let radius = initRadius + i * dynamicWeight * 2;
        arc(0, 0, radius, radius, HALF_PI + QUARTER_PI + angleOffset, TWO_PI + QUARTER_PI + angleOffset);
        pop();
    }
}