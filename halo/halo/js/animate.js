var ANIMATE; //bool value that determines if animate feature is on or off
var n;       // variable used to indicate which graph is being animated (value = 1 || 2)

function animate_graph(){
    console.log(yearTOP);
    console.log($("#animatebtn"+n).text())

    if(yearTOP <= currentYEAR ){
        setTimeout(function(){ next(); }, 1500); // display changes every 1.5 seconds
    }
    else {
        $("#animatebtn"+n).text("replay");
        $("#animatebtn"+n).attr("onclick", "replay()");
    }
}

function next(){
    if(ANIMATE == true) {
        console.log(yearTOP);
        viz_slider[n].noUiSlider.set(yearTOP);
        yearLOW = undefined;
        concatData();
        updateHeading();
        yearTOP = Number(yearTOP) +1;
        animate_graph();
    }
}
function replay(){
    n = Num(event.target);
    ANIMATE = true;
    yearTOP = Number(yearTOP) + 1;
    viz_slider[n].noUiSlider.set(2000);
    $("#animatebtn"+n).text("pause");
    $("#animatebtn"+n).attr("onclick", "pause()");
    animate_graph();
}

function pause(){
    n = Num(event.target);
    console.log(event.target.id);
    console.log(n);
    ANIMATE = false;
    $("#animatebtn"+n).attr("onclick","play()");
    $("#animatebtn"+n).text("play_arrow");
}

function play(){
    console.log("IN PLay");
    n = Num(event.target);
    console.log(event.target.id);
    console.log(n);
    ANIMATE = true;
    $("#animatebtn"+n).attr("onclick","pause()");
    $("#animatebtn"+n).text("pause");
    if(yearTOP <= currentYEAR ){ next(); }
}
