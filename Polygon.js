// Author : Decleire Damien 000515451

class Polygon {
    //The Data
    points = [];
    shapes = [];
    DrawingStep = [];
    pointQ = null;
    p0 = null;

    //The flags
    flagDrawPolygon = false;
    
    constructor() {
        this.points = [];
    }
    resetPoints(){
        this.points = [];
        this.shapes = [];
        this.DrawingStep = [];
        this.pointQ = null;
        this.p0 = null;
        this.flagDrawPolygon = false;
    }
    addPoint(mouseX, mouseY){
        this.points.push(new Point(mouseX, mouseY));
    }

    size(){
        return this.points.length;
    }

    //P0 is a point closest to q on the horizontal line passing through q
    computeP0(){
        //Find the two edges 
        let compX = new Point((this.pointQ.x)+1, this.pointQ.y);
        let intersectionMin = null;
        let verticeFound = null;   
        let distanceMin = 100000;
        
        for(let i = 0; i < this.points.length; i ++){
            let pointA = correctIndex(i, this.points);
            let pointB = correctIndex(i+1, this.points);
            if(orientationDeterminant(this.pointQ, compX, pointA) !== orientationDeterminant(this.pointQ, compX, pointB)){
                let intersection = calculateIntersection(this.pointQ, compX, pointA, pointB);
                let distanceWithIntersection = calculateDistance(this.pointQ, intersection);
                if(distanceWithIntersection < distanceMin){
                    distanceMin = distanceWithIntersection;
                    intersectionMin = intersection;
                    verticeFound = i;
                }
            }
        }
        this.adjustIndex(verticeFound);
        this.p0 = intersectionMin;
    }

    //Output sensitive algorithm
    //computing the visibility polygon of an independent chain C
    Algorithm1(independentChain){
        let c1 = 0;
        if(this.reflexAngleOfTypeR(independentChain, 0)){
            c1 = this.computeShadow(independentChain, 0);
        }
        let Cstart = c1;
        let Cn = independentChain.length-1;
        let Cnext = null;
        let Cstop = null;

        while(Cstart !== Cn){
            let v = this.nextVisReflex(independentChain, Cstart);
            if(v === Cn){
                //The remainder of the chain is visible
                Cstop = Cn;
                if(this.reflexAngleWithRespectToP(independentChain, Cstop)){
                    Cstop = this.computeShadow(independentChain, Cn);
                }
                Cnext = Cn;
            }else{
                //We found the next visible reflex v. The reported chain depends on the type of v
                if(this.reflexAngleOfTypeR(independentChain, v)){
                    Cstop = v;
                    Cnext = this.computeShadow(independentChain, v);
                } else{
                    Cstop = this.computeShadow(independentChain, v);
                    Cnext = v;
                }
            }
            this.reportVertices(independentChain, Cstart, Cstop);
            Cstart = Cnext;
        }
    }

    nextVisReflex(chain, v){
        if(typeof v === "object"){
            for(let i = v.vertexAfterShadow; i < chain.length; i ++){
                if(this.reflexAngleWithRespectToP(chain, i) && this.isThePointVisibleFromQ(chain, chain[i])){
                    return i;
                }
            }
        } else{
            for(let i = v+1; i < chain.length; i ++){
                if(this.reflexAngleWithRespectToP(chain, i) && this.isThePointVisibleFromQ(chain, chain[i])){
                    return i;
                }
            }
        }
        return chain.length-1;
    }

     //Receive the index of the vertex
     reflexAngleOfTypeR(chain, i){
        if(this.reflexAngleWithRespectToP(chain, i)){
            if(i === 0){
                let intersection = this.computeShadow(chain, i);
                if(intersection.intersectionMin !== null && (calculateDistance(this.pointQ, intersection.intersectionMin) > calculateDistance(this.pointQ, chain[i]))){
                    return true;
                } else{
                    return false;
                }
            }
            if(chain.length-1 === i){
                let intersection = this.computeShadow(chain, i);
                if(intersection.intersectionMin !== null && (calculateDistance(this.pointQ, intersection.intersectionMin) < calculateDistance(this.pointQ, chain[i]))){
                    return true;
                } else{
                    return false;
                }        
            }
            //predecessor of v
            let x = correctIndex(i-1, chain);
            let v = correctIndex(i, chain);
            //Successor of v
            let y = correctIndex(i+1, chain);
            let orientationX = orientationDeterminant(this.pointQ, v, x);
            let orientationY = orientationDeterminant(this.pointQ, v, y);
            if(orientationX === 1 && orientationY === 1){
                return true;
            } else {
                return false;
            }
        }
    }

    //Receive the index of the vertex
    reflexAngleWithRespectToP(chain, i){
        if(i === 0){
            let intersection = this.computeShadow(chain, i);
            if(intersection.intersectionMin !== null && calculateDistance(this.pointQ, intersection.intersectionMin) > calculateDistance(this.pointQ, chain[i])){
                return true;
            } else{
                return false;
            }
        }
        if(chain.length-1 === i){
            let intersection = this.computeShadow(chain, i);
            if(intersection.intersectionMin !== null && this.isThePointVisibleFromQ(chain, chain[i]) 
                && calculateDistance(this.pointQ, intersection.intersectionMin) > calculateDistance(this.pointQ, chain[i])){
                return true;
            } else{
                return false;
            }        
        }
        let a = correctIndex(i-1, chain);
        let b = correctIndex(i, chain);
        let c = correctIndex(i+1, chain);
        if(isAngleReflex(a,b,c)){
            //Same component
            if(orientationDeterminant(this.pointQ,b,a) === orientationDeterminant(this.pointQ,b,c)){
                return true;
            }
        }
        return false;
    }

    isThePointVisibleFromQ(chain, point){
        // pointQ, point;
        let size = chain.length-1;
        if(chain.length === this.points.length){
            size = chain.length;
        }
        for(let i = 0; i < size; i ++){
            let pointA = correctIndex(i, chain);
            let pointB = correctIndex(i+1, chain);
            let QpointA = orientationDeterminant(this.pointQ, point, pointA);
            let QpointB = orientationDeterminant(this.pointQ, point, pointB);
            let ABQ = orientationDeterminant(pointA, pointB, this.pointQ);
            let ABpoint = orientationDeterminant(pointA, pointB, point);
            if((QpointA !== 0 && QpointB !== 0 && ABQ !== 0 && ABpoint !== 0)){
                if(QpointA !== QpointB && ABQ !== ABpoint){
                    return false;
                }
            }

        }
        return true;
    }

    //Receive the index of the vertex
    computeShadow(chain, i){
        //Find the two edges 
        let comparator = correctIndex(i, chain);
        let intersectionMin = null;
        let distanceMin = 100000;
        let vertexAfterShadow = null;
        for(let i = 0; i < chain.length-1; i ++){
            let pointA = correctIndex(i, chain);
            let pointB = correctIndex(i+1, chain);
            if(orientationDeterminant(this.pointQ, comparator, pointA) !== orientationDeterminant(this.pointQ, comparator, pointB)){
                let intersection = calculateIntersection(this.pointQ, comparator, pointA, pointB);
                let distanceWithIntersection = calculateDistance(this.pointQ, intersection);
                let distanceVI = calculateDistance(comparator, intersection);
                if(distanceWithIntersection < distanceMin  && distanceVI < distanceWithIntersection
                    && (intersection.x !== comparator.x) && (intersection.y !== comparator.y)){
                    distanceMin = distanceWithIntersection;
                    intersectionMin = intersection;
                    vertexAfterShadow = i+1;
                }
            }
        }
        return {intersectionMin, vertexAfterShadow};
    }

    //A divide-and-conquer approach
    //Compute VisC
    //Threshold is h(s), and a positive integer depth
    Algorithm2(independentChain, d, threshold){
        let k = this.numberOfReflexVerticesInsideDeltaChain(independentChain);
        if(k<=2 || d >= threshold){
            //Compute the visibility polygon of the independentSubChain
            this.Algorithm1(independentChain);
        } else {
            let v = this.findParitionVertexRandomized(independentChain);
            let x = this.rayShooting(independentChain, v);
            let subChain1 = [];
            let subChain2 = [];
            if(typeof x === "object"){
                for(let i = 0 ; i < x.vertexAfterShadow; i ++){
                    subChain1.push(independentChain[i]);
                }
                subChain1.push(x.intersectionMin);
                subChain2.push(x.intersectionMin);
                for(let i = x.vertexAfterShadow; i < independentChain.length; i ++){
                    subChain2.push(independentChain[i]);
                }
            } else{
                for(let i = 0; i <= x; i ++){
                    subChain1.push(independentChain[i]);
                }
                for(let i = x; i < independentChain.length; i ++){
                    subChain2.push(independentChain[i]);
                }
            }
            this.Algorithm2Drawing(subChain1, d+1, threshold);
            this.Algorithm2Drawing(subChain2, d+1, threshold);
        }
    }       

    Algorithm2Drawing(subChain, d, threshold){
        for(let i = 0; i < subChain.length; i ++){
            this.DrawingStep.push(subChain[i]);
        }
        this.DrawingStep.push(-1);
        this.Algorithm2(subChain, d, threshold);
    }

    rayShooting(independentChain, v){
        //Find the two edges    
        let comparator = correctIndex(v, independentChain); 
        let intersectionMin = null;
        let distanceMin = 100000;
        let vertexAfterShadow = null;
        let size = 0;
        if(independentChain.length === this.points.length){
            size = independentChain.length;
        } else{
            size = independentChain.length-1;
        }
        for(let i = 0; i < size; i ++){
            let pointA = correctIndex(i, independentChain);
            let pointB = correctIndex(i+1, independentChain);
            if(orientationDeterminant(this.pointQ, comparator, pointA) !== orientationDeterminant(this.pointQ, comparator, pointB)){
                let intersection = calculateIntersection(this.pointQ, comparator, pointA, pointB);
                let distanceWithIntersection = calculateDistance(this.pointQ, intersection);
                let distanceQI = calculateDistance(this.pointQ, intersection);
                let distanceQV = calculateDistance(this.pointQ, comparator);
                if((intersection.x !== comparator.x && intersection.y !== comparator.y) && distanceQI < distanceQV){
                    if(this.pointQ.y > comparator.y){
                        if(this.pointQ.y > intersection.y){
                            if(distanceWithIntersection < distanceMin){
                                distanceMin = distanceWithIntersection;
                                intersectionMin = intersection;
                                vertexAfterShadow = i+1;
                            }
                        }
                    } else{
                        if(this.pointQ.y < intersection.y){
                            if(distanceWithIntersection < distanceMin){
                                distanceMin = distanceWithIntersection;
                                intersectionMin = intersection;
                                vertexAfterShadow = i+1;
                            }
                        }
                    }
                }
            }
        }
        if(intersectionMin === null){
            return v;
        }
        return {intersectionMin, vertexAfterShadow};
    }

    numberOfReflexVerticesInsideDeltaChain(independentChain){
        let count = 0;
        let start = independentChain[0];
        let end = independentChain[independentChain.length-1];
        let east = false;
        for(let i = 0 ; i < independentChain.length; i ++){
            if(this.reflexAngleWithRespectToP(independentChain, i)){
                if(this.pointQ.y > start.y){
                    east = true;
                }
                let angle = findAngle(this.pointQ, correctIndex(i, independentChain), east);
                if(angle >= findAngle(this.pointQ, start, east) && angle <= findAngle(this.pointQ, end, east)){
                    count++;
                }
            }
        }
        return count;
    }

    //Albeit randomized
    findParitionVertexRandomized(independentChain){
        let k = this.numberOfReflexVerticesInsideDeltaChain(independentChain);
        //Random number between 1 and k
        let choice = Math.floor(Math.random() * (k - 1 + 1)) + 1;
        let count = 1; 
        let start = independentChain[0];
        let end = independentChain[independentChain.length-1];
        let east = false;
        for(let i = 0; i < independentChain.length; i ++){
            if(this.reflexAngleWithRespectToP(independentChain, i)){
                if(this.pointQ.y > start.y){
                    east = true;
                }
                let angle = findAngle(this.pointQ, correctIndex(i, independentChain), east);
                if(angle >= findAngle(this.pointQ, start, east) && angle <= findAngle(this.pointQ, end, east)){
                    if(count === choice){
                        let rank = choice;
                        if(rank >= (k/3) && rank <= (2*k/3)){
                            return i;
                        } else {
                            return this.findParitionVertexRandomized(independentChain);
                        }
                    }
                    count++;
                }
            }
        }
    }

    //function merge and mergeSort come from this page
    //: https://sebhastian.com/merge-sort-javascript/
    merge(left, right) {
        let pointsTemp = [];
        let pivot = new Point(350, 350);
        while (left.length && right.length) {
            if (
                Math.atan2(pivot.y - right[0].y, pivot.x - right[0].x) <
                Math.atan2(pivot.y - left[0].y, pivot.x - left[0].x)
            ) {
                pointsTemp.push(left.shift());
            } else {
                pointsTemp.push(right.shift());
            }
        }
        return [...pointsTemp, ...left, ...right];
    }
    mergeSort(pointsToSort) {
        const half = pointsToSort.length / 2;
        
        if (pointsToSort.length <= 1) {
            return pointsToSort;
        }
        
        const left = pointsToSort.splice(0, half);
        const right = pointsToSort;
        return this.merge(this.mergeSort(left), this.mergeSort(right));
    }
    //This function allows the points to be sorted radially in order to connect
    //the points placed by the user so as to form a polygon containing no intersection 
    sortRadially() {
        if (this.points.length > 1) {
            let pointsTemp = [...this.points];
            this.points = this.mergeSort(pointsTemp);
        }
    }
    adjustIndex(index){
        let tempPoints = [...this.points];
        for(let i = 0; i < this.points.length; i ++){
            tempPoints[i] = correctIndex(index+1+i, this.points);
        }
        this.points = [...tempPoints];
    }

    reportVertices(chain, Cstart, Cstop){
        if(chain.length < 3){
            this.shapes.push(this.pointQ);
            this.shapes.push(correctIndex(Cstart, chain));
            this.shapes.push(correctIndex(Cstop, chain));
            return;
        }
        if(typeof Cstart === "object"){
            if(typeof Cstop === "object"){
                if(Cstart.vertexAfterShadow === Cstop.vertexAfterShadow){
                    this.shapes.push(this.pointQ);
                    this.shapes.push(Cstart.intersectionMin);
                    this.shapes.push(Cstop.intersectionMin);
                } else{
                    this.shapes.push(this.pointQ);
                    this.shapes.push(Cstart.intersectionMin);
                    this.shapes.push(correctIndex(Cstart.vertexAfterShadow, chain));
                    for(let i = Cstart.vertexAfterShadow; i < Cstop.vertexAfterShadow-1; i ++){
                        this.shapes.push(this.pointQ);
                        this.shapes.push(correctIndex(i, chain));
                        this.shapes.push(correctIndex(i+1, chain));
                    }
                    this.shapes.push(this.pointQ);
                    this.shapes.push(correctIndex(Cstop.vertexAfterShadow-1, chain));
                    this.shapes.push(Cstop.intersectionMin);
                }
            } else{
                this.shapes.push(this.pointQ);
                this.shapes.push(Cstart.intersectionMin);
                this.shapes.push(correctIndex(Cstart.vertexAfterShadow,chain));
                for(let i = Cstart.vertexAfterShadow; i < Cstop; i ++){
                    this.shapes.push(this.pointQ);
                    this.shapes.push(correctIndex(i, chain));
                    this.shapes.push(correctIndex(i+1, chain));
                }
            }
        } else if(typeof Cstop === "object"){
            for(let i = Cstart; i < Cstop.vertexAfterShadow - 1 ; i ++){
                this.shapes.push(this.pointQ);
                this.shapes.push(correctIndex(i, chain));
                this.shapes.push(correctIndex(i+1, chain));
            }
            this.shapes.push(this.pointQ);
            this.shapes.push(correctIndex(Cstop.vertexAfterShadow-1,chain));
            this.shapes.push(Cstop.intersectionMin);
        } else{
            for(let i = Cstart ; i < Cstop ; i ++){
                this.shapes.push(this.pointQ);
                this.shapes.push(correctIndex(i, chain));
                this.shapes.push(correctIndex(i+1, chain));
            }
        }
    }

    //Draw the visibility Polygon
    drawShapes(){   
        for(let i = 0; i < this.shapes.length; i+=3){
            fill(0, 50, 20, 50); 
            noStroke();
            beginShape();
            vertex(this.shapes[i].x, this.shapes[i].y);
            vertex(this.shapes[i+1].x, this.shapes[i+1].y);
            vertex(this.shapes[i+2].x, this.shapes[i+2].y);
            endShape();
            stroke(0.5);
            fill("black");
        }
    }

    drawShapesStep(){
        let count = 0;
        let colors=["purple", "green", "yellow", "magenta", "brown", "grey"];
        for(let i = 0; i < this.DrawingStep.length; i ++){
            if(typeof this.DrawingStep[i] === "number"){
                count ++;
            } else {
                fill(colors[count%colors.length]);
                ellipse(this.DrawingStep[i].x, this.DrawingStep[i].y, 12, 12);
                fill("black");
            }
        }
    }

    draw(){
        stroke(0.5);
        for(let i = 0; i < this.points.length; i ++){
            //Draw points and the number of each point
            textSize(15);
            text("" + i, this.points[i].x, this.points[i].y-10);
            
            if(this.flagDrawPolygon){
                let pointA = correctIndex(i, this.points);
                let pointB = correctIndex(i+1, this.points);
                line(pointA.x, pointA.y, pointB.x, pointB.y);
                if(this.reflexAngleWithRespectToP(this.points, i)){
                    if(this.reflexAngleOfTypeR(this.points, i)){
                        fill("red");
                        ellipse(this.points[i].x, this.points[i].y, 12, 12);
                        fill("black");
                    } else{
                        fill("blue");
                        ellipse(this.points[i].x, this.points[i].y, 12, 12);
                        fill("black");
                    }
                } else {
                    ellipse(this.points[i].x, this.points[i].y, 4, 4);
                    fill("black");
                }
            } else {
                ellipse(this.points[i].x, this.points[i].y, 4, 4);
                fill("black");
            }
            
        }
        if(this.pointQ != null){
            text("q", this.pointQ.x, this.pointQ.y-10);
            ellipse(this.pointQ.x, this.pointQ.y, 4, 4);
        }
        if(this.p0 != null){
            text("p0", this.p0.x, this.p0.y-10);
            ellipse(this.p0.x, this.p0.y, 4, 4);
            drawingContext.setLineDash([5, 5]);
            line(this.p0.x, this.p0.y, this.pointQ.x, this.pointQ.y);
            drawingContext.setLineDash([500]);
        }
    }

    testAlgorithm1(){
        let independentChain = [...this.points];
        let temp = [];
        let temp2 = [];
        let compteur =  0;
        for(let i = 0; i < independentChain.length/20;i++){
            temp[i] = independentChain[i];
            compteur = i;
        }
        while(!this.isThePointVisibleFromQ(this.points, this.points[compteur])){
            compteur++;
            temp[compteur] = independentChain[compteur]; 
        }
        let index = 0;
        for(let i = compteur; i < independentChain.length; i ++){
            temp2[index] = independentChain[i];
            index ++;
        }
        this.Algorithm1(temp);
        this.Algorithm1(temp2);
        let temp3 = [this.points[0], this.points[this.points.length-1]];
        this.Algorithm1(temp3);
    }

    testAlgorithm2(){
        let independentChain = [...this.points];
        this.Algorithm2(independentChain, 1, 3);
        let temp = [independentChain[0], independentChain[independentChain.length-1]];
        this.Algorithm1(temp);
    }

    testAlgorithm2StepByStepFigure1(step){
        let independentChain = [];
        switch(step){
            case 0: 
                independentChain.push(new Point(286, 334));
                independentChain.push(new Point(193, 314));
                independentChain.push(new Point(123, 314));
                independentChain.push(new Point(170, 375));
                independentChain.push(new Point(157, 501));
                independentChain.push(new Point(196, 489));
                independentChain.push(new Point(186, 610));
                independentChain.push(new Point(320, 411));
                independentChain.push(new Point(280, 540));
                independentChain.push(new Point(318, 556));
                independentChain.push(new Point(357, 594));
                independentChain.push(new Point(388, 601));
                independentChain.push(new Point(405, 615));
                independentChain.push(new Point(412, 541));
                independentChain.push(new Point(400, 499));
                independentChain.push(new Point(443, 622));
                independentChain.push(new Point(379, 412));
                independentChain.push(new Point(479, 570));
                independentChain.push(new Point(501, 603));
                independentChain.push(new Point(443, 438));
                independentChain.push(new Point(648, 578));
                independentChain.push(new Point(486, 442));
                break;
            case 1:
                independentChain.push(new Point(486, 442));
                independentChain.push(new Point(633, 537));
                independentChain.push(new Point(527, 439));
                independentChain.push(new Point(527, 439));
                independentChain.push(new Point(520, 419));
                independentChain.push(new Point(612, 380));
                independentChain.push(new Point(694, 298));
                independentChain.push(new Point(593, 308));
                independentChain.push(new Point(665, 293));
                independentChain.push(new Point(639, 273));
                independentChain.push(new Point(688, 224));
                independentChain.push(new Point(620, 244));
                independentChain.push(new Point(669, 173));
                independentChain.push(new Point(484, 265));
                independentChain.push(new Point(584, 180));
                independentChain.push(new Point(472, 256));
                independentChain.push(new Point(490, 233));
                independentChain.push(new Point(412, 261));
                independentChain.push(new Point(486, 133));
                independentChain.push(new Point(288, 154));
                independentChain.push(new Point(274, 149));
                independentChain.push(new Point(203, 169));
                independentChain.push(new Point(286, 334));
                break;
            case 2:
                independentChain.push(new Point(286, 334));
                independentChain.push(new Point(193, 314));
                independentChain.push(new Point(123, 380));
                independentChain.push(new Point(170, 375));
                independentChain.push(new Point(157, 501));
                independentChain.push(new Point(196, 489));
                independentChain.push(new Point(186, 610));
                independentChain.push(new Point(320, 411));
                break;
            case 3:
                independentChain.push(new Point(320, 411));
                independentChain.push(new Point(280, 540));
                independentChain.push(new Point(318, 556));
                independentChain.push(new Point(357, 594));
                independentChain.push(new Point(388, 601));
                independentChain.push(new Point(405, 615));
                independentChain.push(new Point(412, 541));
                independentChain.push(new Point(400, 499));
                independentChain.push(new Point(443, 622));
                independentChain.push(new Point(379, 412));
                independentChain.push(new Point(479, 570));
                independentChain.push(new Point(501, 603));
                independentChain.push(new Point(443, 438));
                independentChain.push(new Point(648, 578));
                independentChain.push(new Point(486, 442));
                break;
            case 4:
                independentChain.push(new Point(486, 442));
                independentChain.push(new Point(633, 537));
                independentChain.push(new Point(527, 439));
                independentChain.push(new Point(527, 439));
                independentChain.push(new Point(520, 419));
                independentChain.push(new Point(612, 380));
                independentChain.push(new Point(694, 298));
                independentChain.push(new Point(593, 308));
                independentChain.push(new Point(665, 293));
                independentChain.push(new Point(639, 273));
                independentChain.push(new Point(688, 224));
                independentChain.push(new Point(620, 224));
                break;
            case 5:
                independentChain.push(new Point(620, 244));
                independentChain.push(new Point(669, 173));
                independentChain.push(new Point(484, 265));
                independentChain.push(new Point(584, 180));
                independentChain.push(new Point(472, 256));
                independentChain.push(new Point(490, 233));
                independentChain.push(new Point(412, 261));
                independentChain.push(new Point(486, 133));
                independentChain.push(new Point(288, 154));
                independentChain.push(new Point(274, 149));
                independentChain.push(new Point(203, 169));
                independentChain.push(new Point(286, 334));
                break;
        }
        polygon.Algorithm1(independentChain);
    }
}