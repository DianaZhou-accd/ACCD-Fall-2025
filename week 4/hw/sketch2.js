let posX, posY, velX, velY
let diameter = 150

let imgHappy, imgSad, currentImg
let countDown = 0

function preload(){
  imgMillet = loadImage("Millet.png")
  imgCoalball = loadImage("Coalball.jpg")
}

function setup() {
  createCanvas(800, 600)
  imageMode(CENTER)
  
  posX = width/2
  posY = height/2
  
  velX = random(-5, 5)
  velY = random(-3.5, 3.5)
  
  currentImg = imgHappy
}

function draw() {
  background(220)

  circle(posX, posY, diameter)
  image(currentImg, posX, posY, diameter, diameter)

  posX = posX + velX
  posY += velY
  
  if(posX + diameter * 0.5 >= width || posX - diameter * 0.5 <= 0){
    velX = velX * -1
    currentImg = imgCoalball
    countDown = 16
  }
  if(posY + diameter * 0.5 >= height || posY - diameter * 0.5 <= 0){
    velY = velY * -1
    currentImg = imgCoalball
    countDown = 16
  }
  
  if(countDown > 0 ){
    countDown--
  }
  else {
    currentImg = imgMillet
  }
}