// Snake



/*
*
*
* 	
		Setup:
*
*
*/

var objectSize = 10;
var canvas = document.getElementById("gamecanvas");
var menu = document.getElementById("menu");
var board = canvas.getContext('2d');
var edge = objectSize;

var windowHeight;
var windowWidth;
var width;
var height;

var fruit = []
var actors = []
actors.push(fruit);
var fruitmovement;
var count = 0
var countMax = 30
var interval = 50
var fontSize = 16;
var play = false
var nomPic = document.getElementById("nompic")
var neonGreen = "#88FF88"
var borderGreen = "#2c2"
var euclidian = false;
var foodIncrease = 1;
var timed = true;
var timeBonus = 1;
var time = 30;
var timeGain = false;
var snackCounter = 0;
var pause = !play
var moveSpeed = 10;
var size1 = objectSize;
var size2 = objectSize;
var movingFruit = false;
var wildColoredFruit = false;
var fruityRainbow = ["Radical Red","#FF355E",
"Wild Watermelon","#FD5B78",
"Outrageous Orange","#FF6037",
"Atomic Tangerine","#FF9966",
"Neon Carrot","#FF9933",
"Sunglow","#FFCC33",
"Laser Lemon","#FFFF66",
"Unmellow Yellow","#FFFF66",
"Electric Lime","#CCFF00",
"Screamin' Green","#66FF66",
"Magic Mint","#AAF0D1",
"Blizzard Blue","#50BFE6",
"Shocking Pink","#FF6EFF",
"Razzle Dazzle Rose","#EE34D2",
"Hot Magenta","#FF00CC",
"Purple Pizzazz","#FF00CC"]



/*
*
*
* 	
		Event Handling:
*
*
*/

var screenResize = function(){
	windowHeight = window.innerHeight
	windowWidth = window.innerWidth
	windowHeight = Math.floor(windowHeight/10)*10
	windowWidth = Math.floor(windowWidth/10)*10
	let oneninety = 190;
	if (window.innerWidth < windowHeight){
		width = windowWidth-50;
		height = windowHeight-50 - 200;
		board.canvas.width = windowWidth-50;
		board.canvas.height = windowHeight-50 - 200;
		menu.style.width = width.toString() +"px";
		menu.style.height = oneninety.toString() + "px";
		/*
		console.log("narrow")
		console.log("border width:" , board.canvas.width)
		console.log("menu width:" , menu.style.width)
		console.log("border height:" , board.canvas.height)
		console.log("menu height:" , menu.style.height)
		*/
	}
	else
	{
		width = windowWidth-50 -200;
		height = windowHeight-50;
		board.canvas.width = windowWidth-50 -200;
		board.canvas.height = windowHeight-50;
		menu.style.width = oneninety.toString() + "px";
		menu.style.height = height.toString() +"px";
		/*
		console.log("wide")
		console.log("border width:" , board.canvas.width)
		console.log("menu width:" , menu.style.width)
		console.log("border height:" , board.canvas.height)
		console.log("menu height:" , menu.style.height)
		*/

	}
	width = board.canvas.width-edge;
	height = board.canvas.height-edge;
}

screenResize();

// Event Simulator
var fakeEvent = function(key){
	this.which = key;
}


// any key presses are handled here
keyEventHandler = function(event){
	var key = event.which
	var h = actors[0][0];
	switch(key){
		case 119: 
		if (!oldDir.isSame(new cord(0,moveSpeed))){
			h.v = new cord(0,-moveSpeed); 
		}
		break;
		case 115: 
		if (!oldDir.isSame(new cord(0,-moveSpeed))){
			h.v = new cord(0,moveSpeed); 
		}
		break;
		case 97:
		if (!oldDir.isSame(new cord(moveSpeed,0))){
			h.v = new cord(-moveSpeed,0); 
		}
		break
		case 100:
		if (!oldDir.isSame(new cord(-moveSpeed,0))){
			h.v = new cord(moveSpeed,0); 
		}
		break
		case 112:
		if (play){
			play = false;
			document.getElementById("pause_menu").style.zIndex = "1";
			document.getElementById("pause_menu").style.visibility = "visible";
		}
		else {
			play = true;
			document.getElementById("pause_menu").style.zIndex = "-1";
			document.getElementById("pause_menu").style.visibility = "hidden";
		}
		pause = !play
		break
		default: 
		break;
		console.log('event handled: ' + h.v)
	}
}



// gameboard clicks are handled here
clickEventHandler = function(event){
	var click = event
	console.log(click.clientX, click.clientY);
}


// onclick function for the restart button
Restart = function(){
	newgame()
}


// onclick function for the cheat button
// cuases snake to consume one of the food items on the board
Cheat = function(){
	let herione = actors[0][0]
	var n = 0
	// optional increasing amount of food after each snack caught
	while (n < foodIncrease){
	fruitMaker()
	n = n +1
	}

	//optional adding time to the timer
	if (time)
	{
		time = time + timeBonus
	}
	herione.eat(fruit[0]);
}


// onclick function for the Pause button
Pause = function(){
	keyEventHandler(new fakeEvent(112))
}


// Swipe Detector
try{
	var swipedetector = new Hammer(canvas);
	swipedetector.get('pan').set({direction:Hammer.DIRECTION_ALL});

	swipedetector.on("panleft panright panup pandown", function(ev) {
	    var a;
	    if (ev.type == "panup"){
	    	a =119;
	    }
	    if (ev.type == "panleft"){
	    	a = 97;
	    }
	    if (ev.type == "panright"){
	    	a = 100;
	    }
	    if (ev.type == "pandown"){
	    	a = 115;
	    }
	    keyEventHandler(new fakeEvent(a));
	    console.log(ev.type);
	});
}
catch(err) {
	console.log("Hammer the js package isn't loading. Error caught: ",err)
}


/*
*
*
*
	Function that applies the rules for each level
*
*
*
*/

function levelup (i){
	document.getElementById("level_rules_header").innerHTML = "Level " + i + " Rules";
	let rules = ""
	if (i == 1){
		rules = "<li> Be careful not to eat your own tail.</li><li>You can pass through walls </li>";
		timed = false;
		movingFruit = true;
	}
	if (i == 2){
		rules = "<li>When the timer runs out it's game over.</li><li>Collect fruit to gain time.</li><li> Be careful not to eat your own tail.</li><li>You can pass through walls </li>";
		timed = true;
		timeBonus = 2;
		wildColoredFruit = true;
		movingFruit = false;
		fruitmovement = "rand";
	}
	if (i == 3){
		rules = "<li>Things will move a bit faster</li><li>When the timer runs out it's game over.</li><li>Collect fruit to gain time.</li><li> Be careful not to eat your own tail.</li><li>You can pass through walls </li>";
		timed = true;
		timeBonus = 5;
		foodIncrease = 1;
		interval = 30;
		endgame();
		playgame();
		wildColoredFruit = true;
		movingFruit = false;

	}
	if (i == 4){
		rules = "<li>Eat fruit to create fruit</li><li>When the timer runs out it's game over.</li><li>Collect fruit to gain time.</li><li> Be careful not to eat your own tail.</li><li>You can pass through walls </li>";
		timed = true;
		timeBonus = 5;
		foodIncrease = 3;
		wildColoredFruit = true;
		movingFruit = false;
		interval = 50;
		endgame();
		playgame();
		fruitmovement = "up-left";
	}
	if (i == 5){
		rules = "<li>The fruit will be moving </li><li>The timer will not be decreasing</li><li> Eating food will gain time </li><li>Be careful not to eat your own tail.</li><li>You can pass through walls </li>";
		timed = false;
		timeBonus = 3;
		foodIncrease = 1;
		wildColoredFruit = true;
		movingFruit = true;
		
	}
	if (i == 6){
		rules = "<li>Eating food will not create food</li><li>The timer will not be decreasing</li><li> Eating food will gain time </li><li> Be careful not to eat your own tail.</li><li>You can pass through walls </li>";
		timed = false;
		timeBonus = 3;
		foodIncrease = 0;
		wildColoredFruit = true;
		movingFruit = false;
		fruitmovement = "down-right-fast";

	}
	if (i == 7){
		rules = "<li>Eating food will not create food</li><li>Eating food will gain time</li><li>If you run out of time, game over</li><li> Be careful not to eat your own tail.</li><li>You can pass through walls </li>";
		timed = true;
		timeBonus = 5;
		foodIncrease = 0
		wildColoredFruit = true;
		movingFruit = false;
	}
	if (i == 8){
		rules = "<li>Don't touch the walls! </li><li> The timer is innactive</li><li>Food will not give you time</li> <li> Be careful not to eat your own tail.</li>";
		timed = false;
		timeBonus = 0;
		foodIncrease = 1;
		wildColoredFruit = true;
		euclidian = true;
		heroineMoveUpdate();

	}
	if (i == 9){
		rules = "<li>The timer is running</li><li>Food will not give you time</li><li> Fruit will be moving quickly</li> <li> You will be moving slowly</li><li> Be careful not to eat your own tail.</li><li>Don't touch the walls! </li>";
		timed = false;
		timeBonus = 1;
		foodIncrease = 3;
		wildColoredFruit = true;
		movingFruit = true;
		euclidian = true;
		interval = 75;
		endgame();
		playgame();
		
	}
	if (i == 10){
		rules = "Congradulations!<li>This is the final level</li> <li> Aim for the highest time you can</li><li> Every moment you survive will gain you time </li><li>Food will not give you time</li><li> Fruit will be moving quickly</li><li> Be careful not to eat your own tail.</li><li>Don't touch the walls! </li>";
		timed = false;
		timeBonus = 0;
		timeGain = true;
		foodIncrease = 10;
		wildColoredFruit = true;
		movingFruit = true;
		euclidian = true;
		interval = 50;
		endgame();
		playgame();
		
	}
	if (i <= 10){
		keyEventHandler(new fakeEvent(112));
	}
	document.getElementById("level_rules").innerHTML = rules
}

levelup(1);



/*
*
*
*
class constructors
*
*
*
*/

// Fruit and your snake are of this class
class actor {
	constructor(name,cords,symbol,size,v = new cord(0,0)){
		this.name = name;
		this.cords = cords;
		this.symbol = symbol;
		this.size = size;
		this.v = v;
		this.movenorm = function(){
			var vel = this.v;
			for (var c in this.cords){
				var cord1 = this.cords[c] 
				cord1.x += vel.x
				cord1.y += vel.y
			}
		}
		this.movewrap = function(){
			var vel = this.v;
			for (var c in this.cords){
				var cord1 = this.cords[c] 
				cord1.x += vel.x + width -10;
				cord1.x %= width-10;
				cord1.y += vel.y + height -10;
				cord1.y %= height -10;
			}
		}
		this.move = function(){
			this.movewrap();
		}
	}
}

// Objects of this type are treated as both coordinates and vectors
class cord {
	constructor (x,y){
		this.x = x;
		this.y = y;
		this.dup = function(){
			return new cord(this.x,this.y)
		}
		this.isSame = function(cord2){
			if (this.x == cord2.x && this.y == cord2.y){
				return true;
			}
			return false;
		}
	}
}

// Collision testing function
var rectIntersect = function(cord1, size1, cord2, size2){
	var left1 = cord1.x;
	var right1 = cord1.x+size1;
	var top1 = cord1.y;
	var bottom1 = cord1.y +size1;
	var left2 = cord2.x;
	var right2 = cord2.x+size2;
	var top2 = cord2.y;
	var bottom2 = cord2.y +size2;
	if (left1 < right2 &&
		right1 > left2 &&
		top1 < bottom2 &&
		bottom1 > top2){
		return true;
	}
	return false;
}



// these are three tests to see if everything is working right!
//var fruit1 = new actor('fruit',[new cord(0,0)],"blue", size1)
//actors[1].push(fruit1)
//console.log(-7%3)


heroineMoveUpdate = function(){
	if(euclidian){
		heroine.move = function() {
			this.moveEuclidian()
		}
	}
	else{
		heroine.move = function() {
			this.moveNonEuclidian()
		}
	}
}


/*
*
*
*
		Snake Construction (called heroine)
*
*
*/
var heroine
var oldDir;
function makeHeroine (){
	// Wala! Our Protagonist appears! Along with a delightful snack!
	heroine = new actor('heroine',[new cord(0+size1,height-size1)],neonGreen,size1, new cord(0,-moveSpeed))
	// oldDir is used periodically to look at the last
	//	direction your snake was headed
	oldDir = new cord(0,0)

	// She moves by adding a new cord for where her head is going, 
	//	and removing the furthest back cord where her tail was
	//	this saves a lot of processing, !!!BUT!!! it also means that
	//	the speed must always be equal to or greater than the snakes body
	heroine.moveEuclidian = function(){
		oldDir = this.v
		var body1 = this.cords[0]
		var head = body1.dup()  /// issue this is refferencing head, but we just want its properties
		head.x += this.v.x
		head.y += this.v.y
		this.cords.splice(0,0,head)
		this.cords.pop()
	}
	heroine.moveNonEuclidian = function(){
		oldDir = this.v
		var body1 = this.cords[0]
		var head = body1.dup()  /// issue this is refferencing head, but we just want its properties
		head.x += this.v.x + width -10
		head.x %= width-10
		head.y += this.v.y + height -10
		head.y %= height-10
		this.cords.splice(0,0,head)
		this.cords.pop()
	}

	heroineMoveUpdate();

	// Yes! I know! This actually adds new snacks to the front of your snake
	//	will anyone ever know? (from playing that is, obvi you&I know)
	heroine.eat = function(nom){
		var head = this.cords[0]
		//the new spot goes in the direction you're going (as a unit vector) multiplied by the size of your bod
		var addition = new cord(head.x + this.v.x/moveSpeed*this.size, head.y + this.v.y/moveSpeed*this.size)	
		this.cords.splice(0,0,addition)
		
		
		fruit.splice(fruit.indexOf(nom),1)
		
		snackCounter = snackCounter+1

		if (snackCounter%5 == 0)
		{
			levelup(snackCounter/5 + 1)
		}
	}
	// Adding your Snake to the list of actors (or actresses as the case may be!)
}


actors.splice(0,0,[heroine])


/*
*
*
*
		Fruit Constructor
*
*
*/

fruitmovement = new cord(0,1);

fruitMaker = function(){
	var place = new cord(Math.floor(Math.random()*(width - 2*size2)/10)*10 + size2, Math.floor(Math.random()*(height - 2*size2)/10)*10+size2)

	//weird fruit colors ^-^
	let color = fruityRainbow[Math.floor(Math.random()*fruityRainbow.length/2)*2+1];
	
	let movement;
	// optionally changes this individual fruit's movement action to a more random value
	if (fruitmovement.constructor != cord){
		if (fruitmovement == "down-right")
		{
			movement = new cord(Math.floor((Math.random()*2)),Math.floor((Math.random()*2)))
		}
		if (fruitmovement == "down-right-fast")
		{
			movement = new cord(Math.floor((Math.random()*10)),Math.floor((Math.random()*10)))
		}
		if (fruitmovement == "down-left")
		{
			movement = new cord(0-Math.floor((Math.random()*2)),Math.floor((Math.random()*2)))
		}
		if (fruitmovement == "up-right")
		{
			movement = new cord(Math.floor((Math.random()*2)),0-Math.floor((Math.random()*2)))
		}
		if (fruitmovement == "up-left")
		{
			movement = new cord(0-Math.floor((Math.random()*2)),0-Math.floor((Math.random()*2)))
		}
		if (fruitmovement == "rand")
		{
			movement = new cord(1-Math.floor((Math.random()*3)),1-Math.floor((Math.random()*3)))
		}
	}
	else{
		movement = fruitmovement.dup();
	}
	var fruit = new actor('fruit',[place],color,size2,movement)
	actors[1].push(fruit)
}

//actors[0][0].eat(actors[1][0])



/*
*
*
*
		Main loops
*
*
*/



post = function(){
	document.getElementById("score").innerHTML = "Score: " + snackCounter;
	document.getElementById("time").innerHTML = "Time: " + Math.floor(time)


	//drawing the game board
	board.beginPath();
	board.rect(edge,edge,width-edge,height-edge);
	board.closePath();

	board.lineWidth = edge*2;
	board.strokeStyle = borderGreen;
	board.stroke();

	board.fillStyle = "#000";
	board.fill();


	//setting relivant variables
	var herione = actors[0][0]
	var head = herione.cords[0]
	var fruit = actors[1]

	// check if a fruit is eaten, resolve if do, draw if not
	let f = 0
	while (f < fruit.length){

		var nom = fruit[f]
		f = f+1
		var cords = nom.cords
		for (var c in cords){
			// wait, how many cordinates are there in cords for just one fruit? 
			// ...This second for is unhelpful, there's always just one thing in it.
			var cord1 = cords[c]  
			if (rectIntersect(head, heroine.size, cord1, nom.size)){ 
				

				var n = 0
				// optional increasing amount of food after each snack caught
				while (n < foodIncrease){
				fruitMaker()
				n = n +1
				}

				//optional adding time to the timer
				if (time)
				{
					time = time + timeBonus
				}

				herione.eat(nom);

				f = 0
			}
			else{
				if (!wildColoredFruit){
					board.fillStyle = "blue"
				}
				else{
					board.fillStyle = nom.symbol					
				}
				board.fillRect(cord1.x+edge, cord1.y +edge, nom.size, nom.size)
			}

		}
	}

	/*debugging statement
	for (var c in heroine.cords){console.log('cord'+c+":",heroine.cords[c].x, heroine.cords[c].y)}
	*/

	//print out our heroine's movement
	for (var c = 0; c < heroine.cords.length; c++){
		var cord1 = herione.cords[c] 
		for (var c2=0; c2 < heroine.cords.length; c2++){
			var cord2 = heroine.cords[c2];
			if (rectIntersect(cord1, heroine.size, cord2, heroine.size) && c != c2){
				play = false
			}
		}
		board.fillStyle = heroine.symbol
		board.fillRect(cord1.x + edge,cord1.y+edge,herione.size,herione.size)
	}
	if (euclidian){
		if (head.x <0 || head.x >= width-objectSize || head.y <0 || head.y >= height-objectSize){
			play = false;
		}
	}
}

update = function(){
	if(movingFruit){
		for (var a in actors){
			var nouns = actors[a]
			for (var n in nouns){
				var noun = nouns[n]
				noun.move()
			}
		}
	}
	else{
		heroine.move()
		}
	
	if (timed){
	time = time - interval/1000
		if(time <0){
	//		count = 0
	//		fruitMaker()
			play = false
			time ++
		}
	}
	if (timeGain){
		time = time + interval/1000
	}
}

/*
for(var x = 0; x<15; x++){
	fruitMaker()}
	*/



var game
playgame = function(){
	game = setInterval(function(){
		if(play){
			update(); 
			post();
			}
		else if (pause)
		{
			post();
		}
		else{
			document.getElementById("level_rules_header").innerHTML = "Game Over";
			document.getElementById("level_rules").innerHTML = "<h3> Game Over </h3> <p> Please click the restart button or refresh your page to play again</p>";
			document.getElementById("pause_menu").style.zIndex = "1";
			document.getElementById("pause_menu").style.visibility = "visible";
			document.getElementById("menu_button").onclick= Restart;
			endgame()
			}
		} ,interval)
}

function endgame(){
	clearInterval(game);
}

function newgame(){
	endgame()
	document.getElementById("menu_button").onclick= Pause;
	objectSize = 10;
	canvas = document.getElementById("gamecanvas");
	menu = document.getElementById("menu");
	board = canvas.getContext('2d');
	edge = objectSize;
	screenResize();


	fruit = []
	actors = []
	actors.push(fruit);
	fruitmovement;
	count = 0;
	countMax = 30;
	interval = 50;
	fontSize = 16;
	play = false
	neonGreen = "#88FF88"
	borderGreen = "#2c2"
	euclidian = false;
	foodIncrease = 1;
	timed = true;
	timeBonus = 1;
	time = 30;
	timeGain = false;
	snackCounter = 0;
	pause = !play
	moveSpeed = 10;
	size1 = objectSize;
	size2 = objectSize;
	movingFruit = false;
	wildColoredFruit = false;

	makeHeroine();
	heroineMoveUpdate();
	actors.splice(0,0,[heroine])
	fruitmovement = new cord(0,1);

	fruitMaker()
	fruitMaker()
	post()
	levelup(1)
	Pause()
	playgame();
}
newgame();


/*
**
**
**		To Do:
**	0: Menu of options (with phone buttons) & way to restart
**	1: Make circle collision!
**	2: Test how much alternate move system slows snake
**	3: Make snake head and snacks circles
**	4: Make circle & flat collision! (snake & walls)
**	5: Resizable
**	6: cute opening animations and menu animations? collapsable clicking for menue?
**	7: A (better) way to play on a phone? (best so far is play area, touch keys beneath, and hamburger at top right or bottom center)
**
**
**
** 		Variations:
**	1: Countdown Snake: Everybody's got to eat! There's 
	a timer counting down and I hope you find a snack in
	time!
**	2: Limited Countdown Snake: timer is counting down and
	you have a little less time each nom (but time
	stacks)
**	3: Increasing Food Snake: more and more noms fill the
	screen as you catch them!
**	4: Non-Euclidian Snake: if you go off the edge 
	you end up on the other side.
**	5: Runaway Snacks Snake: the blips are running
	away from you! There are various speeds and intelegence
	levels. (what if in some cases you actually need to trap them?
		// to do this add a v to fruit maker and some thought to
		//	update for lv.2
**	6: Assorted themes! Other than glow in the dark you might
	offer little doodle-y bugs and such
**
**
*/


