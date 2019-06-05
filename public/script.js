//Beat detection credit:
// https://github.com/therewasaguy/p5-music-viz/blob/master/demos/01d_beat_detect_amplitude/sketch.js
var song, fft, button, backgroundColor;
// var colors = ["FF0000", "FF7F00", "FFFF00", "00FF00", "0000FF", "4B0082", "8F00FF"];
var colors = ["red", "green", "yellow", "blue"];
const COLORS_TO_RGB= {
  red: [255, 0, 0],
  green: [0, 255, 0], 
  yellow: [255, 255, 0], 
  // purple: [128, 0, 128], 
  blue: [0, 0, 255]
};
var beatCutoff = 0,
  beatDecayRate = 0.1,
  framesSinceLastBeat = 0,
  beatHoldFrames = 30,
  beatThreshold = 0.11;
var binCount =1024; // size of resulting FFT array. Must be a power of 2 between 16 and 1024
var volume = 0.01,
  smoothing = 0.85;
var visual = "bars";
var spectrum;
let w = 20;
let y = 0;
let speed = 12;
let lightsColor1, lightsColor2;

/*eslint-disable */

var socket = new WebSocket("ws://localhost:8080");

function toggleSong() {
  song.isPlaying() ? song.pause() : song.play();
}

function preload() {
  song = loadSound("cctrimmed.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight - 150);
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
}

function toggleView() {
  switch (visual) {
    case "":
      visual = "bubbles";
      break;
    case "circle":
      visual = "bars";
      break;
    case "bars":
      visual = "lights";
      break;
    case "lights":
      visual = "circle";
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
    case "circle":
      drawCirlce();
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
  // changingLightsColor()
  spectrum = fft.analyze();
  toggleVisual();
}

function changingLightsColor() {
  var level = amplitude.getLevel();
  detectBeat(level);
}

function detectBeat(level) {
  if (level > beatCutoff && level > beatThreshold) {
    onBeat();
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
let rgbColors = [];
function onBeat() {
  // backgroundColor = color(
  //   random(0, maxColorValue),
  //   random(0, maxColorValue),
  //   random(0, maxColorValue)
  // );
  lightsColor1 = colors[Math.floor(Math.random()*colors.length)]
  lightsColor2 = colors[Math.floor(Math.random()*colors.length)]
  rgbColors.push(lightsColor1)
  rgbColors.push(lightsColor2)
  console.log(rgbColors)
  // socket.send("dance");
  socket.send(rgbColors)
  rgbColors = []
}

function drawBars() {
  //  background(0);
  // colorMode(RGB);
  // background(lightsColor1)
  colorMode(HSB)
  changingLightsColor()
  for (var i = 0; i < spectrum.length; i++) {
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    // stroke(i, i, 255);
    strokeWeight(3);
    // backgroundColor(COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2])
    fill(i, i, 255);
    // fill(COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2]);
    rect(i * w, height, w - 2, h);
  }
}

function drawDanceFloor() {
  //  background(0);
  var spectrum = fft.analyze();
  colorMode(RGB);
  changingLightsColor();
  background(0)
  translate(width / 2, height / 2 + 100);

  // for (var i = 0; i < 180; i++) {
  //   //disco ball
  //   var angle = map(i, 0, spectrum.length, 0, binCount);
  //   var amp = spectrum[i];
  //   var r = map(amp, 0, 256, 0, 225);
  //   // var r = map(amp, 0, 1024, 50, 120);
  //   var x = r * cos(angle);
  //   var y = r * sin(angle);
  //   stroke(0, 255, 255, 60);
  //   strokeWeight(3);
  //   line(0, 0, x, y);
  // }
  //small lights
  strokeWeight(1.5);
  drawLight(-400, -310, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  // drawLight(100, 0, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  drawLight(80, -80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  // drawLight(100, 0, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  drawLight(80, 80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  drawLight(80, -80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  drawLight(80, 80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  drawLight(80, -80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  drawLight(80, 80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  drawLight(80, -80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  drawLight(80, 80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  // drawLight(100, 0, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  // drawLight(100, 0, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);

  // drawLight(80, 80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  // drawLight(80, -80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  // drawLight(80, 80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  // drawLight(80, -80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  // drawLight(80, 80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  // drawLight(80, -80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
  // drawLight(80, 80, spectrum, COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2], 30);
}

function drawLight(pos1, pos2, spectrum, clr1, clr2, clr3, alpha = 100, stkWght = 1) {
  translate(pos1, pos2);
  for (var i = 0; i < 180; i++) {
    colorMode(RGB);
    var angle = map(i, 0, spectrum.length, 0, 180);
    var amp = spectrum[i];
    var r = map(amp, 0, 128, 0, 25);
    var x = r * cos(angle);
    var y = r * sin(angle);
    stroke(clr1, clr2, clr3, alpha);
    // line(0, 0, x, y);
    ellipse(x, y, 2)
    strokeWeight(stkWght);
  }
}

function drawCirlce() {
  translate(width / 2, height / 2);
  changingLightsColor()
  for (var i = 0; i < 160; i++) {
    // colorMode(HSB);
    var angle = map(i, 0, spectrum.length, 0, 180);
    var amp = spectrum[i];
    var r = map(amp, 0, 128, 0, 250);
    var x = r * cos(angle);
    var y = r * sin(angle);
    // fill(COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2]);
    stroke(COLORS_TO_RGB[lightsColor1][0], COLORS_TO_RGB[lightsColor1][1], COLORS_TO_RGB[lightsColor1][2]);
    // point(x, y);
    // point(x, y+ 2);
    // point(x, y+ 4);
    // point(x+2, y);
    // point(x + 4,y);
    ellipse(x, y, 2)
    strokeWeight(2);
  }
}