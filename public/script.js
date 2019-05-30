var song;
var fft;
var button;
var backgroundColor;
var beatCutoff = 0;
var beatDecayRate = 0.98;
var framesSinceLastBeat = 0;
var beatHoldFrames = 30;
var beatThreshold = 0.11; 

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function toggleStyle(){

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

  // sound.amp(0.2)
  w = width / 100
  backgroundColor = color(0, 0, 255);


}

function draw() {
  background(backgroundColor);
  
  var level = amplitude.getLevel();
  // detectBeat(level);
  
  var spectrum = fft.analyze();
  drawBars(spectrum, w)
// width / spectrum.length,
}

function detectBeat(level) {
  if (level  > beatCutoff && level > beatThreshold){
    onBeat();
    beatCutoff = level *1.2;
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