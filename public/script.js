//Beat detection credit:
// https://github.com/therewasaguy/p5-music-viz/blob/master/demos/01d_beat_detect_amplitude/sketch.js
var song, fft, button, backgroundColor;
var beatCutoff = 0,
  beatDecayRate = 0.1,
  framesSinceLastBeat = 0,
  beatHoldFrames = 15,
  beatThreshold = 0.11;
var binCount = 256; // size of resulting FFT array. Must be a power of 2 between 16 and 1024
var volume = 0.01,
  smoothing = 0.8;
var visual = "bars";
var spectrum;
var bubbles = new Array(binCount / 2);
let w = 20;
let y = 0;
let speed = 12;

/*eslint-disable */

var socket = new WebSocket("ws://localhost:8080");

function toggleSong() {
  song.isPlaying() ? song.pause() : song.play();
}

function preload() {
  // song = loadSound("Meek Mill-Going Bad.mp3");
  // song = loadSound("(I Can't Get No) Satisfaction.mp3");
  // song = loadSound("Meek Mill-Oodles O' Noodles Babies.mp3");
  // song = loadSound("Got To Keep On.mp3");
  // song = loadSound("Undercover Of The Night.mp3");
  // song = loadSound("WEEK22_19 Guest Mix - Luca Donzelli  (IT).mp3");
  song = loadSound("cctrimmed.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight - 250);
  colorMode(RGB);
  background(0);

  button = createButton("Play/Pause");
  button.mouseClicked(toggleSong);

  visualButton = createButton("Toggle Visual");
  visualButton.mouseClicked(toggleView);

  song.play();
  fft = new p5.FFT(smoothing, 512);
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.9);
  volume = amplitude.getLevel();

  //initialize bubbles
  for (var i = 0; i < bubbles.length; i++) {
    var position = createVector(
      // x position corresponds with position in the frequency spectrum
      map(i, 0, binCount, 0, width * 2),
      random(0, height)
    );
    bubbles[i] = new Bubble(position);
  }
}

function toggleView() {
  switch (visual) {
    case "":
      visual = "bubbles";
      break;
    case "bubbles":
      visual = "bars";
      break;
    case "bars":
      visual = "lights";
      break;
    case "lights":
      visual = "bubbles";
      break;
    default:
      console.log("something is wrong in mouseClicked");
  }
  redraw();
}

function toggleVisual() {
  switch (visual) {
    case "":
      drawBars();
      break;
    case "bubbles":
      // drawbubbles()
      singleLight();
      break;
    case "bars":
      drawBars();
      break;
    case "lights":
      drawDanceFloor();
      break;
    default:
      console.log("something is wrong in toggleVisual");
  }
}

function draw() {
  // colorMode(HSB)
  background(0);
  // changingBG(256)
  spectrum = fft.analyze();
  toggleVisual();
}

function changingBG(maxColorValue) {
  var level = amplitude.getLevel();
  detectBeat(level, maxColorValue);
}

function detectBeat(level, maxColorValue) {
  if (level > beatCutoff && level > beatThreshold) {
    console.log("here");
    onBeat(maxColorValue);
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

function onBeat(maxColorValue) {
  backgroundColor = color(
    random(0, maxColorValue),
    random(0, maxColorValue),
    random(0, maxColorValue)
  );
  socket.send("dance");
}

function drawBars() {
  //  background(0);
  colorMode(RGB);
  // noFill()
  for (var i = 0; i < spectrum.length; i++) {
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    stroke(256, i, 50);
    strokeWeight(3);
    fill(219, 200, 240);
    rect(i * w, height, w - 2, h);
  }
}

function drawDanceFloor() {
  //  background(0);
  var spectrum = fft.analyze();
  colorMode(RGB);
  changingBG(10);
  translate(width / 2, height / 2 - 50);

  for (var i = 0; i < spectrum.length; i++) {
    //disco ball
    var angle = map(i, 0, spectrum.length, 0, 100);
    var amp = spectrum[i];
    var r = map(amp, 0, 1024, 50, 120);
    var x = r * cos(angle);
    var y = r * sin(angle);
    stroke(i, random(0, i), 255, 20);
    strokeWeight(3);
    line(0, 0, x, y);
    var r = map(amp, 0, 256, 0, 125);
    fill(255, 255, 255);
    var x = r * cos(angle);
    var y = r * sin(angle);
    strokeWeight(2);
    point(x, y);
    var angle = map(i, 0, spectrum.length / 10, 0, random(0, 10));
    var r = map(amp, 0, 2, 0, 400);
    var x = r * cos(angle);
    var y = r * sin(angle);
    stroke(i, random(0, i), 255, 10);
    strokeWeight(0.6);
    line(0, 0, x, y);
  }
  //lights on the left
  strokeWeight(1.5);
  drawLight(-600, -230, spectrum, 255, 0, 196, 30);
  drawLight(100, 0, spectrum, 188, 255, 0, 30);
  drawLight(100, 0, spectrum, 255, 128, 0, 30);
  drawLight(100, 0, spectrum, 255, 255, 0, 30);
  drawLight(100, 0, spectrum, 220, 20, 60, 30);
  drawLight(100, 0, spectrum, 0, 196, 255, 30);
  drawLight(100, 0, spectrum, 188, 255, 0, 30);
  drawLight(100, 0, spectrum, 255, 128, 0, 30);
  drawLight(100, 0, spectrum, 255, 255, 0, 30);
  drawLight(100, 0, spectrum, 111, 255, 0, 30);
  drawLight(100, 0, spectrum, 0, 196, 255, 30);
  drawLight(100, 0, spectrum, 255, 0, 196, 30);
  drawLight(100, 0, spectrum, 256, 250, 240, 30);
}

function drawLight(pos1, pos2, spectrum, clr1, clr2, clr3, alpha, stkWght = 1) {
  translate(pos1, pos2);
  for (var i = 0; i < 180; i++) {
    colorMode(RGB);
    var angle = map(i, 0, spectrum.length, 0, 180);
    var amp = spectrum[i];
    var r = map(amp, 0, 128, 0, 15);
    var x = r * cos(angle);
    var y = r * sin(angle);
    stroke(clr1, clr2, clr3, alpha);
    line(0, 0, x, y);
    strokeWeight(stkWght);
  }
}
var Bubble = function(position) {
  this.position = position;
  this.scale = random(0, 4);
  this.speed = createVector(0, random(0, 2));
};
var expandSize = 2 + 10 * volume;

// use FFT bin level to change speed and diameter
Bubble.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / map(someLevel, 0, 255, 0.25, 2);
  if (this.position.y > height) {
    this.position.y = 0;
  }
  this.diameter = map(someLevel, 0, 255, 0, 30) * this.scale * expandSize;
  ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
};

function drawbubbles() {
  background("green");
  colorMode(HSB);
  for (var i = 0; i < binCount / 2; i++) {
    fill(256, 256, 256);
    stroke(i, 100, 200);
    bubbles[i].update(spectrum[i] + 20);
  }
}

function singleLight() {
  translate(width / 2, height / 2);
  for (var i = 0; i < spectrum.length/3; i++) {
    // colorMode(HSB);
    var angle = map(i, 0, spectrum.length, 0, 300);
    var amp = spectrum[i];
    var r = map(amp, 0, 128, 0, 150);
    var x = r * cos(angle);
    var y = r * sin(angle);
    // fill(219, 200, 240);
    stroke(0, 191, 255);
    // if (i % 2 === 0) {
    //   stroke(0, 191, 255);
    // // } else if (i % 3 === 0) {
    // //   stroke(256, 250, 240);
    // } else {
    //   stroke(255, 102, 0);
    // }

    // line(0, 0, x, y);
    point(x, y);
    strokeWeight(3);
  }
}
