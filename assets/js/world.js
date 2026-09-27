
document.addEventListener("DOMContentLoaded", function () {
//variables
const numBalls = 100;
const speed = .4;
const gravity = 0.1;
const friction = 1;
const ctx = document.querySelector('.world');

// If the decorative background container is not present (it’s commented out in some layouts),
// exit early to avoid runtime errors.
if (!ctx) {
	return;
}

let ballSize = {
	min : null,
	max : null
}

let windowSize = {
	w: window.innerWidth,
	h: window.innerHeight  // ← instead of window.innerHeight
  }
  

let mouse = {
	x : windowSize.w / 2,
	y : windowSize.h / 2
}

let colors = ['#ff2e4c', '#2e99b0', '#3a0088'];
let emojiArray = ['💖', '✨', '🧑🏻‍💻', '🎉', '🎈', '🎏', '🗼', '🌸', '🗼', '🍑', '🗽'];

//events
window.addEventListener('mousemove', function(e) {
	mouse.x = e.clientX,
	mouse.y = e.clientY
});

window.addEventListener('resize', resizeDetect);


//utility functions
function resizeDetect () {
	windowSize.w = window.innerWidth;
	windowSize.h = document.body.scrollHeight;
	ballSize.min = Math.round(windowSize.w / 10 - 150);
	ballSize.max = Math.round(windowSize.w / 10 + 100);
  }
  
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function Ball(x, y, z, dx, dy, radius, fontSize) {
	let el = document.createElement('div');
	var emoji = document.createTextNode( emojiArray[randomIntFromRange(0, emojiArray.length - 1)] );
	el.appendChild(emoji);
	this.fontSize = fontSize,
	this.x = x,
	this.y = y,
	this.z = z,
	this.dx = dx,
	this.dy = dy,
	this.radius = radius,
	this.update = function() {
		if (this.y + this.radius + this.dy > windowSize.h) {
			this.dy = -this.dy * friction;
		} else {
			this.dy += gravity; 
		}
		if (this.x + this.radius> windowSize.w || this.x <= 0) {
			this.dx = -this.dx;
		}
		
		this.x += this.dx;
		this.y += this.dy;
		el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
	},
	this.draw = function() {
		el.style.fontSize = this.fontSize + 'vw';
		el.className = 'ball';
		ctx.appendChild(el); 
		el.style.width = this.radius;
		el.style.height = this.radius;
		el.style.zIndex = z;
		el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
	}
}
//ball Object
var ball;
var ballArray = [];

var createEls = function(click) {
	if (click) {
		makeBalls = 1;
	} else {
		// ballArray = [];
		makeBalls = numBalls;
	}
	for (let i = 0; i < makeBalls; i++) {
		var radius = randomIntFromRange(ballSize.min, ballSize.max);
		var z = randomIntFromRange(1, numBalls);
		var fontSize = randomIntFromRange(5, 11);
		if (click) {
			var x = mouse.x - radius;
			var y = mouse.y - radius;
		} else {
			var x = randomIntFromRange(0, windowSize.w - radius);
			var y = randomIntFromRange(0, windowSize.h - radius);
		}
		let dx = randomIntFromRange(-speed, speed);
		let dy = randomIntFromRange(-speed, speed);
		// var dx = speed;
		// var dy = speed;
		ballArray.push(new Ball(x, y, z, dx, dy, radius, fontSize));
		ballArray[i].draw();
	}
}

function animate() {
	// requestAnimationFrame(animate);
	for (let i = 0; i < ballArray.length; i++) {
		ballArray[i].update();
	} 
}

// window.addEventListener('click', function(){
// 	createEls(true);
// }, false);

const animationInterval = setInterval(function(){
	requestAnimationFrame(animate);
}, 10);

setTimeout(() => {
	clearInterval(animationInterval);

	// Fade out all emoji balls
	document.querySelectorAll('.ball').forEach(ball => {
		ball.style.transition = 'opacity 1s ease-out';
		// ball.style.opacity = '0.2';  // or '0' to fully hide
	});

	// Lighten the background of <div class="wrapper">
	const mainWrapper = document.querySelector('.wrapper');
	if (mainWrapper) {
		mainWrapper.style.transition = 'background-color 1s ease-out';
		mainWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
	}
}, 5000);


resizeDetect();
createEls(false);

// console.log(ballArray);

//debug
const sliderOpacity = document.querySelector("#sliderOpacity");
const img = document.querySelector("#world");

if (sliderOpacity && img) {
	sliderOpacity.addEventListener('input', function(){
	  img.style.opacity = (sliderOpacity.value)/200;
	// I divide by 100 because "opacity" takes a value between 0 and 1.
	});
}

});