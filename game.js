var game = {
    debug_mode: false,
    width: 1280,
    height: 720,
    ctx: undefined,
    platform: undefined,
    ball: undefined,
    rows: 0,
    cols: 0,
    running: true,
    score: 0,
    blocks: [],
    sprites: {
        background: undefined,
        platform: undefined,
        ball: undefined,
        block: undefined,
    },
    init: function () {
        var canvas = document.getElementById('mycanvas');
        this.ctx = canvas.getContext("2d"); // при вызове this ссылается на стоящий слева объект
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "#FFFFFF";
        
        window.addEventListener("keydown", function (e) {
            if (e.keyCode == 37) {
                game.platform.dx = -game.platform.velocity;
            }
            else if (e.keyCode == 39) {
                game.platform.dx = game.platform.velocity;
            }
            else if (e.keyCode == 32) {
                game.platform.releaseBall();
            }
            else if (e.keyCode == 38) {
                game.debug_mode = true;
            }

        });
        window.addEventListener("keyup", function (e) {
            game.platform.stop();
        });
    },
    load: function () {
        for (var key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = "images/" + key + ".png";
        }
    },
    create: function () {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                this.blocks.push({
                    x: 70 * col + 50,
                    y: 40 * row + 35,
                    width: 64,
                    height: 32,
                    isAlive: true
                });
            }
        }
    },
    start: function (rowen,columen,ball_velocity) {
        this.rows = rowen;
        this.cols = columen;
        game.ball.velocity = ball_velocity;
        this.init();
        this.load();
        this.create();
        this.run();
    },
    render: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        //this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
        this.ctx.drawImage(this.sprites.ball, this.ball.width * this.ball.frame, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
        this.blocks.forEach(function (element) {
            if (element.isAlive) {
                this.ctx.drawImage(this.sprites.block, element.x, element.y);
            }
        }, this);
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(20, 20, this.width - 40, this.height - 40);
        this.ctx.strokeStyle = 'green';
        this.ctx.fillText("SCORE:" + this.score, 25, this.height - 25);
    },
    update: function () {
        if (this.ball.collide(this.platform)) {
            this.ball.bumpPlatform(this.platform);
        }
        if (this.platform.dx) {
            this.platform.move();
        }
        if (this.ball.dx || this.ball.dy) {
            this.ball.move();
        }
        this.blocks.forEach(function (element) {
            if (element.isAlive) {
                if (this.ball.collide(element)) {
                    this.ball.bumpBlock(element);
                }
            }
        }, this);
        this.ball.checkBounds();
        
    },
    run: function () {
        this.update();
        this.render();
        if(this.debug_mode){
            console.log(game.ball.dx, game.ball.dy);

        }

        if (this.running){
            window.requestAnimationFrame(function () {
                // setTimeout(function () {  game.run(); }, 50);
                game.run();
            });
        }
        
    },
    over: function (message) {
        alert(message);
        this.running = false;
        window.location.reload();
    }

};
game.ball = {
    width: 22,
    height: 22,
    frame: 0,
    x: 640,
    y: 578,
    dx: 0,
    dy: 0,
    velocity:0,
    jump: function () {
        this.dy = -this.velocity;
        this.dx = -this.velocity;
        this.animate();
    },
    animate: function(){
        setInterval(function(){
            ++game.ball.frame;
            if (game.ball.frame > 3) {
                game.ball.frame = 0;
            }
        },100);
        
    },
    move: function () {
        this.x += this.dx;
        this.y += this.dy;
    },
    collide: function (element) {
        var x = this.x + this.dx;
        var y = this.y + this.dy;

        if (x + this.width > element.x &&
            x < element.x + element.width &&
            y + this.height > element.y &&
            y < element.y + element.height
        ) {
            plays1();
            return true;
        }
        return false;
    },
    bumpBlock: function (block) {
        this.dy *= -1;
        block.isAlive = false;
        ++game.score;
        if(game.score>= game.blocks.length){
            game.over("You win");
        }
    },
    onTheLeftSide: function(platform){
        return (this.x + this.width/2) < (platform.x + platform.width/2)
    },
    bumpPlatform: function (platform) {
        this.dy = -this.velocity;
        this.dx = this.onTheLeftSide(platform) ? -this.velocity: this.velocity;
    },
    checkBounds: function () {
        var x = this.x + this.dx;
        var y = this.y + this.dy;

        if (x < 20) {
            this.x = 20;
            this.dx = this.velocity;
        } else if (x + this.width > game.width - 20) {
            this.x = game.width - this.width - 20;
            this.dx = -this.velocity;
        } else if (y < 20) {
            this.y = 20;
            this.dy = this.velocity;
        } else if (y + this.height > game.height) {
            //game over
            game.over("You lose");
        }
    }
}


// 
game.platform = {
    x: 600,
    y: 600,
    velocity: 8,
    dx: 0,
    ball: game.ball,
    width: 104,
    height: 24,
    releaseBall: function () {
        if (this.ball) {
            this.ball.jump();
            this.ball = false;
        }
    },
    // ссылка на объект ball 
    move: function () {
        this.x += this.dx;

        if (this.ball) {
            this.ball.x += this.dx;
        }

    },
    stop: function () {
        this.dx = 0;

        if (this.ball) {
            this.ball.dx = 0;
        }
    }
};

window.addEventListener("load", function () {
    game.start(8,7,5);
});


function plays1() { var snd = new Audio("sfx_laser1.ogg"); snd.preload = "auto"; snd.play(); }
