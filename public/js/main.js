$(document).ready(()=> {

    window.rows = 20;
    window.columns = 46;
    window.d = 25;
    
    document.addEventListener('contextmenu', event => event.preventDefault());
    var canvas = document.getElementById("canv");
    var ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    var connectingPoints = false;
    var activePoint = -1;
    var deletePointsInterval;
    var deletingPoints = false;

    var movingPoints = false;
    var currentMovedPoint = -1;

    var mouseButtonDown = -1
    
    // physics
    window.g = 0.9;
    window.f = 0.99;
    window.b = 0.8;
    
    // initial velocity
    const initialX = 0;
    const initialY = 0;
    
    // other
    const connectPointsAutomatically = false;
    const radius = 3;

    var x;
    var y;

    window.drawPoints = true;
    window.drawSticks = true;
    
    // PARAMETERS
    
    var points = new Array();
    var sticks = new Array();
    
    canvas.onmousedown = function(e){
    
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    
        if (e.button === 2)
        {

            // Set point as non - movable
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
    
            window.renderPoints();
            window.renderSticks();
    
        }
        else if (e.button === 0){
            // Create point
            if (window.create == 1){
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

            // Connect points
            if (window.create == 2)
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
                    window.renderPoints();
                    window.renderSticks();
        
                }else{  // Fail connection
                    connectingPoints = false;
                    activePoint = -1;
        
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    window.renderPoints();
                    window.renderSticks();
                }
            }
    
            mouseButtonDown = 0;
    
        }
    }
    
    // Stop deleting points
    canvas.onmouseup = function(e){
        if (e.button === 0 && deletingPoints)
        {
            clearInterval(deletePointsInterval);
            mouseButtonDown = -1;
            deletingPoints = false;
        }
        else if (e.button === 0 && movingPoints)
        {
            mouseButtonDown = -1;
            movingPoints = false;
            points[currentMovedPoint].movesAfterCursor = false;
            currentMovedPoint = -1;
        }
    }
    
    const drawPoint = (p) => {
        if (window.drawPoints){
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.closePath();
        }
    }
    
    const drawSingleStick = (s) => {
        ctx.beginPath();
        ctx.moveTo(s.p0.x, s.p0.y);

        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.thickness;
        
        ctx.lineTo(s.p1.x, s.p1.y);
        
        ctx.stroke();
        ctx.closePath();

    }

    window.update = update = () => {
        if (window.play)
        {
            updatePoints();
        
            for (var i = 0; i < 3; i++) {
                updateSticks();
                constrainPoints();
            }
        
            window.renderPoints();
            window.renderSticks();
        
            requestAnimationFrame(update);
    
        }
    }
    
    const updatePoints = () => {
        points.forEach(p => {
            if (p.movable && !p.movesAfterCursor)
            {
                let vx = (p.x - p.oldx) * window.f;
                let vy = (p.y - p.oldy)* window.f;
        
                p.oldx = p.x
                p.oldy = p.y
        
                p.x += vx;
                p.y += vy;
                p.y += window.g;
            }else if (p.movable && p.movesAfterCursor)
            {
                p.x = x;
                p.y = y;
            }
        });
    }
    
    const constrainPoints = () => {
        points.forEach(p => {
            if (p.movable)
            {
                let vx = (p.x - p.oldx) * window.f;
                let vy = (p.y - p.oldy) * window.f;
        
                if(p.x > canvas.width){
                    p.x = canvas.width;
                    p.oldx = p.x + vx * window.b;
                }
                else if(p.x < 0)
                {
                    p.x = 0; 
                    p.oldx = p.x + vx * window.b;
                }
        
                if(p.y > canvas.height)
                {
                    p.y = canvas.height;
                    p.oldy = p.y + vy * window.b;
                }
                else if (p.y < 0)
                {
                    p.y = 0;
                    p.oldy = p.y + vy * window.b;
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
    
    window.renderPoints = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.forEach(p =>{
            drawPoint(p)
        });
    }
    
    window.renderSticks = () => {
        if(window.drawSticks)
        {
            ctx.beginPath();
            sticks.forEach(s => {
                ctx.moveTo(s.p0.x, s.p0.y);
                ctx.strokeStyle = s.color;
                ctx.lineWidth = s.thickness;
                ctx.lineTo(s.p1.x, s.p1.y);
            })
        
            ctx.stroke();
        }
    }
    
    canv.addEventListener('mousemove', function(e) {
    
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    
        if (connectingPoints && activePoint != -1)
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            window.renderPoints();
            window.renderSticks();
            drawSingleStick(new stick(points[activePoint], {x, y}))
            
        }
    
        // Deleting points
        if (window.create == 0 && mouseButtonDown === 0) // Delete points
        {
            deletingPoints = true;
            var p = collision(x, y, points, radius+8);
            if (p != -1)
            {
                for (let i = 0; i != 2; i++){
                    sticks.forEach((s, i) => {
                        if (
                            (s.p0.x == points[p].x && s.p0.y == points[p].y) ||
                            (s.p1.x == points[p].x && s.p1.y == points[p].y)
                        )
                        {
                            sticks.splice(i, 1);
                        }
                    })
                }
                
                points.splice(p, 1);
                window.renderPoints();
                window.renderSticks();
            }
            p = -1;
        // Moving points
        }else if (window.create == 3 && mouseButtonDown === 0 && currentMovedPoint == -1){
            movingPoints = true;
            var p = collision(x, y, points, radius+8);
            if (p != -1)
            {
                currentMovedPoint = p;
                points[p].movesAfterCursor = true;
            }
            p=-1
        }
    });
    
    const shiftOut = document.querySelector('p');
    shiftOut.addEventListener('shiftOut', e=> {
        window.renderSticks();
    }, false);
    
    window.standartPreset = () => {
    
        points = []
        sticks = []

        let startX = (canv.width/2)-(window.d*window.columns/2);
        let startY = (canv.height/2)-(window.d*window.rows/2) ? (canv.height/2)-(window.d*window.rows/2) <= canv.height: canv.height;
        let immovablePointCounter = 0;
        let verticalOffset = 0;

        window.d =  parseInt(window.d);

        let dontTouchX = startX;
        for(var i = 0; i < window.columns * window.rows; i++) {
    
            // Start a new row each time
            if (i % window.columns == 0){
                startY += window.d;
                dontTouchX = startX;
                verticalOffset += window.columns;
            }
            dontTouchX += window.d;
    
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
            if (immovablePointCounter < window.columns)
                immovablePointCounter += 1;
    
            if (points.length > 1) {
                if (i % window.columns != 0)
                {
                    sticks.push(new stick(
                        points[points.length - 1],
                        points[points.length - 2]
                        ))
                }
    
                if (i >= window.columns)
                {
                    sticks.push(new stick(
                        points[i - window.columns],
                        points[i]
                        ))
                }
            }
        }
    
        window.renderPoints();
        window.renderSticks();
    }
    standartPreset();
    
    })
    