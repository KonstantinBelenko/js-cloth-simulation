// Can change active color to by anything
const activeColor = "blue";

const passiveColor = "rgb(31, 31, 31)";
var bgColor = passiveColor;

const getRandom = (range) => {
    return Math.random() < 0.5 ? Math.random() * -range : Math.random() * range;
}

const samePoint = (x1, y1, x2, y2) => {
    if (x1 == x2 && y1 == y2)
        return true
    else
        return false
}

const collision = (mouseX, mouseY, points, radius) => {
    let returningPoint = -1;
    points.forEach((p, i) => {
        if 
        (
            mouseX > p.x - radius && mouseX < p.x + radius &&
            mouseY > p.y - radius && mouseY < p.y + radius
        )
        {
            returningPoint = i;
        }
    });
    return returningPoint;
}

var tolerance = 10;

function linepointNearestMouse(line, x, y) {
    //
    lerp = function(a, b, x) {
      return (a + x * (b - a));
    };
    var dx = line.p1.x - line.p0.x;
    var dy = line.p1.y - line.p0.y;
    var t = ((x - line.p0.x) * dx + (y - line.p0.y) * dy) / (dx * dx + dy * dy);
    var lineX = lerp(line.p0.x, line.p1.x, t);
    var lineY = lerp(line.p0.y, line.p1.y, t);
    return ({
      x: lineX,
      y: lineY
    });
  };

function handleMousemove(e, sticks, mouseX, mouseY) {
    sticks.forEach(line => {
        e.preventDefault();
        e.stopPropagation();
        if (mouseX < line.p0.x || mouseX > line.p1.x) {
          return;
        }
        var linepoint = linepointNearestMouse(line, mouseX, mouseY);
        var dx = mouseX - linepoint.x;
        var dy = mouseY - linepoint.y;
        var distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
        if (distance < tolerance) {
            console.log("DEAD")
        } else {
            ;
        }
    })
}

const distance = (p0, p1) => {
    var dx = p1.x - p0.x
    var dy = p1.y - p0.y
    return Math.sqrt(dx * dx + dy * dy);
}
