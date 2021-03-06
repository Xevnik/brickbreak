function GameBoard() {
    var board = this;
    var score = 0;
    board.canvas = document.getElementById("gameBoard");
    board.ctx = board.canvas.getContext("2d");
    board.paddle = null;
    board.ball = null;
    board.brickRowCount = 6;
    board.brickColCount = 5;
    board.bricks = [];
    board.getScore = function () {
      return score;
    };
    board.increaseScore = function () {
      score++;
    };
    board.drawScore = function () {
      board.ctx.font = "16px Arial";
      board.ctx.fillStyle = "0095DD";
      board.ctx.fillText("Score: " + board.getScore(), 8, 20);
    };
    //creates bricks and sets their location
    board.createBricks = function() {
        var brick;
        for (var r = 0; r < board.brickRowCount; r++) {
            for (var c = 0; c < board.brickColCount; c++) {
                brick = new Brick(board);
                brick.x = (r * (brick.width + brick.padding) + brick.offsetLeft);
                brick.y = (c * (brick.height + brick.padding) + brick.offsetTop);
                board.bricks.push(brick);
            }
        }
    };

    board.drawAll = function() {
        board.ctx.clearRect(0, 0, board.canvas.width, board.canvas.height);
        board.drawScore();
        board.ball.draw();
        board.paddle.draw();
        board.bricks.forEach(function(brick, i) {
            brick.detectCollision(board);
            brick.draw();
        });

        requestAnimationFrame(board.drawAll);
    };

    board.start = function() {
        board.ball = new Ball(board);
        board.paddle = new Paddle(board);
        board.createBricks();
        board.drawAll();
    };
}

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

Ball.prototype.changeVelocityX = function(velocity) {
    if (velocity === 'reverse') {
        this.dx = -this.dx;
    } else if (this.dx < 0) {
        this.dx -= velocity;
    } else {
        this.dx += velocity;
    }
};

Ball.prototype.changeVelocityY = function(velocity) {
    if (velocity === 'reverse') {
        this.dy = -this.dy;
    } else if (this.dy < 0) {
        this.dy -= velocity;
    } else {
        this.dy += velocity;
    }
};

/**
 * Move Ball by incrementing X- & Y-coordinates by dx & dy
 **/
Ball.prototype.move = function() {
    //Detects collision of left/right wall
    if (this.x + this.dx > this.board.canvas.width - this.radius || this.x + this.dx < this.radius) {
        this.changeVelocityX('reverse');
    }
    //Detects collision of top wall
    if (this.y + this.dy < this.radius) {
        this.changeVelocityY('reverse');
        //Ball will be placed beyond bottom wall
    } else if (this.y + this.dy > this.board.canvas.height - this.radius) {
        if (this.x >= this.board.paddle.x && this.x <= (this.board.paddle.x + this.board.paddle.width)) {
            this.changeVelocityY('reverse');
            this.changeVelocityY(0.15);
        } else {
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

Brick.prototype.detectCollision = function(board) {
    var ball = this.board.ball;
    var brick = this;
    if (!brick.hit) {
        if ((ball.x >= brick.x) && (ball.x <= brick.x + brick.width) && (ball.y > brick.y) && (ball.y < brick.y + brick.height)) {
            ball.dy = -(ball.dy);
            brick.hit = true;
            board.increaseScore();
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
