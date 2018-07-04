// Объект кнопки
function Button(x, y, w, h, state, image, text,level) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.state = state;
    this.imageShift = 0;
    this.image = image;
    this.text = text;
    this.level = level;
}
function plays1() { var snd = new Audio("sfx_laser1.ogg"); snd.preload = "auto"; snd.play(); }
// Получаем положение курсора мыши
var game = {
    debug_mode: false,
    width: 1280,
    height: 720,
    ctx: undefined,
    platform: undefined,
    ball: undefined,
    rows: 0,
    cols: 0,
    running: false,
    score: 0,
    blocks: [],
    buttons: [],
    power_ups_count: undefined,
    // power_ups: {
    //     platform_function: "",
    //     slow_ball_function: "",
    //     two_balls: ""
    // },
    sprites: {
        background: undefined,
        platform: undefined,
        ball: undefined,
        block_red: undefined,
        block_green: undefined
    },
    drawButton: function (button) {// сделать функцией отображения меню. (фон меню + кнопки уровней)
        this.ctx.drawImage(button.image, 0, button.imageShift, button.w, button.h, button.x, button.y, button.w, button.h);
        //this.ctx.drawImage(button.image, button.x, button.y, button.w, button.h);
        this.ctx.fillText(button.text, button.x + button.w / 2.7, 5 + button.y + button.h / 2);
    },
    menulisten: function(){

    },
    init: function () {
        // вынести как глобальную для объекта
        var canvas = document.getElementById('mycanvas');
        this.ctx = canvas.getContext("2d"); // при вызове this ссылается на стоящий слева объект
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = '#FFCE00';
        // Сделаем загрузку. 
        this.load();
        // Выводим все кнопки
        setTimeout(function () {
            game.ctx.drawImage(game.sprites.background, 0, 0);
            for (var ib = 0; ib < game.buttons.length; ib++) {
                game.drawButton(game.buttons[ib]);
            }
            game.ctx.fillText("CHOOSE LEVEL", 500, 255);
        }, 2000);
        game.start(4, 10, 4 + game.buttons[0].level, 4);
        // собрать данные и стартовать игру. - в зависимости от на
        // Обработчик события Onmousedown
        // canvas.onmousedown = function (e) {
        //     var mouse = getMousePosition(e).sub(new vector2d(canvas.offsetLeft, canvas.offsetTop));
        //     for (var i = 0; i < game.buttons.length; i++) { // Применяем состояние 'pressed' для кнопки
        //         if (mouse.x > game.buttons[i].x && mouse.x < game.buttons[i].x + game.buttons[i].w && mouse.y > game.buttons[i].y && mouse.y < game.buttons[i].y + game.buttons[i].h) {
        //             console.log('button_press_succesfull');
        //             this.running = true;
        //             game.start(4, 10, 4 + game.buttons[i].level,4);
        //             // game.buttons[i].state = 'pressed';
        //             // game.buttons[i].imageShift = 68;
        //         }
        //     }
        // }
       
        // // Оработчик события Onmouseup
        // canvas.onmouseup = function (e) {
        //     var mouse = getMousePosition(e).sub(new vector2d(canvas.offsetLeft, canvas.offsetTop));

        //     for (var i = 0; i < this.buttons.length; i++) { // Сброс состояний кнопки
        //         if (mouse.x > this.buttons[i].x && mouse.x < this.buttons[i].x + this.buttons[i].w && mouse.y > this.buttons[i].y && mouse.y < this.buttons[i].y + this.buttons[i].h) {
        //             alert(this.buttons[i].text + ' нажата.');
        //         }
        //         console.log('button_unpress');
        //         this.buttons[i].state = 'normal';
        //         this.buttons[i].imageShift = 0;
        //     }
        // }
    },

    load: function () {
        var buttonImage = new Image();
        buttonImage.src = "images/button.png";
        buttonImage.onload = function () {
            // загружать пока не загрузим
        };

        this.buttons.push(new Button(480, 300, 222, 39, 'normal', buttonImage, 'Easy',1));
        this.buttons.push(new Button(480, 380, 222, 39, 'normal', buttonImage, 'Medium',2));
        this.buttons.push(new Button(480, 460, 222, 39, 'normal', buttonImage, 'Hard', 5));

        for (var key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = "images/" + key + ".png";
        }
    },
    create: function () {
        // прецизионный генератор случайных чисел для генерации объектов в игре 
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                // using power_ups_count - set is block got power up or not. 
                this.blocks.push({
                    x: 70 * col + 50,
                    y: 40 * row + 35,
                    width: 64,
                    height: 32,
                    isAlive: true,
                    // power_ups.function.    
                });
            }
        }
    },
    start: function (rowen, columen, ball_velocity, power_up) {

        this.rows = rowen;
        this.cols = columen;
        this.power_ups_count = power_up;
        game.ball.velocity = ball_velocity;

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
                
                game.BigPlatform();
            }
        });
        // delete all mouse event listener 
        window.addEventListener("keyup", function (e) {
            game.platform.stop();
        });
        this.ctx.fillStyle = "#FFFFFF";
        this.running = true;
        this.create();
        this.run();
    },
    render: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.ctx.drawImage(this.sprites.ball, this.ball.width * this.ball.frame, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
        this.blocks.forEach(function (element) {
            if (element.isAlive) {
                this.ctx.drawImage(this.sprites.block_red, element.x, element.y);
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
                    if (this.ball.on_the_side == true) {
                        console.log('on the side');
                        this.ball.on_the_side = false;
                        this.ball.bumpBlockBySide(element);
                    } else {
                        this.ball.bumpBlock(element);
                    }

                }
            }
        }, this);
        this.ball.checkBounds();
    },
    run: function () {
        this.update();
        this.render();
        if (this.debug_mode) {
            console.log(game.ball.dx, game.ball.dy);
        }
        if (this.running) {
            window.requestAnimationFrame(function () {
                // setTimeout(function () {  game.run(); }, 50);
                game.run();
            });
        }
    },
    over: function (message) {
        alert(message);
        // delete all event listeners.
        this.running = false;
        window.location.reload();
    },
    SlowBall: function(){
        var cur_Velocity = this.ball.velocity;
        this.ball.velocity = cur_Velocity - 3;
        setTimeout(function () {
            game.ball.velocity = game.ball.velocity + 3;
        }, 10000);
    },
    BigPlatform: function(){
        this.platform.width = this.platform.width * 2;
        setTimeout(function () {
            game.platform.width = game.platform.width / 2;
            console.log('not good deal');
        }, 10000);
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
    on_the_side: false,
    velocity: 0,
    jump: function () {
        this.dy = -this.velocity;
        this.dx = -this.velocity;
        this.animate();
    },
    animate: function () {
        setInterval(function () {
            ++game.ball.frame;
            if (game.ball.frame > 3) {
                game.ball.frame = 0;
            }
        }, 100);

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
            if (((y + this.height + 10) < (element.y + element.height)) && (y + 10 > element.y)) {
                this.on_the_side = true;
            }
            plays1();
            return true;
        }
        return false;
    },
    bumpBlock: function (block) {
        this.dy *= -1;
        block.isAlive = false;
        ++game.score;
        if (game.score >= game.blocks.length) {
            game.over("You win");
        }
    },
    bumpBlockBySide: function (block) {
        this.dx *= -1;
        block.isAlive = false;
        ++game.score;
        if (game.score >= game.blocks.length) {
            game.over("You win");
        }
    },
    onTheLeftSide: function (platform) {
        return (this.x + this.width / 2) < (platform.x + platform.width / 2)
    },
    bumpPlatform: function (platform) {
        this.dy = -this.velocity;
        this.dx = this.onTheLeftSide(platform) ? -this.velocity : this.velocity;
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
    game.init();
    // game.start(8, 17, 5);
});
