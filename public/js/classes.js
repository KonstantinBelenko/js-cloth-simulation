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
    constructor(p0, p1, color, thickness) {
        this.p0 = p0;
        this.p1 = p1;
        this.length = distance(p0, p1);
        this.color = "white";
        this.thickness = 2;
    }
}