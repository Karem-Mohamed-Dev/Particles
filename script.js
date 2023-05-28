const count = document.getElementById("count");
const space = document.getElementById("space");
const minSize = document.getElementById("minSize");
const maxSize = document.getElementById("maxSize");
const moveSpeed = document.getElementById("moveSpeed");
const apply = document.getElementById("apply");
const controls = document.getElementById("controls");
console.log(controls.clientHeight)

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
console.log(ctx);
let particlesArr = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.height = `calc(100vh - ${controls.clientHeight}px)`

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.height = `calc(100vh - ${controls.clientHeight}px)`
});

const mouse = {
  x: null,
  y: null,
  // radius: 0,
  radius: 100,
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x + 0;
  mouse.y = e.y - 70;
  // mouse.radius = (canvas.width / 80) * (canvas.height / 80);
  // setTimeout(() => {
  //   mouse.radius = 0;
  // }, 100);
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Number(Math.random() * maxSize.value + minSize.value);
    this.speedX = Math.random() * moveSpeed.value - moveSpeed.value / 2;
    this.speedY = Math.random() * moveSpeed.value - moveSpeed.value / 2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width) {
        this.x += moveSpeed.value * 4;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= moveSpeed.value * 4;
      }
      if (mouse.x < this.y && this.y < canvas.height) {
        this.y += moveSpeed.value * 4;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= moveSpeed.value * 4;
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  particlesArr = [];
  for (let i = 0; i < count.value; i++) {
    particlesArr.push(new Particle());
  }
}
init();
function render() {
  for (let i = 0; i < particlesArr.length; i++) {
    particlesArr[i].draw();
    particlesArr[i].update();

    for (let j = i; j < particlesArr.length; j++) {
      const a = particlesArr[i].x - particlesArr[j].x;
      const b = particlesArr[i].y - particlesArr[j].y;
      const distance = Math.sqrt(a * a + b * b);
      if (distance < space.value) {
        ctx.beginPath();
        ctx.moveTo(particlesArr[i].x, particlesArr[i].y);
        ctx.lineTo(particlesArr[j].x, particlesArr[j].y);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 0.2;
        ctx.stroke();
      }
    }

    if (particlesArr[i].size < 0.3) {
      particlesArr.splice(i, 1);
      i--;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  render();
  requestAnimationFrame(animate);
}
animate();

apply.addEventListener("click", () => {
  init();
});
