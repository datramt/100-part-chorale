let smileys = [];
let volSlider;
let volLabel, bgDiv;
let numOfCells;

function setup() {
  createCanvas(400, 400);
	masterVolume(0)
  numOfCells = 10;
  
  for (let i = 0; i < numOfCells; i++) {
    smileys[i] = []
    for (let j = 0; j < numOfCells; j++) {
      smileys[i][j] = new Smiley(
        i * width / numOfCells + 0.5 * width / numOfCells, 
        j * height / numOfCells + 0.5 * height / numOfCells, 
        width / numOfCells, 
        1 + j * 0.1 - i * 0.06)
    }
  }
  
  bgDiv = createDiv()
  	.position(0, height)
  	.size(400, 30)
  	.style('background', 'yellow')
  
  volLabel = createDiv('dB: -inf')
  	.style('color', 'gray')
    .position(160, height+6)
  
  volSlider = createSlider(-60, 0, -60, 0)
  	.position(10, height+6)
  	.input(() => {
    	masterVolume(pow(10,volSlider.value()/20)-0.001, 0.1)
    	volLabel.html('dB: ' + volSlider.value().toFixed(3))
  })
}

function draw() {
  background(80);

  for (let i = 0; i < numOfCells; i++) {
    for (let j = 0; j < numOfCells; j++) {
      smileys[i][j].displayFace()
    }
  }
}

class Smiley {
  constructor(xpos, ypos, size, freq) {
    this.pos = createVector(xpos, ypos)
    this.size = size
    this.freq = freq
    this.pan = map(xpos, 0, width, -1, 1)

    this.mrsOscillator = new p5.Oscillator('sawtooth')
    this.mrsOscillator.amp(0)
    this.mrsOscillator.freq(-ypos + 900)
    this.mrsOscillator.pan(this.pan)
    this.mrsOscillator.start()

    this.mod = new p5.Oscillator('sine')
    this.mod.disconnect()
    this.mod.freq(freq)
    this.mod.amp(0.1)
    this.mod.start()

    this.mrsOscillator.amp(this.mod)

    this.amplitude = new p5.Amplitude()
    this.amplitude.setInput(this.mrsOscillator)

  }

  displayFace() {
    this.level = this.amplitude.getLevel()
    //smiley face
    strokeWeight(1)
    fill(255, 255, 0)
    ellipse(this.pos.x, this.pos.y, this.size)
    fill(0)
    ellipse(this.pos.x - this.size * 0.2, this.pos.y - this.size * 0.2, 0.2 * this.size)
    ellipse(this.pos.x + this.size * 0.2, this.pos.y - this.size * 0.2, 0.2 * this.size)
    strokeWeight(scale * 0.03)
    if (this.level > 0.01) {
      fill(0)
    } else {
      noFill()
    }
    arc(this.pos.x, this.pos.y, 0.7 * this.size, 0.7 * this.size, 0, PI)
  }

}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}