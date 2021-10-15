window.create = 0; // 0 - destroy / 1 - create / 2 - connect
window.play = false;

// TO-DO
// window.drawPoints = true;
// window.drawSticks = true;

function playButton(e){
    if (window.play)
    {
        $( "#panel-switch-play" ).text("PLAY");
        window.play = false;
    }        
    else
    {
        $( "#panel-switch-play" ).text("PAUSE");
        window.play = true;
        window.update();
    }
}

function createButton(e){
    if (window.create === 0)
    {
        $( "#panel-switch-create" ).text("CONNECT");
        window.create = 1; // Create
    }
    else if (window.create === 1)
    {
        $( "#panel-switch-create" ).text("MOVE");
        window.create = 2; //Connect
    }
    else if (window.create === 2)
    {
        $( "#panel-switch-create" ).text("DESTROY");
        window.create = 3; // Move
    }else{
        $( "#panel-switch-create" ).text("CREATE");
        window.create = 0; // Destory
    }
    console.log(window.create);
}

function loadPreset(e)
{
    let rows = $( "#preset-rows" ).val();
    let columns = $( "#preset-columns" ).val();
    let d = $( "#preset-distance" ).val();
    if (rows && columns && d)
    {
        window.rows = rows;
        window.columns = columns;
        window.d = d;
        window.standartPreset();
    }
}

function gravity(val){
    $( "#gravity-label" ).text(val);
    window.g = parseInt(val);}

function friction(val){
    $( "#friction-label" ).text(val);
    window.f = parseInt(val);}
function bounce(val){
    $( "#bounce-label" ).text(val);
    window.b = parseInt(val);}


function changePoints(){
    window.drawPoints = !window.drawPoints;
    window.renderPoints();
    window.renderSticks();
}

function changeSticks(){
    window.drawSticks = !window.drawSticks;
    window.renderPoints();
    window.renderSticks();
}