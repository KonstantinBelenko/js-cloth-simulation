class point{
    constructor(x, y, initialX, initialY){
        this.x = x;
        this.y = y;
        this.oldx = this.x + initialX;
        this.oldy = this.y + initialY;
        this.color = "white";
        this.movable = true;
    }

    setPos(x, y) {
        this.x = x;
        this.y = -y;
        this.oldx = x;
        this.oldy = -y;
    }
}

class stick{
    constructor(p0, p1, length) {
        this.p0 = p0;
        this.p1 = p1;
        this.length = distance(p0, p1);
    }
}

const distance = (p0, p1) => {
    var dx = p1.x - p0.x
    var dy = p1.y - p0.y
    return Math.sqrt(dx * dx + dy * dy);
}