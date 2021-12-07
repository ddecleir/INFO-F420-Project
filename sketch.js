// Author : Decleire Damien 000515451

let polygon = new Polygon();
let step = 0;
let figure = 0;
let stepDraw = 0;
function setup() {
  createCanvas(windowWidth, windowHeight);
  fill("black");
  textSize(40);
  button = createButton("Clear");
  button.style('font-family', 'Arial');
  button.style('border-radius', '12px');
  button.style('background-color', 'black');
  button.style('color', 'white');
  button.style('font-size', '20px');
  button.position(30, 65);
  button.mousePressed(resetpoints);
  button = createButton("Demonstration");
  button.style('font-family', 'Arial');
  button.style('border-radius', '12px');
  button.style('background-color', 'black');
  button.style('color', 'white');
  button.style('font-size', '20px');
  button.position(99, 65);
  button.mousePressed(placeFigure1);
  button = createButton("Next Step");
  button.style('font-family', 'Arial');
  button.style('border-radius', '12px');
  button.style('background-color', 'black');
  button.style('color', 'white');
  button.style('font-size', '20px');
  button.position(250, 65);
  button.mousePressed(nextStep);
  button = createButton("The different VisC");
  button.style('font-family', 'Arial');
  button.style('border-radius', '12px');
  button.style('background-color', 'black');
  button.style('color', 'white');
  button.style('font-size', '20px');
  button.position(359, 65);
  button.mousePressed(stepByStepDrawingAlgorithm2);

}

function draw() {
  background(240);
  textSize(20);
  text('Computing a visibility polygon using few variables', 30,20,textSize(30));
  polygon.draw();
  polygon.drawShapes();
  polygon.drawShapesStep();
}

function resetpoints() {
  polygon.resetPoints();
  stepDraw = 0;
  step = 0;
}

function mousePressed() {
  if(mouseButton === LEFT && step === 0){
    if(mouseY > 125){
      polygon.addPoint(mouseX, mouseY);
    } 
  } else if(mouseButton === RIGHT && step === 1) {
    polygon.pointQ = new Point(mouseX, mouseY);
  }
}

function nextStep(){
  switch(step){
    //Step 0 -> Place the points of the polygon
    case 0:
      if(polygon.size() > 2){
        polygon.sortRadially();
        step ++;
      }
      break;
    //Step 1 --> Place a point Q
    case 1:
      if(polygon.pointQ != null){
        polygon.flagDrawPolygon = true;
        polygon.computeP0();
        step ++;
      }
      break;
    case 2:
      polygon.testAlgorithm2();
      step ++;
      break;
  }
}

function placeFigure1(){
  if(polygon.size() < 3){
    let figure = figure1().figure;
    let pointQ = figure1().q;
    for(let i = 0; i < figure.length; i ++){
      polygon.addPoint(figure[i].x, figure[i].y);
    }
    polygon.pointQ = pointQ;
    figure = 1;
  }
}

function stepByStepDrawingAlgorithm2(){
  if(stepDraw > 5) return;
    polygon.shapes=[];
    polygon.DrawingStep=[];
    polygon.testAlgorithm2StepByStepFigure1(stepDraw);
    stepDraw++;
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};
