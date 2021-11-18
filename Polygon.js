class Polygon {
    constructor() {
        this.points = [];
        this.rReflexsAngle = [];
    }
    
    resetPoints(){
        this.points = [];
        this.rReflexsAngle = [];
    }
    
    addPoint(mouseX, mouseY){
        this.points.push(new Point(mouseX, mouseY));
    }

    size(){
        return this.points.length;
    }
    
    /* param = Independent chain C : chain & Visible point on C : p 
    It's objective is to compute the next visible reflex vertex lying after p on C
    , along with its shadow. */
    nextVisReflex(p, chain){
        let a = chain[0];
        let b = chain[1];
        let findP = (p.x === this.p0.x && p.y === this.p0.y);
        for(let i = 0; i < this.points.length; i ++){
            if(findP){
                if(this.reflexAngleWithRespectToP(this.pointQ, i)){
                    console.log("nextVisReflex : " + i);
                    return this.points[i];
                }
            }
            if(this.points[i].x === p.x && this.points[i].y === p.y){
                findP = true;
            }
        }
        return null;
    }

    //Computing the visibility polygon of an independent chain C
    //Starting chain is ∂P=chain(p0,p0)
    algorithm1(){
        let chain = [];
        let cStart = this.p0;
        let cN = this.p0;
        chain.push(cStart);
        chain.push(cN);
        let v = this.nextVisReflex(this.p0, chain);
        let cStop = null;
        let cNext = null;
        while(v !== null){
            if(v.x === cN.x && v.y === cN.y){
                cStop = cN;
                cNext = cN;
            } else {
                //We found the next visible reflex v. The reported chain depends on the type of v.
                if(this.isReflexOfTypeR(this.pointQ, v)){
                    cStop = v;
                    cNext = this.calculateShadow(this.pointQ, v);
                } else{
                    cStop = this.calculateShadow(this.pointQ, v);
                    cNext = v;
                }
            }
            //Report cStart, cStop and every vertex between them
            this.reportAlgorithm1(cStart, cStop);
            cStart = cNext;
            v = this.nextVisReflex(cStart, chain);
        }
    }

    tryAlgo1(){
        this.algorithm1();
    }

    reportAlgorithm1(cStart, cStop){
        
    }

    wait(time){
    let current = 0;
    let start = millis()
    do{
        current = millis();
    }
    while(current < start + time)
    }

    /* This function enables error-free navigation within a table. 
    If the requested index is less than 0 then the function will 
    return the last element. If the requested index is greater 
    than the maximum index of the array then the function will 
    return the minimum index of the array. */
    correctIndex(index) {
        if (index >= this.points.length) {
        return this.points[index % this.points.length];
        } else if (index < 0) {
        return this.points[(index % this.points.length) + this.points.length];
        } else {
        return this.points[index];
        }
    }
    
    // Allows you to determine whether an angle is Reflex
    isAngleReflex(a, b, c) {
        let crossProduct = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
        return crossProduct > 0;
    }


    drawReflexAngleWithRespectToP(){
        for(let i = 0; i < this.rReflexsAngle.length; i=i+2){
            let b = this.rReflexsAngle[i];
            ellipse(b.x,b.y,8,8);    
            this.setLineDash([10, 10]);
            line(pointQ.x, pointQ.y, b.x, b.y);
            this.setLineDash([500]);
            let shadow = this.rReflexsAngle[i+1];
            if(shadow!==null){
                fill("red");
                ellipse(shadow.x, shadow.y, 7,7);
                fill("black");
            }
        }
    }

    calculateReflexAngleWithRespectToP(p){
        for(let i = 0; i < this.points.length; i ++){
            if(this.reflexAngleWithRespectToP(p,i)){
                let b = this.correctIndex(i);
                let shadow = this.calculateShadow(p,b);
                this.rReflexsAngle.push(b);
                this.rReflexsAngle.push(shadow);
            }
        }
    }

    isSegmentContainsInThePolygon(p, q){
        for(let i = 0; i < this.points.length; i ++){
            let a = this.correctIndex(i);
            let b = this.correctIndex(i+1);
            if(checkIfSegmentHitsSegment(p, q, a, b)){
                return false;
            }
        }
        return true;
    }

    // Q is our point,
    // V is the vertex
    // I is the intersection(shadow)
    rTypeDetection(distanceQI, distanceQV){
        return distanceQV < distanceQI;
    }

    isReflexOfTypeR(p, vertice){
        let vertices = [];
        for(let i = 0; i < this.points.length-1; i ++){
            if(orientationDeterminant(p, vertice, this.points[i])
                !== orientationDeterminant(p, vertice, this.points[i+1])){
                vertices.push(i);
            }
        }
        if(orientationDeterminant(p, vertice, this.points[this.points.length-1])
            !== orientationDeterminant(p, vertice, this.points[0])){
                vertices.push(this.points.length-1);
        }
        //Compute the intersections
        for(let s = 0; s < vertices.length; s ++){
            let intersection = calculateIntersection(p, vertice, 
                this.correctIndex(vertices[s]), this.correctIndex(vertices[s]+1));
            let distanceQV = this.calculateShadow(p, vertice);
            let distanceQI = calculateDistance(p, intersection);
            if(this.isReflexOfTypeR(distanceQI, distanceQV)){
                return true;
            }
        }
        return false;
    }
    
    reflexAngleWithRespectToP(p, i){
        let a = this.correctIndex(i-1);
        let b = this.correctIndex(i);
        let c = this.correctIndex(i+1);
        let reflex = this.isAngleReflex(a,b,c);
        if(reflex){
            //Same component
            if(orientationDeterminant(p,b,a) === orientationDeterminant(p,b,c)){
                return true;
            }
        }
        return false;
    }

    calculateShadow(p, vertice){
        let vertices = [];
        for(let i = 0; i < this.points.length-1; i ++){
            if(orientationDeterminant(p, vertice, this.points[i])
                !== orientationDeterminant(p, vertice, this.points[i+1])){
                vertices.push(i);
            }
        }
        if(orientationDeterminant(p, vertice, this.points[this.points.length-1])
            !== orientationDeterminant(p, vertice, this.points[0])){
                vertices.push(this.points.length-1);
        }
        //Compute the intersections
        let intersectionMin = null;
        let distanceMin = 10000;
        for(let s = 0; s < vertices.length; s ++){
            let intersection = calculateIntersection(p, vertice, 
                this.correctIndex(vertices[s]), this.correctIndex(vertices[s]+1));
            let distanceVI = calculateDistance(vertice, intersection);
            let distanceQI = calculateDistance(p, intersection);
            if(distanceMin > distanceVI && distanceVI < distanceQI && ((intersection.x !== vertice.x) && (intersection.y !== vertice.y))){
                distanceMin = distanceVI;
                intersectionMin = intersection;
            }
        }
        return intersectionMin;
    }

    setLineDash(list) {
        drawingContext.setLineDash(list);
    }

    /*P0 is a point closest to q on the horizontal line passing through q*/
    computeP0(pointQ){
        //horizontal line
        line(0, pointQ.y, 2000, pointQ.y);
        //Find the two edges 
        let comparatorX = new Point((pointQ.x)+1, pointQ.y);
        let vertices = [];
        for(let i = 0; i < this.points.length-1; i ++){
            if(orientationDeterminant(pointQ, comparatorX, this.points[i])
                !== orientationDeterminant(pointQ, comparatorX, this.points[i+1])){
                vertices.push(i);
            }
        }
        if(orientationDeterminant(pointQ, comparatorX, this.points[this.points.length-1])
            !== orientationDeterminant(pointQ, comparatorX, this.points[0])){
                vertices.push(this.points.length-1);
        }
        //Compute the intersections
        let intersectionMin = null;
        let distMin = 100000;
        let verticeMin = null;
        for(let s = 0; s < vertices.length; s ++){
            let intersection = calculateIntersection(pointQ, comparatorX, 
                this.correctIndex(vertices[s]), this.correctIndex(vertices[s]+1));
            let distIntersection = calculateDistance(pointQ, intersection);
            if(distIntersection < distMin){
                distMin = distIntersection;
                intersectionMin = intersection;
                verticeMin = vertices[s];
            }
        }
        return {intersectionMin, verticeMin};
    }

    drawAllPoints(){
        let index = 0;
        for (index in this.points) {
            textSize(15);
            text("" + index, this.points[index].x, this.points[index].y-10);
            ellipse(this.points[index].x, this.points[index].y, 4, 4);
        }
    }
    
    drawPolygon(){
        for (let i = 0; i < this.points.length - 1; i++) {
            line(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
        }
        line(this.points[this.points.length - 1].x,this.points[this.points.length - 1].y,this.points[0].x, this.points[0].y);
    }

    drawPoint(point, txt, size){
        text(txt, point.x, point.y-10);
        ellipse(point.x, point.y, size, size);
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
                tempPoints[i] = this.correctIndex(index+1+i);

            }
            this.points = [...tempPoints];
        }


        //Check if a point is inside or outside the polygon
        //len = this.points.length
        //TODO : Algorithme en O(n) peut devenir O(log n) si binary search
        //WARNING : Not used 
        isPointInsideCHVersion(point){
            let comparatorPoint = this.points[0];
            let vertice = null;
            for(let i = 1; i < this.points.length-1; i ++){
                if(orientationDeterminant(comparatorPoint, point, this.points[i])
                !== orientationDeterminant(comparatorPoint, point, this.points[i+1])){
                    //edge from i to i+1;
                    vertice = i;
                }
            }
            if(vertice !== null){
                let orientation =
                orientationDeterminant(this.points[vertice], this.points[vertice+1], point);
                if(orientation === 1 || orientation === 0){
                    return false;
                } else{
                    return true;
                }
            } else{
                return false;
            }
        }
    }