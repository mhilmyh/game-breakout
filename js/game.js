var canvas = document.getElementById("Canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// fungsi resize
window.addEventListener('resize', canvasResize, false);
function canvasResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

var context = canvas.getContext("2d");

var score = 0;

// ball information
var speedBall = 2;
var x = canvas.width/2;
var y = canvas.height-32;
var dx = speedBall;
var dy = -speedBall;
var ballRadius = 8;

// paddle information
var paddleHeight = 8;
var paddleWidth = 48;
var paddleX = (canvas.width-paddleWidth)/2;

// button information
var kiriPress = false;
var kananPress = false;

// bricks information
var brickRowCount = 3;
var brickColumnCount = 4;
var brickWidth = canvas.width/(brickColumnCount+1);
var brickHeight = 16;
var brickPadding = 8;
var brickOffsetTop = 16;
var brickOffsetLeft = brickWidth/2;
var brickX = 0;
var brickY = 0;

var bricks = [];
for(var r = 0; r<brickRowCount; r++) {
    bricks[r] = [];
    for(var c = 0; c<brickColumnCount; c++) {
        bricks[r][c] = { x:0 , y:0 , ada : true };
    }
}

function draw() {
    // reset canvas
    context.clearRect(0,0,canvas.width,canvas.height);

    drawScore();
    drawBall();
    drawPaddle();
    drawBricks();
    cekHit();

    // saat tabrakan dengan dinding
    if( x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    }
    if( y + dy < ballRadius ) {
        dy = -dy;
    }
    else if( y + dy > canvas.height - ballRadius) {
        if( paddleX < x && paddleX + paddleWidth > x) {
            dy = -dy;
        }
        else {
            alert("Selesai");
            document.location.reload(); // muat ulang
            clearInterval(interval);    // untuk chrome
        }
    }

    // tombol
    if(kananPress && paddleX < canvas.width-paddleWidth) {
        paddleX += 4;
    }
    else if (kiriPress && paddleX > 0) {
        paddleX -= 4;
    }

    // pergerakan bola
    x += dx;
    y += dy;
}

function drawBall() {
    // gambar bola
    context.beginPath();
    context.arc(x,y,ballRadius,0,Math.PI*2);
    context.fillStyle = "#6dc43a";
    context.fill();
    context.closePath();
}

function drawPaddle() {
    // gambar paddle
    context.beginPath();
    context.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
    context.fillStyle = "#6dc43a"
    context.fill();
    context.closePath();
}

function drawBricks() {
    // gambar bricks
    for(var r = 0; r<brickRowCount; r++) {
        for(var c = 0; c<brickColumnCount; c++) {
            if( bricks[r][c].ada ) {
                brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
                brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;

                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;

                context.beginPath();
                context.rect(brickX,brickY,brickWidth,brickHeight);
                context.fillStyle = "#6dc43a";
                context.fill();
                context.closePath();
            }
        }
    }
}

function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "#6dc43a";
    context.fillText("Score: "+score, 8, 20);
}

function cekHit() {
    // saat bola menyentuh bricks
    for(var c = 0; c<brickColumnCount; c++) {
        for(var r = 0; r<brickRowCount; r++) {
            var brick = bricks[r][c];
            if( brick.ada ) {
                if(brick.x < x && brick.x+brickWidth > x && brick.y+brickHeight > y && brick.y  < y) {
                    dy = -dy;
                    bricks[r][c].ada = false;
                    score++;

                    if(score == brickRowCount * brickColumnCount ) {
                        alert("Selamat, anda menang !");
                        document.location.reload();         // muat ulang
                        clearInterval(interval);            // untuk browser chrome
                    }
                }
            }
        }
    }
}

function keyDownHandler(k) {
    if(k.key == "Right" || k.key == "ArrowRight") {
        kananPress = true;
    }
    else if(k.key == "Left" || k.key == "ArrowLeft") {
        kiriPress = true;
    }
}

function keyUpHandler(k) {
    if(k.key == "Right" || k.key == "ArrowRight") {
        kananPress = false;
    }
    else if(k.key == "Left" || k.key == "ArrowLeft") {
        kiriPress = false;
    }
}

// handle button
document.addEventListener("keydown", keyDownHandler , false);
document.addEventListener("keyup", keyUpHandler , false);

// menggambar sprite setiap 10 millisecond
var interval = setInterval(draw, 10);