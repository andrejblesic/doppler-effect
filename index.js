const canvasWidth = 1500;
const canvasHeight = 800;
const interval = 50;
let scaleFactor = 10000 / interval;
let counter = 0;
let tickRate = 250;
let secondCounter = 0;
let zoomedIn = false;

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.canvas.width = canvasWidth;
ctx.canvas.height = canvasHeight;

class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  setX(x) {
    this.x = x;
  }
  setRadius(radius) {
    this.radius = radius;
  }
}

function drawLine(x) {
  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvasHeight);
  ctx.stroke();
}


function drawGrid() {
  for (let i = 1; i < 16; i++) {
    drawLine(i*100);
  }
}

drawGrid();

let circleRadius = 0;
let x = 300;
let objSpeed = 200 / scaleFactor;
let speedOfSound = 343 / scaleFactor;

document.getElementById('speed-input').addEventListener('input', e => {
  objSpeed = Number(e.target.value) / scaleFactor;
});

document.getElementById('start').addEventListener('click', e => {
  e.target.setAttribute('disabled', true);
  document.getElementById('stop').removeAttribute('disabled');
  document.getElementById('reset').setAttribute('disabled', true);
  startSimulation();
});

document.getElementById('stop').addEventListener('click', e => {
  e.target.setAttribute('disabled', true);
  document.getElementById('start').removeAttribute('disabled');
  document.getElementById('reset').removeAttribute('disabled');
  stopSimulation();
});

document.getElementById('zoom-in').addEventListener('click', e => {
  reset();
  e.target.setAttribute('disabled', true);
  document.getElementById('zoom-out').removeAttribute('disabled');
  zoomedIn = true;
  scaleFactor = 1000 / interval;
  let allSpans = document.getElementsByTagName('SPAN');
  objSpeed = 200 / scaleFactor;
  speedOfSound = 343 / scaleFactor;
  for (span of allSpans) {
    span.innerHTML = parseInt(span.innerHTML) / 10 + 'm';
  }
});

document.getElementById('zoom-out').addEventListener('click', e => {
  reset();
  e.target.setAttribute('disabled', true);
  document.getElementById('zoom-in').removeAttribute('disabled');
  scaleFactor = 10000 / interval;
  let allSpans = document.getElementsByTagName('SPAN');
  objSpeed = 200 / scaleFactor;
  speedOfSound = 343 / scaleFactor;
  for (span of allSpans) {
    span.innerHTML = parseInt(span.innerHTML) * 10 + 'm';
  }
});

document.getElementById('reset').addEventListener('click', () => {
  reset();
});

let circles = [];

circles.push(new Circle(x, canvasHeight/2, 0));

function draw() {
  ctx.strokeStyle = "#000000";
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawGrid();
  ctx.moveTo(0, canvasHeight/2);
  ctx.setLineDash([5, 5]);
  ctx.lineTo(canvasWidth, canvasHeight/2);
  ctx.setLineDash([]);
  ctx.stroke();
  circles.forEach(circle => {
    circle.setRadius(circle.radius + speedOfSound);
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
  });
  ctx.strokeStyle = "#FF0000";
  ctx.arc(x, canvasHeight/2, 5, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = '#ff0000';
  ctx.fill();
  ctx.beginPath();
  x+=objSpeed;
  counter++;
}

let drawInterval;
let circleInterval;
let counterInterval;

function startSimulation() {
  circleInterval = setInterval(() => {
    circles.push(new Circle(x, canvasHeight/2, 0));
  }, tickRate);
  
  drawInterval = setInterval(() => {
    draw();
  }, interval);

  counterInterval = setInterval(() => {
    secondCounter+=0.05;
    document.getElementById('seconds').innerHTML = secondCounter.toFixed(2);
  }, 50)
}

function stopSimulation() {
  clearInterval(circleInterval);
  clearInterval(drawInterval);
  clearInterval(counterInterval);
}

function reset() {
  ctx.strokeStyle = "#000000";
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  circles = [];
  x = 300;
  secondCounter = 0;
  counter = 0;
  drawGrid();
}