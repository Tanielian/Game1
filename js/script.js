var canvas = document.getElementById("myCanvas"); //this is the canvas variable 
    var ctx = canvas.getContext("2d");// to draw the canvas on the screen
    var ballRadius = 5;// this is the ball radius
    var x = canvas.width/2; //the x coordination on the screen, which is half of the enitre width
    var y = canvas.height-30;//the y coordination on the screen, which is half of the enitre height
    var dx = 2; 
    var dy = -2;
    var paddleHeight = 10; //the height of the paddle in pixels
    var paddleWidth = 75;// the wifdth of the paddle in pixels
    var paddleX = (canvas.width-paddleWidth)/2; //the position of the paddle on the screen
    var rightPressed = false;//right pressed indicates whether the right arrow on the keyboard is pressed or not
    var leftPressed = false;//left pressed indicates whether the left arrow on the keyboard is pressed or not
    var brickColCount = 9;// a variable indicates the number of the brick columns
    var brickRowCount = 5;// a variable indicates the number of the brick rows
    var brickWidth = 87;// a variable indicates the width of the brick
    var brickHeight = 15; // a variable indicates the height of the bricks
    var brickPadding =1;// the padding of the bricks whithin themselves
    var brickOffsetTop = 0;// the top padding of entire bricks
    var brickOffsetLeft = 40;// the left padding of enitre bricks
    var score = 0;// a variable stores the score
    var lives = 5;// a variable stores the lives
	var rowcolors = ["#33ff33", "#33ff66", "#33ff99", "#33ffcc", "#33ffff"];// an array the saves the different colors that will apply on the bricks
	var myMusic; // a variable to play the music
	var timerID = null;// these two lines are used in the timing functions
    var timerOn = false;
    var now = new Date(); // an instance from the date function 
    var hours = 0;// a variable that stores the hours
    var minutes =0;// a variable that stores the minutes
    var seconds =0; // a variable that stores the seconds
	
	
	// this function indicates the clock's stopped status.

	function stopclock ()
    {
    if(timerOn)
    clearTimeout(timerID);
    timerOn = false;
    }
    // this function actualy shows the time in hours/minutes/seconds format.
	// for example if the seconds is more than 59, then add 1 to the minutes and set seconds to 0.
    function showtime ()
    {
    if(seconds>=59)
    {
    seconds=0;
    minutes=minutes+1;
    }
    else
    {
    seconds=1+seconds;
    }
    if(minutes>=59)
    {
    minutes=0;
    hours=hours+1;
    }
	
	// this variable indicates how many digits we set for the seconds, minutes and hours
    var timeValue =zeroPad(hours,2)+":"+zeroPad(minutes,2)+":"+zeroPad(seconds,2);
    document.getElementById("timeDisplay").innerHTML=timeValue;// to draw the time on the screen
	
    timerID = setTimeout("showtime()",1000);
    timerOn = true;
    }
	// this function initiates the clocks
    function startclock()
    {
        stopclock();
        showtime();
    }
  //this function is used to draw the time
    function zeroPad(num,count)
    {
    var numZeropad = num + '';
    while(numZeropad.length < count) {
    numZeropad = "0" + numZeropad;
    }
    return numZeropad;
    }

     myMusic = new sound("louis.mp3"); // the variable myMusic is an instance form the sound class.
     myMusic.play();// a class to play to music
	// this function initiates the audio file to play
	function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

       //a variable to build the bricks
   var bricks = [];
    for(i=0; i<brickRowCount; i++) {
        bricks[i] = [];
        for(j=0; j<brickColCount; j++) {
            bricks[i][j] = { x: 0, y: 0, status: 1 };
        }
    }
// these event listeners are used to follow the keyboard and mouse movements
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

	//key code 39 means that right arrow is pressed
    function keyDownHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = true;
        }
		// key code 37 means left arrow is played
        else if(e.keyCode == 37) {
            leftPressed = true;
        }
    }
    function keyUpHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = false;
        }
        else if(e.keyCode == 37) {
            leftPressed = false;
        }
    }
    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth/2;
        }
    }
	
	//this funcion detects collision
    function collisionDetection() {
        for(c=0; c<brickRowCount; c++) {
            for(r=0; r<brickColCount; r++) {
                var b = bricks[c][r];
                if(b.status == 1) {
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                        dy = -dy;
                        b.status = 0;
						//add 1 to the score each time you hit a brick
                        score++;
						// if the score is equal to the number of the brick which is the number of the colums multipled by the number of the rows the show an alert box
                        if(score == brickColCount*brickRowCount) {
                            alert("Congratulations, You are a winner !");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
//this funcion draws the ball in the canvas
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }
	// this function draws the paddle in the canvas
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
    }
	
	//this function draws the bricks in the canvas and since the rowcolors is an array that means each row has a color
    function drawBricks() {
        for(c=0; c<brickRowCount; c++) {
            for(r=0; r<brickColCount; r++) {
                if(bricks[c][r].status == 1) {
                    var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                    var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
					ctx.fillStyle = rowcolors[c];
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
	//this function draws the score in the canvas
	function drawScore(){
		ctx.font = "35px Futura,Trebuchet MS,Arial,sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText("Score: "+score, 8, 200);
	}
	// this function draws the lives in the canvas
    function drawLives() {
        ctx.font = "35px Futura,Trebuchet MS,Arial,sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText("Lives: "+lives, canvas.width-130, 200);
    }
	
	//this function calls all the function when starting the game, and it includes the alert box when the game is finished
	function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawLives();
        collisionDetection();
		drawScore();

        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        }
        else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
				
				//this means if you are out of lives the show an alert box
                if(!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                }
                else {
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 3;
                    dy = -3;
                    paddleX = (canvas.width-paddleWidth)/2;
                }
            }
        }

        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;
        requestAnimationFrame(draw);
    }
    draw();