function GameBoard() {
    this.canvas = document.getElementById("gameBoard");
    this.ctx = this.canvas.getContext("2d");
    this.paddle = null;
    this.ball = null;
    this.brickRowCount = 6;
    this.brickColCount = 5;
    this.bricks = [];
}
GameBoard.prototype.createBricks = function() {
    var self = this;
    var brick;
    for (var r = 0; r < this.brickRowCount; r++) {
        for (var c = 0; c < this.brickColCount; c++) {
            brick = new Brick(self);
            brick.x = (r * (brick.width + brick.padding) + brick.offsetLeft);
            brick.y = (c * (brick.height + brick.padding) + brick.offsetTop);
            self.bricks.push(brick);
        }
    }
};

GameBoard.prototype.drawAll = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ball.draw();
    this.paddle.draw();
    this.bricks.forEach(function(brick, i) {
        brick.detectCollision();
        brick.draw();
    });
};

GameBoard.prototype.start = function() {
    this.ball = new Ball(this);
    this.paddle = new Paddle(this);
    this.createBricks();
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
    this.board.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.board.ctx.fillStyle = this.color;
    this.board.ctx.fill();
    this.board.ctx.closePath();

    this.move();
};

Ball.prototype.move = function() {
    if (this.x + this.dx > this.board.canvas.width - this.radius || this.x + this.dx < this.radius) {
        this.dx = -(this.dx);
    }

    if (this.y + this.dy < this.radius) {
        this.dy = -(this.dy);
    } else if (this.y + this.dy > this.board.canvas.height - this.radius) {
        if (this.x > this.board.paddle.x && this.x < this.board.paddle.x + this.board.paddle.width) {
            this.dy = -(this.dy);
        } else {
            alert("Game Over");
            document.location.reload();
        }
    }

    this.x += this.dx;
    this.y += this.dy;
};

function Paddle(gameBoard) {
    this.board = gameBoard;
    this.height = 10;
    this.width = 75;
    this.x = (this.board.canvas.width - this.width) / 2;
    this.color = "#0095DD";
    this.dx = 7;
    this.rightPressed = this.leftPressed = false;

}

Paddle.prototype.draw = function() {
    this.board.ctx.beginPath();
    this.board.ctx.rect(this.x, this.board.canvas.height - this.height, this.width, this.height);
    this.board.ctx.fillStyle = this.color;
    this.board.ctx.fill();
    this.board.ctx.closePath();
    this.move();
};

Paddle.prototype.move = function() {
    //go right
    if (this.rightPressed && this.x < (this.board.canvas.width - this.width)) {
        this.x += this.dx;
    }
    //go left
    if (this.leftPressed && this.x > 0) {
        this.x -= this.dx;
    }
};



function Brick(gameBoard) {
    this.board = gameBoard;
    this.x = 0;
    this.y = 0;
    this.width = 75;
    this.height = 20;
    this.color = "0095DD";
    this.padding = 10;
    this.offsetTop = 30;
    this.offsetLeft = 30;
    this.hit = false;
}

Brick.prototype.draw = function() {
    if (this.hit) {
        return false;
    }
    this.board.ctx.beginPath();
    this.board.ctx.rect(this.x, this.y, this.width, this.height);
    this.board.ctx.fillStyle = this.color;
    this.board.ctx.fill();
    this.board.ctx.closePath();
};

Brick.prototype.detectCollision = function() {
    var ball = this.board.ball;
    var brick = this;
    if (!brick.hit) {
        if ((ball.x > brick.x) && (ball.x < brick.x + brick.width) && (ball.y > brick.y) && (ball.y < brick.y + brick.height)) {
            ball.dy = -(ball.dy+1);
            brick.hit = true;
        }
    }
};

var game;

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        game.paddle.rightPressed = true;
    } else if (e.keyCode == 37) {
        game.paddle.leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        game.paddle.rightPressed = false;
    } else if (e.keyCode == 37) {
        game.paddle.leftPressed = false;
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    game = new GameBoard();
    game.start();
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
});
