window.create = false;
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
    if (window.create)
    {
        $( "#panel-switch-create" ).text("CREATE");
        window.create = false;
    }
    else
    {
        $( "#panel-switch-create" ).text("DESTROY");
        window.create = true;
    }
}