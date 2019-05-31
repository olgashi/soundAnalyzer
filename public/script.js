//Beat is from
// https://github.com/therewasaguy/p5-music-viz/blob/master/demos/01d_beat_detect_amplitude/sketch.js
var song;
var fft;
var button;
var backgroundColor;
var beatCutoff = 0;
var beatDecayRate = 0.1;
var framesSinceLastBeat = 0;
var beatHoldFrames = 25;
var beatThreshold = 0.11;
var binCount = 256; // size of resulting FFT array. Must be a power of 2 between 16 and 1024
var volume = 0.01;
let smoothing = 0.8;
var visual = "bars";
var spectrum;
var bubbles = new Array(binCount);
let w = 20;
let img;
let startTime;

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function preload() {
  // song = loadSound("Meek Mill-Going Bad.mp3");
  startTime = new Date().getTime() / 1000
  // song = loadSound("(I Can't Get No) Satisfaction.mp3")
  // song = loadSound("Meek Mill-Oodles O' Noodles Babies.mp3");
  song = loadSound("Undercover Of The Night.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight / 2);
  img = loadImage("dino.jpg")
  colorMode(HSB, 100);
 
  
  button = createButton("Play/Pause");
  button.mousePressed(toggleSong);
  
  visualButton = createButton("Toggle Visual");
  visualButton.mouseClicked(toggleVisual);

  
  song.play();
  fft = new p5.FFT(smoothing, 512);
  spectrum = fft.analyze();

  amplitude = new p5.Amplitude();
  
  amplitude.setInput(song);
  amplitude.smooth(0.9);
  
  volume = amplitude.getLevel();
  
  // w = width / 100;
  backgroundColor = color(0, 0, 255);
  
  // toggleVisual(visual);
  //bubbles
  for (var i = 0; i < bubbles.length; i++) {
    var position = createVector(
      // x position corresponds with position in the frequency spectrum
      map(i, 0, binCount, 0, width * 2),
      random(0, height)
    );
    bubbles[i] = new Bubble(position);
  }

  

  // rectMode(CENTER);
}

function mouseClicked(){
  visual = visual ==='bubbles' ? 'bar' : 'bubbles';
  redraw();
 
}

function toggleVisual() {
  visual == "bubbles" ? drawbubbles() : drawBars()
  }

function draw() {
  background(backgroundColor);
  spectrum = fft.analyze();
  // changingBG(256);
  // toggleVisual()
  // drawCircle()
  drawStar()

 
}

function changingBG(maxVal) {
  var level = amplitude.getLevel();
  detectBeat(level, maxVal);
}

function detectBeat(level, maxVal) {
  if (level > beatCutoff && level > beatThreshold) {
    onBeat(maxVal);
    beatCutoff = level * 1.3;
    framesSinceLastBeat = 0;
  } else {
    if (framesSinceLastBeat <= beatHoldFrames) {
      framesSinceLastBeat++;
    } else {
      beatCutoff *= beatDecayRate;
      beatCutoff = Math.max(beatCutoff, beatThreshold);
    }
  }
}

function onBeat(maxVal) {
  backgroundColor = color(random(0, maxVal), random(0, maxVal), random(0, maxVal));
}

function drawBars() {
  for (var i = 0; i < spectrum.length; i++) {
    fill(i, i, 255);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(i * w, height, w - 2, h);
  }
}

// ========

var Bubble = function(position) {
  this.position = position;
  this.scale = random(0, 4);
  this.speed = createVector(0, random(0, 1));
};
var theyExpand = 2 + 10 * volume;

// use FFT bin level to change speed and diameter
Bubble.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / map(someLevel, 0, 255, 0.25, 2);

  if (this.position.y > height) {
    this.position.y = 0;
  }

  this.diameter = map(someLevel, 0, 255, 30, 0) * this.scale * theyExpand;
  console.log('Diameter ', this.diameter)

  ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
};

function drawbubbles() {
  for (var i = 0; i < binCount; i++) {
    colorMode(HSB);
    fill(i, i, 255);
    bubbles[i].update(spectrum[i] + 20);
    // update x position (in case we change the bin count)
    // bubbles[i].position.x = map(i, 0, binCount, 0, width * 2)
  }
}
function drawCircle(){
  image(img, 0, height / 2, img.width / 2, img.height / 2);
  let circleColor;
  noStroke()
  // The getLevel() method returns values between 0 and 1,
  // so map() is used to convert the values to larger numbers
  scale = map(amplitude.getLevel(), 0, 1.0, 10, width);
  console.log(scale)
  // Draw the circle based on the volume
  stroke('red');
  strokeWeight(3)
  noFill()
  // fill(89, 51, 1);
  ellipse(width/2, height/2, scale-150, scale-150)
  stroke('green');
  ellipse(width/2, height/2, scale-10, scale-10)
  stroke('blue');
  strokeWeight(3)
  ellipse(width/2, height/2, scale-130, scale-130)
  stroke('yellow');
  ellipse(width/2, height/2, scale-135, scale-135)
  stroke('red');
  ellipse(width/2, height/2, scale-15, scale-15)
  stroke('green');
  ellipse(width/2, height/2, scale-20, scale-20)
  stroke('yellow');
  ellipse(width/2, height/2, scale-125, scale-125)
  stroke('green');
  strokeWeight(3)
  ellipse(width/2, height/2, scale-25, scale-25)

  strokeWeight(3)
  ellipse(width/2, height/2, scale-90, scale-90)
  stroke('yellow');
  ellipse(width/2, height/2, scale-85, scale-85)
  stroke('red');
  ellipse(width/2, height/2, scale-80, scale-80)
  stroke('green');
  ellipse(width/2, height/2, scale-75, scale-75)
  stroke('yellow');
  ellipse(width/2, height/2, scale-70, scale-70)
}

function drawStar(){
  var spectrum = fft.analyze();
  colorMode(RGB)
  changingBG(30)
  translate(width / 2, height / 5);
  for (var i = 0; i < spectrum.length; i++) {
    var angle = map(i, 0, spectrum.length, 0, 100);
    var amp = spectrum[i];
    var r = map(amp, 0, 1024, 15, 50);
    var x = r * cos(angle);
    var y = r * sin(angle);
    stroke(i, random(0, i), 255, 20);
    strokeWeight(1.5)
    line(0, 0, x, y);
    
    var r = map(amp, 0, 256, 0, 300);
    fill(255, 255, 255);
    var x = r * cos(angle);
    var y = r * sin(angle);
    strokeWeight(3)
    // stroke(255, 200, 200, 23);
    line(0, 0, x, y);
  }

  //lights on the left
  strokeWeight(2)
  drawLight(-500, -50, spectrum, 255, 0, 196, 13)
  drawLight(100, 0, spectrum, 188, 255, 0, 13)
  drawLight(100, 0, spectrum, 255, 128, 0, 13)
  
  //lights on the right
  drawLight(600, 0, spectrum, 255, 255, 0, 13)
  drawLight(100, 0, spectrum, 111, 255, 0, 13)
  drawLight(100, 0, spectrum, 0, 196, 255, 13)

}

function drawLight(pos1, pos2, spectrum, clr1, clr2, clr3, alpha){
  translate(pos1, pos2);
  for (var i = 0; i < 500; i++) {
    colorMode(RGB)
    var angle = map(i, 0, spectrum.length, 0, 100);
    var amp = spectrum[i];
    var r = map(amp-10, 0, 256, 0, 70);
    fill(255, 0, 0);
    var x = r * cos(angle);
    var y = r * sin(angle);
    stroke(clr1, clr2, clr3, alpha);
    line(0, 0, x, y);
}
}