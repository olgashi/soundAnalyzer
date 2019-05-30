var song;
var fft;
var button;
var backgroundColor;
var beatCutoff = 0;
var beatDecayRate = 0.7;
var framesSinceLastBeat = 0;
var beatHoldFrames = 30;
var beatThreshold = 0.11; 
var binCount = 256; // size of resulting FFT array. Must be a power of 2 between 16 and 1024
var particles =  new Array(binCount);
var volume = 0.01


function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function toggleVisual(){

}

function preload() {
  song = loadSound('09. Meek Mill - Going Bad (Feat. Drake).mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight-100);
  colorMode(HSB, 100);
  // angleMode(DEGREES);
  button = createButton('Play/Pause');
  button.mousePressed(toggleSong);

  styleButton = createButton('Toggle Visual')
  song.play();
  fft = new p5.FFT(0.9, 128);
  amplitude = new p5.Amplitude();

  amplitude.setInput(song);
  amplitude.smooth(0.9);

  volume = amplitude.getLevel();
  // volume = fft.analyze();
  
  // sound.amp(0.2)
  w = width / 100
  backgroundColor = color(0, 0, 255);
  
  for (var i = 0; i < particles.length; i++) {
    var position = createVector(
      // x position corresponds with position in the frequency spectrum
      map(i, 0, binCount, 0, width * 2),
      random(0, height)
      );
      particles[i] = new Particle(position);
    }
    
    
    
    
  }
  
  function draw() {
    background(backgroundColor);
    // changingBG()
    
    var spectrum = fft.analyze();
    // drawBars(spectrum, w)
    drawParticles(binCount, spectrum)
    // drawParticles(binCount, volume)
    // width / spectrum.length,
}

function changingBG() {
  var level = amplitude.getLevel();
  detectBeat(level);
}

function detectBeat(level) {
  if (level  > beatCutoff && level > beatThreshold){
    onBeat();
    beatCutoff = level *1.3;
    framesSinceLastBeat = 0;
  } else{
    if (framesSinceLastBeat <= beatHoldFrames){
      framesSinceLastBeat ++;
    }
    else{
      beatCutoff *= beatDecayRate;
      beatCutoff = Math.max(beatCutoff, beatThreshold);
    }
  }
}

function onBeat() {
  backgroundColor = color( random(0,255), random(0,255), random(0,255) );
  // rectRotate = !rectRotate;
}

function drawBars(spectrum, w){
  for (var i = 0; i< spectrum.length; i++){
    fill(i, 255, 255)
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(i* w, height, w-2, h )
  }
}


var Particle = function(position) {
  this.position = position;
  this.scale = random(1, 5);
  this.speed = createVector(0, random(0, 5) );
}

var theyExpand = 1+(3*volume);

// use FFT bin level to change speed and diameter
Particle.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / map(someLevel, 0, 255, .25, 2);

  if (this.position.y > height) {
    this.position.y = 0;
  }
  
  this.diameter = map(someLevel, 0, 255, 30, 0) * this.scale * theyExpand;

  var hue = map(someLevel, 0, 255, 0, 360);
  var sat = map(volume, 0, 0.5, 80, 100);
  var bri = map(volume, 0, 0.5, 60, 100);
  var alp = map(volume, 0, 0.5, 60, 100);

  fill(hue,sat,bri,alp);
  ellipse(this.position.x, this.position.y, this.diameter, this.diameter);

}

function drawParticles(binCount, spectrum){

  for (var i = 0; i < binCount; i++) {
    particles[i].update(spectrum[i]);
    // update x position (in case we change the bin count)
    // particles[i].position.x = map(i, 0, binCount, 0, width * 2
}
}


