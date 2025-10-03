



function setup(){
  console.clear();
	const canvasElement = document.getElementById('canvasContainer');
  console.log(canvasElement);
  // create a biiiiig canvas to start with
  createCanvas(10000, 10000).parent(canvasElement);
  // resize it to fit the div
  windowResized();
  textAlign(CENTER, CENTER);
  console.log(width, height);
  background(0);
  splashScreen();
}

function draw(){
	
  
	
}

function splashScreen(){
  background(0);  
  fill(255);
  noStroke();
  textSize(100);

  fill("#ee5533");
  textAlign(RIGHT, CENTER);
  text("LD", width/2, height/2);
  fill("#f79122");
  textAlign(LEFT, CENTER);
  text("58", width/2, height/2);
  fill(255);
  textAlign(CENTER, CENTER);
  text("The Game", width/2, height/2 + 100);
  
}



//Resize canvas to fill the div
function windowResized() {
  const size = select("#canvasContainer").size();

  // Square Board
  let minSize = min(size.width, size.height);
  resizeCanvas(minSize, minSize);
  // Force Menu refresh
}
