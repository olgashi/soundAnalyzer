var song;
var fft;
var button;
var backgroundColor;
var beatCutoff = 0;
var beatDecayRate = 0.9;
var framesSinceLastBeat = 0;
var beatHoldFrames = 40;
var beatThreshold = 0.11;
var binCount = 128; // size of resulting FFT array. Must be a power of 2 between 16 and 1024
var bubbles = new Array(binCount);
var stars = new Array(binCount);
var volume = 0.01;
let angle = 0.0;
let jitter = 0.0;
let smoothing = 0.6;

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function toggleVisual() {}

function preload() {
  song = loadSound('Meek Mill-Going Bad.mp3');
  // song = loadSound("Undercover Of The Night.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight / 2);
  colorMode(HSB, 100);

  button = createButton("Play/Pause");
  button.mousePressed(toggleSong);

  // styleButton = createButton("Toggle Visual");
  var styleButton = document.createElement("BUTTON");
  styleButton.innerHTML = "Toggle Visual"
  document.body.appendChild(styleButton)
  styleButton.addEventListener('click', ()=> {alert('clicked')})
  song.play();
  fft = new p5.FFT(smoothing, 128);
  amplitude = new p5.Amplitude();

  amplitude.setInput(song);
  amplitude.smooth(0.9);

  volume = amplitude.getLevel();

  w = width / 100;
  backgroundColor = color(0, 0, 255);
  
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

function draw() {
  background(backgroundColor);
  changingBG()
  var spectrum = fft.analyze();
  // drawbubbles(binCount, spectrum)
  drawBars(spectrum, w);
}

function changingBG() {
  var level = amplitude.getLevel();
  detectBeat(level, "background");
}

function detectBeat(level, action) {
  if (level > beatCutoff && level > beatThreshold) {
    onBeat(action);
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

function onBeat(action) {
  if (action === "background") {
    backgroundColor = color(random(0, 255), random(0, 255), random(0, 255));
  } else if (action === "jitter") {
    jitter = random(-0.4, 0.4);
  }
}

function drawBars(spectrum, w) {
  for (var i = 0; i < spectrum.length; i++) {
    fill(i, i, 255);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(i * w, height, w - 2, h);
  }
}

// ========

var Bubble = function(position) {
  this.position = position;
  this.scale = random(1, 6);
  this.speed = createVector(0, random(0, 4));
};
console.log("Volume", volume);
var theyExpand = 2 + 10 * volume;
console.log("theyExpand", theyExpand);

// use FFT bin level to change speed and diameter
Bubble.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / map(someLevel, 0, 255, 0.25, 2);

  if (this.position.y > height) {
    this.position.y = 0;
  }

  this.diameter = map(someLevel, 0, 255, 30, 0) * this.scale * theyExpand;

  ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
};

function drawbubbles(binCount, spectrum) {
  for (var i = 0; i < binCount; i++) {
    colorMode(HSB);
    fill(i, 255, 255);
    bubbles[i].update(spectrum[i]);
    // update x position (in case we change the bin count)
    // bubbles[i].position.x = map(i, 0, binCount, 0, width * 2)
  }
}

