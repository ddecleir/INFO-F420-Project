
/**
 * @Author : Decleire Damien 000515451
 */

let polygon = new Polygon();
let pointQ = null;
let onButton = false;
let step = 0;
let title = "Place some points to form a Polygon\nClick on 'Next Step' to continue";

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill("black");
  textSize(40);
  button = createButton("Clear");
  button.position(30, 85);
  button.mousePressed(resetpoints);
  button = createButton("Random Points");
  button.position(85, 85);
  button.mousePressed(placeRandomPoints);
  button = createButton("Next Step");
  button.position(200, 85);
  button.mousePressed(nextStep);
}

function draw() {
  background(200);
  textSize(20);
  text(title, 30, 50);
  polygon.drawAllPoints(pointQ);
  if(step >= 1){
    polygon.drawPolygon();
  }
  if(pointQ !== null){
    polygon.drawPoint(pointQ, "q", 4);
  }
  if(polygon.p0 !== undefined){
    polygon.drawPoint(polygon.p0, "p0", 10);
  }
  if(step >= 4){
    polygon.drawReflexAngleWithRespectToP();
  }
}

function resetpoints() {
  polygon.resetPoints();
  pointQ = null;
  step = 0;
  polygon.p0 = undefined;
  title = "Place some points to form a Polygon\nClick on 'Next Step' to continue";
}

function mousePressed() {
  if(mouseButton === LEFT && step < 2){
    if(mouseY > 125){
      polygon.addPoint(mouseX, mouseY);
    }
  } else if(mouseButton === RIGHT && step < 2) {
    pointQ = new Point(mouseX, mouseY);
    polygon.pointQ = pointQ;
    
  }
}

function nextStep(){
  switch(step){
    case 0:
      polygon.sortRadially();
      step ++;
      title = "Place a point 'q' inside the polygon with right click\nClick on 'Next Step' to add p0";
      break;
    case 1:
      let inter = polygon.computeP0(pointQ);
      let p0 = inter.intersectionMin;
      polygon.verticeMin = inter.verticeMin;
      polygon.p0 = p0;
      title = "Click on 'Next Step' to treat p0 as a vertex of the polygon.\nThis can be done by reordering the vertices in counterclowise direction from p0";
      step ++;
      break;
    case 2:
      polygon.adjustIndex(polygon.verticeMin);
      title = "Click on 'Next Step' to calcute the reflex vertex in our context and the shadow";
      step ++;
      break;
    case 3:
      polygon.calculateReflexAngleWithRespectToP(pointQ);
      polygon.tryAlgo1();
      step ++;
      //title = "";
      break;
    case 4:

      break;
    case 5:

      break;
  }
}

function placeRandomPoints(){
  if(step < 2){
    for (let i = 0; i < 6; i++) {
      let x = Math.floor(Math.random() * 600) + 100;
      let y = Math.floor(Math.random() * 500) + 130;
      polygon.addPoint(x, y);
    }
  }
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};
