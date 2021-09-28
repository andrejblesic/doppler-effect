const canvasWidth = 2100;
const canvasHeight = 900;
const interval = 50;
let scaleFactor = 10000 / interval;
let counter = 0;
let tickRate = 300;
let secondCounter = 0;
let zoomedIn;
let accelerationRate = 0;
let acceleration = 0;
let startingPos = 100;

const ruler = document.getElementById('ruler');

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.canvas.width = canvasWidth;
ctx.canvas.height = canvasHeight;

const displaySecondsElapsed = document.getElementById('seconds');
const stopBtn = document.getElementById('stop');
const resetBtn =  document.getElementById('reset');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const startBtn = document.getElementById('start');
const allSpans = document.getElementsByClassName('ruler-mark');
const speedInput = document.getElementById('speed-input');
const accelerationInput = document.getElementById('acceleration-input');
const startingPosInput = document.getElementById('starting-position');

class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  setX(x) {
    this.x = x;
  }
  setRadius(radius) {
    this.radius = radius;
  }
}

let circleRadius = 0;
let x = startingPos;
let objSpeed = 200 / scaleFactor;
let speedOfSound = 343 / scaleFactor;

function drawLine(x) {
  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvasHeight);
  ctx.stroke();
}

function drawGrid() {
  for (let i = 1; i < canvasWidth / 10; i++) {
    drawLine(i*100);
  }
}

drawGrid();

const currentRuler = document.getElementsByClassName('ruler-mark');

function drawRuler() {
  ruler.innerHTML = '';
  for (let i = 0; i <= canvasWidth / 100; i++) {
    const rulerMark = document.createElement('SPAN');
    rulerMark.style.left = `${i*100}px`;
    rulerMark.classList.add('ruler-mark');
    rulerMark.innerHTML = `${(i - 100/(zoomedIn ? 1000 : 100))*1000}m`;
    ruler.append(rulerMark);
  }
}

drawRuler();

speedInput.addEventListener('input', e => {
  objSpeed = Number(e.target.value) / scaleFactor;
});

accelerationInput.addEventListener('input', e => {
  if (zoomedIn) {
    accelerationRate = Number(e.target.value) / 100;
  } else {
    accelerationRate = Number(e.target.value) / 1000;
  }
});

startingPosInput.addEventListener('input', e => {
  if (zoomedIn) {
    startingPos = Number(e.target.value) + 100;
  } else {
    startingPos = (Number(e.target.value) / 10) + 100;
  }
  x = startingPos;
});

startBtn.addEventListener('click', e => {
  e.target.setAttribute('disabled', true);
  stopBtn.removeAttribute('disabled');
  resetBtn.setAttribute('disabled', true);
  startingPosInput.setAttribute('disabled', true);
  startSimulation();
});

stopBtn.addEventListener('click', e => {
  e.target.setAttribute('disabled', true);
  startBtn.removeAttribute('disabled');
  resetBtn.removeAttribute('disabled');
  startingPosInput.removeAttribute('disabled');
  stopSimulation();
});

zoomInBtn.addEventListener('click', e => {
  zoomedIn = true;
  startingPos = Number(startingPosInput.value) + 100;
  x = startingPos;
  // reset();
  e.target.setAttribute('disabled', true);
  zoomOutBtn.removeAttribute('disabled');
  scaleFactor = 1000 / interval;
  objSpeed = Number(speedInput.value) / scaleFactor;
  speedOfSound = 343 / scaleFactor;
  for (span of allSpans) {
    span.innerHTML = parseInt(span.innerHTML) / 10 + 'm';
  }
});

zoomOutBtn.addEventListener('click', e => {
  zoomedIn = false;
  startingPos = Number(startingPosInput.value) + 100;
  x = startingPos;
  e.target.setAttribute('disabled', true);
  zoomInBtn.removeAttribute('disabled');
  scaleFactor = 10000 / interval;
  objSpeed = Number(speedInput.value) / scaleFactor;
  speedOfSound = 343 / scaleFactor;
  for (span of allSpans) {
    span.innerHTML = parseInt(span.innerHTML) * 10 + 'm';
  }
});

resetBtn.addEventListener('click', () => {
  reset();
});

let circles = [];

function draw() {
  acceleration += accelerationRate;
  x += objSpeed + acceleration;
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = '#000000';
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawGrid();
  ctx.moveTo(startingPos, canvasHeight/2);
  ctx.lineTo(x, canvasHeight/2);
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.beginPath();
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.strokeStyle = circle.color;
    if (circle.color === 'red') {
      ctx.lineWidth = 2;
    } else {
      ctx.lineWidth = 1;
    }
    circle.setRadius(circle.radius + speedOfSound);
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.strokeStyle = "#0000FF"; // object color
  ctx.fillStyle = '#0000FF'; // object color
  ctx.arc(x, canvasHeight/2, 5, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.beginPath();
}

let drawInterval;
let circleInterval;
let counterInterval;

function startSimulation() {
  circleInterval = setInterval(() => {
    counter++;
    circles.push(new Circle(x, canvasHeight/2, 0, Math.floor(counter) % 10 === 0 ? 'red' : 'black'));
  }, tickRate);
  
  drawInterval = setInterval(() => {
    draw();
  }, interval);

  counterInterval = setInterval(() => {
    secondCounter+=0.05;
    displaySecondsElapsed.innerHTML = secondCounter.toFixed(2);
  }, 50)
}

function stopSimulation() {
  clearInterval(circleInterval);
  clearInterval(drawInterval);
  clearInterval(counterInterval);
}

function reset() {
  // window.location.href =  window.location.href;
  // zoomInBtn.removeAttribute('disabled');
  zoomOutBtn.click();
  // zoomedIn = false;
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = '#000000';
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  startingPosInput.value = 0;
  speedInput.value = 200;
  accelerationInput.value = 0;
  displaySecondsElapsed.innerHTML = '0';
  drawGrid();
  drawRuler();
  drawLine();
  circles = [];
  scaleFactor = 10000 / interval;
  counter = 0;
  secondCounter = 0;
  accelerationRate = 0;
  acceleration = 0;
  startingPos = 100;
  x = startingPos;
  objSpeed = 200 / scaleFactor;
}