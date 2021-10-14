$(document).ready(()=> {

document.addEventListener('contextmenu', event => event.preventDefault());

var canvas = document.getElementById("canv");
var ctx = canvas.getContext('2d');

const rect = canvas.getBoundingClientRect();

var playStarted = false;
var connectingPoints = false;
var activePoint = -1;
var deletePointsInterval;
var mouseButtonDown = -1;

// PARAMETERS

// physics
const bounce = 0.8;
const gravity = 1;
const friction = 0.999;

// initial velocity
const initialX = 0;
const initialY = 0;

// other
const connectPointsAutomatically = false;
const radius = 3;

// PARAMETERS

const points = new Array();
const sticks = new Array();

canvas.onmousedown = function(e){

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (e.button === 2)
    {
        // Set point as non - movable
        if (window.shifting) 
        {
            let p = collision(x, y, points, radius);
            if (!connectingPoints && p != -1)
            {
                if (points[p].movable === true)
                {
                    points[p].movable = false;
                    points[p].color = "red"; 
                }else{
                    points[p].movable = true;
                    points[p].color = "white";
                }
            }

            renderPoints();
            renderSticks();

            return;
        }
        else{
            // Start play
            if (!playStarted)
            {
                playStarted = true;
                update();
            }else
                playStarted = false;
        }
    }
    else if (e.button === 0){

        if (window.shifting)
        {
            let p = collision(x, y, points, radius);
            if (!connectingPoints && p != -1) // START connection
            {
                connectingPoints = true;
                activePoint = p;
            }else if (connectingPoints && p != -1 && p != activePoint){ // End connection
                
                sticks.push(new stick(points[activePoint], points[p]));
                
                connectingPoints = false;
                activePoint = -1;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                renderPoints();
                renderSticks();

            }else{  // Fail connection
                connectingPoints = false;
                activePoint = -1;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                renderPoints();
                renderSticks();
            }
            return;
        }else if (!window.shifting && !playStarted){
            points.push(new point(x, y, initialX, initialY));

            // Connect points with sticks automatically
            if (points.length > 1 && connectPointsAutomatically)
            {
                sticks.push(new stick(
                    points[points.length - 2],
                    points[points.length - 1]
                    ))
                
                drawStick(sticks[sticks.length - 1]);
            }
            drawPoint(points[points.length - 1]);
        }

        mouseButtonDown = 0;

    }
}

canvas.onmouseup = function(e){
    if (e.button === 0)
    {
        clearInterval(deletePointsInterval);
        mouseButtonDown = -1;
    }
}

const drawPoint = (p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = p.color;
    ctx.fill();
}
const drawStick = (s) => {
    ctx.beginPath();
    ctx.moveTo(s.p0.x, s.p0.y);
    ctx.lineTo(s.p1.x, s.p1.y);
    ctx.strokeStyle = "white";
    ctx.stroke();
}

const update = () => {

    if (playStarted)
    {
        updatePoints();
    
        for (var i = 0; i < 3; i++) {
            updateSticks();
            constrainPoints();
        }
    
        renderPoints();
        renderSticks();
    
        requestAnimationFrame(update);

    }
}

const updatePoints = () => {
    points.forEach(p => {
        if (p.movable)
        {
            let vx = (p.x - p.oldx) * friction;
            let vy = (p.y - p.oldy)* friction;
    
            p.oldx = p.x
            p.oldy = p.y
    
            p.x += vx;
            p.y += vy;
            p.y += gravity;
        }
    });
}

const constrainPoints = () => {
    points.forEach(p => {
        if (p.movable)
        {
            let vx = (p.x - p.oldx) * friction;
            let vy = (p.y - p.oldy) * friction;
    
            if(p.x > canvas.width){
                p.x = canvas.width;
                p.oldx = p.x + vx * bounce;
            }
            else if(p.x < 0)
            {
                p.x = 0; 
                p.oldx = p.x + vx * bounce;
            }
    
            if(p.y > canvas.height)
            {
                p.y = canvas.height;
                p.oldy = p.y + vy * bounce;
            }
            else if (p.y < 0)
            {
                p.y = 0;
                p.oldy = p.y + vy * bounce;
            }
        }
    })
}

const updateSticks = () => {
    sticks.forEach(s => {

        

        let dx = s.p1.x - s.p0.x;
        let dy = s.p1.y - s.p0.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let difference = s.length - distance;
        let percent = difference / distance / 2;
        
        let offsetX = dx * percent;
        let offsetY = dy * percent; 

        if (s.p0.movable)
        {
            s.p0.x -= offsetX;
            s.p0.y -= offsetY; 
        }

        if (s.p1.movable)
        {
            s.p1.x += offsetX;
            s.p1.y += offsetY;
        }
    })
}

const renderPoints = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach(p =>{
        drawPoint(p)
    });
}

const renderSticks = () => {
    ctx.beginPath();
    sticks.forEach(s => {
        ctx.moveTo(s.p0.x, s.p0.y);
        ctx.lineTo(s.p1.x, s.p1.y);
    })

    ctx.strokeStyle = "white";
    ctx.stroke();
}

canv.addEventListener('mousemove', function(e) {

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (connectingPoints && activePoint != -1 && window.shifting)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderPoints();
        renderSticks();
        drawStick(new stick(points[activePoint], {x, y}))
    }

    if (!window.shifting && playStarted && mouseButtonDown === 0) // Delete points
    {
        deletePointsInterval = setInterval(()=>{
            let p = collision(x, y, points, radius+8)
            if (p != -1)
            {

                sticks.forEach((s, i) => {
                    if ((s.p0.x == points[p].x && s.p0.y == points[p].y))
                        sticks.splice(i, 1);
                    if ((s.p1.x == points[p].x && s.p1.y == points[p].y))
                        sticks.splice(i, 1);
                })

                points.splice(p, 1);
                renderPoints();
                renderSticks();
            }
        }, 50);
    }
});

const shiftOut = document.querySelector('p');
shiftOut.addEventListener('shiftOut', e=> {
    renderSticks();
}, false);

const standartPreset = () => {

    let startX = 400;
    let startY = 100;
    let immovablePointCounter = 0;
    let verticalOffset = 0;

    let columns = 46;
    let rows = 20;
    let d = 20;

    let dontTouchX = startX;
    for(var i = 0; i < columns * rows; i++) {

        // Start a new row each time
        if (i % columns == 0){
            startY += d
            dontTouchX = startX
            verticalOffset += columns;
        }
        dontTouchX += d;

        // Create new points
        points.push(
            new point(
                dontTouchX,
                startY,
                0,
                0
            )
        );

        // set immovable points
        if (immovablePointCounter % 4 == 0){
            points[points.length - 1].movable = false;
            points[points.length - 1].color = 'red';
        }
        if (immovablePointCounter < columns)
            immovablePointCounter += 1;

        if (points.length > 1) {
            if (i % columns != 0)
            {
                sticks.push(new stick(
                    points[points.length - 1],
                    points[points.length - 2]
                    ))
            }

            if (i >= columns)
            {
                sticks.push(new stick(
                    points[i - columns],
                    points[i]
                    ))
            }
        }
    }

    renderPoints();
    renderSticks();
    console.log(sticks.length)
}
standartPreset();

})
