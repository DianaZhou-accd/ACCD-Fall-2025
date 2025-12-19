let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/dvSsTjCarf/';
let video; 
let label = 'waiting...';

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO, {flipped: true});
  video.size(640, 480);
  video.hide();
  
  classifier.classifyStart(video, gotResult);
}

function draw(){
  background(0);
  image(video, 0, 0);
  
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text(label, width/2, height - 16);
  
  let emoji = '😎';
  if (label == 'scissor 2'){
    emoji = '✂️'
  } else if (label == 'yeah'){
    emoji = '😎'
  } else if (label == 'scissor'){
    emoji = '😍'
  }
  
  textSize(256)
  text(emoji, width/2, height/2);
  
}

function gotResult(results, error){
  if(error){
    console.error(error);
    return;
  }
  label = results[0].label;
  
}