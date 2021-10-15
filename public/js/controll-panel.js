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
        window.create = 1;
    }
    else if (window.create === 1)
    {
        $( "#panel-switch-create" ).text("DESTROY");
        window.create = 2;
    }
    else
    {
        $( "#panel-switch-create" ).text("CREATE");
        window.create = 0;
    }
}

function loadPreset(e)
{
    let rows = $( "#preset-rows" ).val();
    let columns = $( "#preset-columns" ).val();
    if (rows && columns)
    {
        alert(rows + " " + columns)
    }
}