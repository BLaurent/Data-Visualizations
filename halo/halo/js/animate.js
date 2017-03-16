
/* FILE contains implementation of automation of data changes per year */

function animate_graph(){
    ANIMATE = true;
    if(Number(yearTOP) <= Number(currentYEAR) && ANIMATE == true){
        setTimeout(function(){ next(); }, 1000); // display changes every 1.5 seconds
    }
    else {
        $("#animatebtn1").text("play_arrow");
        $("#animatebtn1").attr("onclick", "play()");
    }
    return;
}

function next(){
    console.log("in next");
    if(ANIMATE == true) {
        viz_slider[1].noUiSlider.set(yearTOP);
        if(viz_slider[2] != undefined){
            viz_slider[2].noUiSlider.set(yearTOP);
            num=2
            concatData();
            updateHeading();
        }
        num=1;
        concatData();
        updateHeading();
        yearTOP = Number(yearTOP) +1;
        animate_graph();
    }
}
function replay(){
    console.log("on replay");
    pause();
    viz_slider[1].noUiSlider.set(2000);
    if(viz_slider[2] != undefined){
        viz_slider[2].noUiSlider.set(2000);
    }
}

function pause(){
    ANIMATE = false;
    $("#animatebtn1").attr("onclick","play()");
    $("#animatebtn1").text("play_arrow");
}

function play(){;
    ANIMATE = true;
    $("#animatebtn1").attr("onclick","pause()");
    $("#animatebtn1").text("pause");
    if(yearTOP <= currentYEAR ){ next(); }
}




