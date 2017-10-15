// Global variables
var radians = 0; // Stores the see-saw angle in radians
var player; // Stores the see-saw object (so we can update it anywhere!)

// Connect to the socket server Node.js is hosting
var socket = io.connect('http://localhost:8080');

// Listen out for new angles sent via. sockets and update the radians variable
socket.on('angle', function (degrees) {
  radians = getRadians(degrees); 
  console.log(degrees);
});

// Initialise Phaser.io game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser', { create: create, update: update });

function create() {
  // Setup game stage
  game.stage.backgroundColor = "#EEE";
  game.stage.disableVisibilityChange = true;

  // Start game physics
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;
  game.physics.p2.gravity.y = 200;

  // Draw sorting area
  var blueArea = game.add.graphics(0, 200);
  blueArea.beginFill(0xd6b4c0);
  blueArea.drawRect(0, 0, 400, 400);

  var redArea = game.add.graphics(400, 200);
  redArea.beginFill(0xDEE7EF);
  redArea.drawRect(0, 0, 400, 400);

  var dividingLine = game.add.graphics(400, 400);
  dividingLine.beginFill(0x444444);
  dividingLine.drawRect(-4, -200, 4, 400);
  game.physics.p2.enable(dividingLine);
  dividingLine.body.static  = true;
  
  // Add see-saw (to global variable)
  player = game.add.graphics(400, 200);
  player.beginFill(0x333333);
  player.drawRect(-200, -10, 400, 20);
  game.physics.p2.enable(player);
  player.body.collideWorldBounds = true;
  player.body.static  = true;
  
  // Every 3 seconds...
  setInterval(function() {

    // Create graphics to draw ball on
    var ball = game.add.graphics(400, 30);

    // 50/50 chance. Blue or red.
    if (Math.random() > 0.5) {
      ball.beginFill(0xCE0000);
    } else {
      ball.beginFill(0x000063);
    }

    // Draw the ball
    ball.drawCircle(0, 0, 50);
    
    // Enable and configure physics on the ball
    game.physics.p2.enable(ball);
    ball.body.collideWorldBounds = true;

  }, 3000);

}

// This 'update' function is run by Phaser roughly 60 times/second.
function update() {
  // Update the see-saw rotation to match the global variable
  player.body.rotation = radians;
}

// A handy function to convert degrees to radians
function getRadians(angle) {
  return angle * (Math.PI / 180);
}