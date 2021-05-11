var screenswap;
const graphicsCore = new GraphicsCore(document.body, theGame);

graphicsCore.addEntity({
	type : 'Background',
});
function theGame() {

let canvas = { width: 1200, height : 675 };
var panelheight=675;
var panelwidth=1200;

//user mouse 
var mousew2={
x1:0,
y1:0,
x2:1,
y2:1,
};

function makeButton(button, text) {
	let renderable = button.active == 1;
	button.graphics = {
		type : 'Button',
		coords  : [ button.x1, button.y1, button.x1 + button.x2, button.y1 + button.y2 ],
		text : text,
		renderable : renderable,
	};
	graphicsCore.addEntity(button.graphics);
	return button.graphics;
}

//button to change to game screen 
var playbutton={
x1:575,// X start position
y1:375,// Y start position
x2:100,//length
y2:50, //height
color:"red", // Just for distication will changed for images later
active:1 // Active represent if visble/ clickable
};

makeButton(playbutton, 'play');

//button to change to home screen 
var homebutton={
x1:5,
y1:620,
x2:100,
y2:50,
color:"purple",
active:0
};
makeButton(homebutton, 'home');

//button to open setting menu 
var settingbutton={
x1:5,
y1:5,
x2:100,
y2:50,
color:"blue",
active:1
};

//Menu for setting doesn't take up whole screen
var settingmenu={
x1:50,
y1:50,
x2:400,
y2:400,
color:"green",
active:0
};

//Exit button for setting menu
var settingexit={
x1:50,
y1:50,
x2:50,
y2:50,
color:"red",
active:0
};

//move box is to test if game time is paused


//move box is to test if game time is paused
var restartbutton={
x1:575,
y1:620,
x2:100,
y2:50,
color:"orange",
active:0
};
makeButton(restartbutton, 'restart');

var musicbutton={
x1:1145,
y1:620,
x2:50,
y2:50,
color:"pink",
active:0
};
makeButton(musicbutton, 'music');



var tankstartpos = 575;


//move box is to test if game time is paused
//tank entity 
var tank={
x1:tankstartpos, // x position
y1:1070,// y position
x2:30, // verticle ize
y2:30, // horizontal size
color:"green", // chang this for the image
active:0,
graphics: {
	type : 'Player',
	x : tankstartpos,
	y : 1070,
}
};

function tankGraphics() {
	tank.graphics.x = tank.x1 + tank.x2 / 2;
	tank.graphics.y = tank.y1 + tank.y2 / 2;
}
tankGraphics();

var lives; // game lives
var score; //game score
var roundscore; //score for the current round
var round; //round count
var gone; //aliens destroyed
var gametime =0;
var lostlive = 0;
var lostgame = 0;
var waiting  = 0;
var allynum =0;
//array for all the bullets shot
var bullets= [];
var bulletcount = 0; // active bullets on screen
var gameon = 1;




//adjust spaceing
var blockade = [];
function createblockade(){
 for (var c=0; c<16; c++){
 blockade[c] = {
x1:( Math.floor(c/4))*300 + (c%4)*42 +60, //change for better fitting latter
y1:550,
x2:40,
y2:10,
hp:4,
color:"purple",
active:1
 };
 blockade[c].graphics = {
	 type : 'Blockade',
	 coords : [ blockade[c].x1, blockade[c].y1, blockade[c].x1 + blockade[c].x2, blockade[c].y1 + blockade[c].y2],
	 color : 0xFF0080,
 };
 graphicsCore.addEntity(blockade[c].graphics);
 }
} 

//createblockade();



var rightPressed = false; // represent right arrow key beung pressed
var leftPressed = false; // represent left arrow key beung pressed
var spacePressed = false; // represent space key beung pressed




document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

//functions for telling what key is presed or released
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
     if(e.key == " ") {
        spacePressed = true;}
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
     if(e.key == " ") {
          spacePressed = false;}
}

// create the bullets when space is pressed
//made this function take variables to make it more flexible
//xB and yB are point of origin, dB is directional bullet speed
function spawnbullet(xB,yB,sB) {
	bullets[bulletcount] = {
		x1:xB +15,
		//did this to stop invaders from shooting themselves but now tank can fire past bunkers
		y1:yB - (sB*5),
		x2:10,
		y2:10,
		speed:sB,
		color:"blue",
		active:1
	};
	bullets[bulletcount].graphics = {
		type : 'Bullet',
		x : bullets[bulletcount].x1 + bullets[bulletcount].x2 / 2,
		y : bullets[bulletcount].y1 + bullets[bulletcount].y2 / 2,
	};
	graphicsCore.addEntity(bullets[bulletcount].graphics);
	graphicsCore.playSound('enemyBlaster');
	bulletcount= bulletcount +1;
}

function bulletGraphics(bullet) {
	bullet.graphics.x = bullet.x1 + bullet.x2 / 2;
	bullet.graphics.y = bullet.y1 + bullet.y2 / 2;
	bullet.graphics.isAlive = bullet.graphics.isAlive && bullet.active == 1;
}

//move the bullets
function movebullet() {
for (var c=0; c<bulletcount; c++) {
		if (bullets[c] === undefined) { continue; }
bullets[c].y1 = bullets[c].y1 -10; // 10 is bullet speed
if(bullets[c].y1<20){ //deletes missed bullets
	bullets[c].graphics.isAlive = false;
	bullets.splce(c--,1);
}
bulletGraphics(bullets[c]);
}
}


//moves the tank
//made it so space to spawn bullets occures here
//side effect is you have to stop moving to shoot
function tankmove(){
 if(rightPressed) {
        tank.x1 += 10; //amount of distance crossed by tank
        if (tank.x1 + tank.x2 > canvas.width){  //force it to stop at right border
            tank.x1 = canvas.width - tank.x2;
        }
    }
    else if(leftPressed) {
        tank.x1 -= 10;  //amount of distance crossed by tank
        if (tank.x1 < 0){ //force it to stop at left border
            tank.x1 = 0;
        }
    }
    else if(spacePressed) {
    	spawnbullet(tank.x1,tank.y1,20)
    }
 tankGraphics();
}


//bram
let dropLeng = 0
let xd = 5;
let yd = 10;
let swarm = [];

//stores info on invaders
function invader(x1, y1, p, active){
  this.x1 = x1;
  this.y1 = y1+100;
   this.x2 = 25;
  this.y2 = 25;
  this.points = p;
  this.enemy = false;
  this.isAlive = true;
  this.active = 0
  this.graphics = {
	  type : 'Enemy',
	  x : this.x1 + this.x2 / 2,
	  y : this.y1 + this.y2 / 2,
	  isAlive : this.isAlive,
  };
  graphicsCore.addEntity(this.graphics);
}

function invaderGraphics(invader) {
	if (invader === undefined) { return; }
	invader.graphics.x = invader.x1 + invader.x2 / 2;
	invader.graphics.y = invader.y1 + invader.y2 / 2;
	invader.graphics.isAlive = invader.isAlive;
}

//creates list of Invaders in swarm[]
function makeInvaders(x1, y1, allynum){
  for(var col = 0; col < x1; col++){
    for(var row = 0; row < y1; row++){
      swarm.push(new invader((row * 50), (col * 50), 5, inv));
    }
  }
  let rangeA = x1 * y1;
  for(var i = 0; i < allynum; i++){
    setAlly(rangeA);
  }
}

//make random invaders allies
function setAlly(rangeA){
  let r = Math.floor(Math.random() * rangeA);
  allynum++;
 if(swarm[r] === undefined) { return; }
 swarm[r].points = -50;
 var potentialAlly = swarm[r]
  if(potentialAlly.enemy){
    setAlly();
  }
  else{
    potentialAlly.enemy = true;
  }
}

function invaderAI() {
  dropLeng++;


// messed this function up to try and stop at edges wothoyt specifing the amount of movement
// bug where the invaders falsh for a second
  for (var i = 0; i < swarm.length; i++){
  var toDraw = swarm[i];
      if(toDraw.isAlive){
        toDraw.x1 = toDraw.x1 + xd;
        if( toDraw.x1 +50 >  canvas.width){
        toDraw.x1 =  canvas.width -50;
          xd = xd * (-1);
         for (var i = 0; i < swarm.length; i++){
          swarm[i].y1 =  swarm[i].y1 + yd;}
        } else if(toDraw.x1  <0){
         toDraw.x1 =  0;
         xd = xd * (-1);
           for (var i = 0; i < swarm.length; i++){
          swarm[i].y1 =  swarm[i].y1 + yd;}
        }
      }
  }
	invaderGraphics(toDraw);
  shootInvader();
}

 
//causes the bottom row of invaders to randomly fire bullets
//rowNum is the number of invaders in a row
//now allies don't shoot
function shootInvader() {
  for(var i = swarm.length; i > swarm.length-11; i--){
    var invOn = i;
    var nextRow = true;
    let r = Math.floor(Math.random() * 70);
    if(r == 0){
      while(nextRow){
		if(swarm[invOn] === undefined) { break; }
        if(swarm[invOn].isAlive){
          spawnbullet(swarm[invOn].x1,swarm[invOn].y1,-20);
          nextRow = false;
        }
        else if(swarm[invOn].enemy){
        	nextRow = false;
        }
        else{
          invOn = invOn - 11;
          if(invOn < 0){
            nextRow = false;
          }
        }
      }
    }
  }
}


//bram
function nextround(){
for (let i = 0; i < swarm.length; i++) {
	if (swarm[i] === undefined) {continue; }
	swarm[i] = swarm[i].graphics.isAlive = false;
}
swarm.length =0;
gone =0;
allynum =0;
makeInvaders(5, 11, 5+round);
for (let i = 0; i < bullets.length; i++) {
	if (bullets[i] === undefined) {continue; }
	bullets[i] = bullets[i].graphics.isAlive = false;
}
bullets.length =0;
bulletcount =0;

}

 function stargame(){
tank.y1 = tankstartpos// y position
lives = 3; // game lives
score = 0; //game score
roundscore=0; //score for the current round
round= 1; //round count
gone = 0; //aliens destroyed
rightPressed = false; // represent right arrow key beung pressed
leftPressed = false; // represent left arrow key beung pressed
spacePressed = false; // represent space key beung pressed
createblockade();
bullets.length =0;
bulletcount =0;
swarm.length =0;
allynum =0;
makeInvaders(5, 11, 5+round);
gameon=1;
graphicsCore.addEntity(tank.graphics);

}


var screennumber =1; // Represent the current screen : menu isn't a screen
//Screen 1 is home screen: Screen 2 is game screen

var settingf = 0;// Flag to see if setting is open


// Will be adjusted later

var gametime =0; //flag to see if the game is active

function screen1on(){
	settingbutton.active=1;
	playbutton.active=1;
	musicbutton.active=1;
	settingexit.active=0;
	settingmenu.active=0;
	homebutton.active=0;
	restartbutton.active=0;
	screennumber=1;

	gametime =0;
}

function screen2on(){

settingexit.active=0;
settingmenu.active=0;
settingbutton.active=1;
homebutton.active=1;
restartbutton.active=1;
musicbutton.active=1;
screennumber =2;

gametime =1;
playbutton.active=0;
}

function menuon(){
playbutton.active=0;
settingexit.active=1;
settingmenu.active=1;
settingbutton.active=0;
homebutton.active=0;
restartbutton.active=0;
musicbutton.active=0;

gameon =0;
}

function update(){

if(gameon==1){

if(spacePressed == true && lostgame== 1){
lostgame = 0;
stargame();
}

if (lives<1 ){
lostgame = 1;
}

//collision
//bullet of map
 for(var i=0; i<bullets.length; i++) {
     
        bullets[i].y1 -= bullets[i].speed;
        
	    bulletGraphics(bullets[i]);
        if(bullets[i].y1 < 0 || bullets[i].y1 > 650) {
			bullets[i].graphics.isAlive = false;
            bullets.splice(i--, 1);
            bulletcount--; 
        }
  }

// bullet in a blockade
    for(var i=0; i<bullets.length; i++) {
    for(var c=0; c<16; c++){
		if (blockade[c] === undefined) { continue; }
    if(testCollisionEntity(bullets[i],blockade[c]) && blockade[c].active ==1 ){
      //play a sound
   
        blockade[c].hp--;
    if(blockade[c].hp==3){
     blockade[c].color = "green";
     blockade[c].graphics.color = 0x00FF00;
     } else
  	if(blockade[c].hp==2){
     blockade[c].color = "pink";
     blockade[c].graphics.color = 0xffc0cb;
     } else
    if(blockade[c].hp==1){
     blockade[c].color = "yellow";
     blockade[c].graphics.color = 0x00FFFF;
    } else{
    blockade[c].active = 0;
     blockade[c].color = "black"; 
	blockade[c].graphics.isAlive = false;
    }

  	bullets[i].y1 = -149;
    }
    }
    }
    
    //bullet in an invader
      for(var i=0; i<bullets.length; i++) {
      if(testCollisionEntity(bullets[i],tank)){
      	bullets[i].y1 = -149;
      	lives--;
      }
    for(var c=0; c<swarm.length; c++){
    if(testCollisionEntity(bullets[i],swarm[c]) && swarm[c].isAlive==true){
    
    swarm[c].isAlive = false;
		graphicsCore.playSound('enemyExplosion');
		invaderGraphics(swarm[c]);
  bullets[i].y1 = -149;
  score= score + swarm[c].points;
  if(swarm[c].enemy==true){
  lives--;} else{
  gone++;

  }
  //play a sound
    }
    }
    }

//kills when invaders are too close not working right
    for(var c=0; c<swarm.length; c++){
    if(swarm[c].y1>350){
    lives = 0;
    }
    }
    //collision
    
    // how I tell we cleared the screen
    if(gone == (swarm.length - allynum)){
    round++;
  nextround();
    }
    

tankmove();

invaderAI();
}
} 
let inv =  new Image();
inv.src = "https://www.shareicon.net/data/256x256/2015/09/14/100874_game_512x512.png";
let allypic = new Image();
allypic.src = "https://files.softicons.com/download/game-icons/classic-games-icons-by-thvg/ico/Space%20Invaders%202.ico";



//WILL NEED TO ADD ALL OTHER ENTITES LATER



//Function to tell if a button is press and will plan out the correct screen
// All buttons are techinaly just entites
//To be able to cliack a button it needs to be active and clicked.
screenswap = function() {
//Check if Playbutton is clicked and active will then set up the game screen
 if(playbutton.active==1 && testCollisionEntity(mousew2,playbutton)){
screen2on();
stargame();

//Check if setting is clicked and  active will then set up the setting menu
}  

 else if(settingbutton.active==1 && testCollisionEntity(mousew2,settingbutton)){
settingf =1;
 menuon();
 
//Check if setting exit button is clicked active and will then deactivates setting entites
       }
       else if(settingexit.active==1 && testCollisionEntity(mousew2,settingexit)){
 

if(screennumber == 2){
screen2on();
}else if (screennumber ==1) {
screen1on()
}
settingf=0;
gameon =1;

//Check if home button is clicked and active will then set up the home screen
       }  
       else if(homebutton.active==1 && testCollisionEntity(mousew2,homebutton)){

screen1on();
       }  else if(restartbutton.active==1 && testCollisionEntity(mousew2,restartbutton)){
       
      stargame();
       }  else if(musicbutton.active==1 && testCollisionEntity(mousew2,musicbutton)){
       //musicfunction
       }
    
//Reads the mouse movment to see where it is
document.onmousemove = function(mouse){
	var mouseX = mouse.clientX;
	var mouseY = mouse.clientY;
	
	mousew2.x1 = mouseX-10;
	mousew2.y1 = mouseY-10;
    };
    
   
  }


// Used to tell if the mouse clicked on the right box

function testCollisionEntity(entity1,entity2){	
	var rect1 = {
		x:entity1.x1,
		y:entity1.y1,
		width:entity1.x2,
		height:entity1.y2,
	}
	var rect2 = {
		x:entity2.x1,
		y:entity2.y1,
		width:entity2.x2,
		height:entity2.y2,
	}
	return testCollisionRectRect(rect1,rect2);
}	

function testCollisionRectRect(rect1,rect2){
	return rect1.x <= rect2.x+rect2.width 
		&& rect2.x <= rect1.x+rect1.width
		&& rect1.y <= rect2.y + rect2.height
		&& rect2.y <= rect1.y + rect1.height;
}

// Draws the screen 
function drawscreen(){
	tankGraphics();
playbutton.graphics.renderable = false;
musicbutton.graphics.renderable = false;
restartbutton.graphics.renderable = false;
homebutton.graphics.renderable = false;



if(screennumber==1){// draws the home screen
//draws startbutton
playbutton.graphics.renderable=true;

//musicbutton
musicbutton.graphics.renderable=true;

if(settingf ==1){
}
} else { // draws the game screen

if(gametime == 1){

//draws restart button
restartbutton.graphics.renderable = true;

//draws homebutton
homebutton.graphics.renderable = true;

//draws the mutebutton
musicbutton.graphics.renderable = true;

if(settingf ==1){
}
}



//  Move each bomb.
if (lostgame==1){
} else{   
// draws the invaders
for (var i = 0; i < swarm.length; i++){
	invaderGraphics(swarm[i]);
}

//draws the tank
tankGraphics();

// draw core

//draw lives

// draw the bullets
for (var c=0; c<bulletcount+1; c++) {
if (bullets[c] === undefined) { continue; }
bulletGraphics(bullets[c]);
}

}


//Check to see if menu is open
//Draws menu if flag is 1

}

}

// clears the whole screen
function clear(){
}

// Is called to delete and draw the screen
function myTimer() {
 clear();
 update();
 drawscreen();
graphicsCore.graphicsLoop();
 requestAnimationFrame(myTimer);
}

requestAnimationFrame(myTimer);

}
