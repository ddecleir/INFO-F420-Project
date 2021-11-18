// Source : 
// https://dirask.com/posts/JavaScript-how-to-calculate-intersection-point-of-two-lines-for-given-4-points-VjvnAj
function calculateIntersection(p1, p2, p3, p4) {
	
    // down part of intersection point formula
    var d1 = (p1.x - p2.x) * (p3.y - p4.y); // (x1 - x2) * (y3 - y4)
    var d2 = (p1.y - p2.y) * (p3.x - p4.x); // (y1 - y2) * (x3 - x4)
    var d  = (d1) - (d2);

    if(d == 0) {
      throw new Error('Number of intersection points is zero or infinity.');
  }

    // upper part of intersection point formula
    var u1 = (p1.x * p2.y - p1.y * p2.x); // (x1 * y2 - y1 * x2)
    var u4 = (p3.x * p4.y - p3.y * p4.x); // (x3 * y4 - y3 * x4)
    
    var u2x = p3.x - p4.x; // (x3 - x4)
    var u3x = p1.x - p2.x; // (x1 - x2)
    var u2y = p3.y - p4.y; // (y3 - y4)
    var u3y = p1.y - p2.y; // (y1 - y2)

    // intersection point formula
    
    var px = (u1 * u2x - u3x * u4) / d;
    var py = (u1 * u2y - u3y * u4) / d;

    return new Point(px, py);
}

// https://en.wikipedia.org/wiki/Euclidean_distance
function calculateDistance(point1, point2){
    return Math.sqrt(Math.pow((point1.x-point2.x),2) + Math.pow((point1.y-point2.y),2));
}

function calculateDistanceWithoutAbs(point1, point2){
    return (point1.x-point2.x) + (point1.y-point2.y);
}

function checkIfSegmentHitsSegment(a, b, c, d) {
    if (
      orientationDeterminant(d, c, a) !== orientationDeterminant(d, c, b) &&
      orientationDeterminant(a, b, c) !== orientationDeterminant(a, b, d)
    ) {
      return true;
    } else {
      return false;
    }
}

  //The orientation determinant
function orientationDeterminant(a, b, c) {
      // vector u = b-a & Vector v = b-c
      let crossProduct = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
      if (crossProduct > 0) {
          return 1;
      } else if (crossProduct === 0) {
          return 0;
      } else {
          return -1;
      }
}

// Is a between b and c 
// Source : https://www.kite.com/python/answers/how-to-determine-if-a-point-is-on-a-line-segment-in-python
function pointBetweenTwoOthers(a,b,c){
  let slope = (b.y - a.y)/(b.x-a.x);
  let pt3_on = Math.round((c.y-a.y)) === Math.round(slope*(c.x-a.x));
  let pt3_between = (Math.min(a.x, b.x) <= c.x <= Math.max(a.x, b.x)) && (Math.min(a.y, b.y) <= c.y <= Math.max(a.y, b.y));
  return (pt3_on && pt3_between);

}