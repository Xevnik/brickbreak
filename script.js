function GameBoard() {
  this.canvas = document.getElementById("gameBoard");
  this.ctx = this.canvas.getContext("2d");
  this.paddle;
  this.ball;
  this.bricks = [];
}
GameBoard.prototype.drawAll = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ball.draw();
};
GameBoard.prototype.initialize = function () {
    this.ball = new Ball(this);

};
GameBoard.prototype.start = function() {
    setInterval(this.drawAll.bind(this), 10);
};






function Ball(GameBoard) {
  this.board = GameBoard;
  //Ball starting positiion
  this.x = this.board.canvas.width / 2;
  this.y = this.board.canvas.height - 30;
  //Ball starting speed
  this.dx = 2;
  this.dy = -2;
  this.radius = 10;
  this.color = "#0095DD";
}

Ball.prototype.draw = function() {
  this.board.ctx.beginPath();
  this.board.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
  this.board.ctx.fillStyle = this.color;
  this.board.ctx.fill();
  this.board.ctx.closePath();

  this.move();
};

Ball.prototype.move = function() {
  if(this.x + this.dx > this.board.canvas.width - this.radius || this.x + this.dx < this.radius) {
    this.dx = -(this.dx);
  }

  if(this.y + this.dy > this.board.canvas.height - this.radius || this.y + this.dy < this.radius) {
    this.dy =  -(this.dy);
  }

  this.x += this.dx;
  this.y += this.dy;
};

function Paddle() {

}

function Brick() {

}

var game;
document.addEventListener("DOMContentLoaded", function(event) {
  game = new GameBoard();
  game.initialize();
  game.start();
});
