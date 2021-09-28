// config
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const canvasWidth = Math.floor(windowWidth / 100) * 100 - 300;
const canvasHeight = Math.floor(windowHeight / 100) * 100 - 200;
const interval = 50;
const tickRate = 300;
let scaleFactor = 10000 / interval;
let speedOfSound = 343 / scaleFactor;
let tickCounter = 0;
let secondCounter = 0;
let zoomedIn = false;
let accelerationRate = 0;
let acceleration = 0;
let startingPos = 100;
let strokeLineWidth = 1;
let funMode = false;

//elements
const ruler = document.getElementById('ruler');
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
const scaleDisplay = document.getElementById('scale-display');
const lineWidth = document.getElementById('line-width');
const funToggle = document.getElementById('fun-mode');
const xCoordDisplay = document.getElementById('x-coord');
const canvas = document.getElementById("canvas");

// canvas setup
const ctx = canvas.getContext("2d");
ctx.canvas.width = canvasWidth;
ctx.canvas.height = canvasHeight;

// soundwave circles to draw on canvas
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

// array holding the instances of the Circle class to be drawn on the canvas
let circles = [];

// object initial values 
let x = startingPos; // object x coordinate
let objSpeed = 200 / scaleFactor;

// draw grid on canvas for given canvas width
function drawGrid() {
  for (let i = 1; i < canvasWidth / 10; i++) {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(i*100, 0);
    ctx.lineTo(i*100, canvasHeight);
    ctx.stroke();
  }
}

drawGrid();

// draw legend at bottom of canvas for given canvas width
(function drawRuler() {
  ruler.innerHTML = '';
  for (let i = 0; i <= canvasWidth / 100; i++) {
    const rulerMark = document.createElement('SPAN');
    rulerMark.style.left = `${i*100}px`;
    rulerMark.classList.add('ruler-mark');
    rulerMark.innerHTML = `${(i - 100/(zoomedIn ? 1000 : 100))*1000}m`;
    ruler.append(rulerMark);
  }
})();

// event listeners
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

// change scale functionality
zoomInBtn.addEventListener('click', e => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawGrid();
  circles = [];
  zoomedIn = true;
  // scaleDisplay.innerHTML = '10';
  x = Number(startingPosInput.value) + 100;
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
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawGrid();
  circles = [];
  zoomedIn = false;
  // scaleDisplay.innerHTML = '1';
  x = Number(startingPosInput.value) + 100;
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

lineWidth.addEventListener('input', e => {
  strokeLineWidth = Number(e.target.value);
});

funToggle.addEventListener('change', e => {
  funMode = e.target.checked;
  if (funMode) {
    lineWidth.setAttribute('max', '60');
    strokeLineWidth = 20;
  } else {
    lineWidth.setAttribute('max', '5');
    strokeLineWidth = 1;
  }
});

// const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

// main draw function
function draw() {
  acceleration += accelerationRate;
  x += objSpeed + acceleration;
  ctx.strokeStyle = "#000";
  // ctx.fillStyle = 'red';
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawGrid();
  ctx.strokeStyle = "red";
  ctx.moveTo(startingPos, canvasHeight/2);
  ctx.lineTo(x, canvasHeight/2);
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.beginPath();
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.strokeStyle = circle.color;
    ctx.lineWidth = strokeLineWidth;
    // if (circle.color === 'red') {
    // } else {
    //   ctx.lineWidth = 1;
    // }
    circle.setRadius(circle.radius + speedOfSound);
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
  });
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.strokeStyle = "#0000FF"; // object color
  ctx.fillStyle = '#0000FF'; // object color
  ctx.arc(x, canvasHeight/2, 5, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.beginPath();
  console.log(scaleFactor);
  xCoordDisplay.innerHTML = !zoomedIn ? ((x - scaleFactor/2) * 10).toFixed(2) : (((x - scaleFactor/2) * 10).toFixed(2) - 900) / 10;
}

// intervals to be redefined on scale change
let drawInterval;
let circleInterval;
let counterInterval;


const colorArray = [
  '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
];

// start main loop
function startSimulation() {
  circleInterval = setInterval(() => {
    tickCounter++;
    circles.push(new Circle(
      x,
      canvasHeight/2,
      0,
      funMode ? colorArray[Math.floor(Math.random() * colorArray.length)] : '#000'));
  }, tickRate);

  // Math.floor(tickCounter) % 10 === 0 ? colors[tickCounter % colors.length] : colors[tickCounter % colors.length];
  
  drawInterval = setInterval(() => {
    draw();
  }, interval);

  counterInterval = setInterval(() => {
    secondCounter+=0.05;
    displaySecondsElapsed.innerHTML = secondCounter.toFixed(2);
  }, 50);
}

// stop main loop
function stopSimulation() {
  clearInterval(circleInterval);
  clearInterval(drawInterval);
  clearInterval(counterInterval);
}

// reset to initial state
function reset() {
  zoomOutBtn.click();
  // scaleDisplay.innerHTML = '1';
  zoomedIn = false;
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = '#000000';
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // startingPosInput.value = 0;
  // speedInput.value = 200;
  // accelerationInput.value = 0;
  displaySecondsElapsed.innerHTML = '0';
  xCoordDisplay.innerHTML = '0';
  drawGrid();
  circles = [];
  scaleFactor = 10000 / interval;
  tickCounter = 0;
  secondCounter = 0;
  accelerationRate = 0;
  acceleration = 0;
  startingPos = 100;
  x = startingPos;
  // objSpeed = 200 / scaleFactor;
}