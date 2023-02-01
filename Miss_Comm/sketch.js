var rockets = [];
var obstacles = [];
let count = 0;
let score = 0;
let health = 100;
let difficulty = 1;
let diffCAP = 20;


function setup() {
   createCanvas(1000, 700);
   spawnRocket();
   spawnObstacle();
   let btn = document.createElement("button");
    btn.innerHTML = "Title Screen";
    btn.className = "glow-on-hover";
    btn.onclick = function() {
      location.href = "./intro.html";
    }
    document.body.appendChild(btn);
}

function draw() {

  //------------------
  background(52);
  if (count%200 == 0) {
    for (let i = 0; i < difficulty; i++) {
      spawnObstacle();
    }
  }
  for (let i =0; i<rockets.length; i++) {
    rockets[i].update();
    rockets[i].show();
  }
  for (let j = 0; j<obstacles.length; j++) {
    obstacles[j].update();
    obstacles[j].show();
  }
  checkCollisions();
  displayScore();
  displayHealth();
  checkPos();
  checkScore();
  count++;
}

function resetGame() {
  obstacles = [];
  rockets = [];
  score = 0;
  health = 100;
  difficulty = 1;
  diffCAP = 20;
  spawnRocket();
  spawnObstacle();
}

function checkScore() {
  if (score == diffCAP) {
    difficulty++;
    diffCAP *= 2;
  } 
}

function displayScore() {
  textSize(48);
  text("" + score, width/2, 50);
}

function displayHealth() {
  textSize(24);
  fill(255, 150);
  text("Current Health: " + health, 25, height-25);
}

function checkCollisions() {
  for (let i = 0; i<rockets.length; i++) {
    var rocVec = rockets[i].checkPos();
    for (let j = 0; j<obstacles.length; j++) {
      var obsVec = obstacles[j].checkPos();
      if (Math.abs(rocVec.x - obsVec.x) <= obstacles[j].getSize()) {
        if (Math.abs(rocVec.y - obsVec.y) <= 10) {
          console.log("x:" + obsVec.x + ", y:" + obsVec.y);
          score++;
          rockets.splice(i, 1);
          obstacles.splice(j, 1);
          console.log(score);
        }
      }
    }
  }
}

window.addEventListener('keydown', function(event) {
  const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
  if (key == "ArrowRight") {
    turnLeft();
  }
  if (key == "ArrowLeft") {
    turnRight();
  }
  if (key == "ArrowUp") {
    thrust();
  } 
  if (key == "ArrowDown") {
    brake();
  }
  if (key == " ") {
    spawnRocket();
  }
}); 

function checkPos() {
  for (let i=0; i<rockets.length; i++) {
    var vec1 = rockets[i].checkPos();
    if ((vec1.x > width || vec1.x < 0) || (vec1.y > height || vec1.y < 0)) {
      rockets.splice(i,1);
    }
  }
  for (let j=0; j<obstacles.length; j++) {
    var vec2 = obstacles[j].checkPos();
    if ((vec2.x > width || vec2.x < 0) || (vec2.y > height || vec2.y < 0)) {
      obstacles.splice(j,1);
      health -= 10;
      if (health == 0) {
        alert("You ran out of health!\nYour final score: " + score);
        window.stop();
        resetGame();
      }
    }
  }
}

function spawnRocket() {
  var rocket = new Rocket();
  rockets.push(rocket);
}

function spawnObstacle() {
  var obs = new Obstacle();
  obstacles.push(obs);
}

function thrust() {
  for (let i =0; i<rockets.length; i++) {
    var vectForward = createVector(0, -2);
    rockets[i].applyForce(vectForward);
  }
}

function brake() {
  for (let i=0; i<rockets.length; i++) {
    var vectB = createVector(0, 2);
    rockets[i].applyForce(vectB);
  }
}

function turnLeft() {
  for (let i =0; i<rockets.length; i++) {
    var vectLeft = createVector(2, 0);
    rockets[i].applyForce(vectLeft);
  }
}

function turnRight() {
  for (let i =0; i<rockets.length; i++) {
    var vectRight = createVector(-2, 0);
    rockets[i].applyForce(vectRight);
  }
}

function Rocket() {
  this.pos = createVector(width/2, height);
  this.vel = createVector(0, -1);
  this.acc = createVector();

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.show = function() {
    push();
    fill("rgb(200, 80, 80)");
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    rectMode(CENTER);
    rect(0, 0, 25, 5);
    pop();
  }

  this.checkPos = function() {
    return this.pos;
  }

}

function Obstacle() {
  this.pos = createVector(random(10, width-10), 0);
  this.vel = createVector(0, random(0.5, 1.5));
  this.acc = createVector();
  this.size = random(10, 30);

  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.show = function () {
    push();
    fill(255);
    triangle(this.pos.x-this.size, this.pos.y-this.size, this.pos.x+this.size, this.pos.y-this.size, this.pos.x, this.pos.y+this.size);
    pop();
  }

  this.checkPos = function() {
    return this.pos;
  }

  this.getSize = function() {
    return this.size;
  }
}