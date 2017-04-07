
/* FILE contains implementation of automation of data changes per year */

function animate_graph(){

    if(getYear(1) < Number(currentYEAR) && ANIMATE == true){
        setTimeout(function(){ next(); }, 1000); // display changes every 1.5 seconds
    }
    else {
        $("#animatebtn1").text("play_arrow");
        $("#animatebtn1").attr("onclick", "play()");
    }
    return;
}

function next(){
    if(ANIMATE == true) {
        if(viz_slider[2] != undefined){
            num=2
            viz_slider[num].noUiSlider.set(getYear()+1);
            concatData();
            updateHeading();
        }
        num=1;
        viz_slider[num].noUiSlider.set(getYear()+1);
        concatData();
        updateHeading();
        animate_graph();
    }
}
function replay(){
    pause();
    viz_slider[1].noUiSlider.set(2000);
    if(viz_slider[2] != undefined){
        viz_slider[2].noUiSlider.set(2000);
    }
}

function pause(){
    ANIMATE = false;
    $("#animatebtn1").prop('onclick',null).off('click');
    setTimeout(function(){  $("#animatebtn1").attr("onclick","play()");
     }, 1000);
    $("#animatebtn1").text("play_arrow");
}

function play(){;
    ANIMATE = true;
    $("#animatebtn1").text("pause");
    $("#animatebtn1").attr("onclick","pause()");
    if(getYear(1) <= currentYEAR ){ next(); }
}
function getYear(n){
    if (n==undefined){
        return Number(viz_slider[num].noUiSlider.get());
    }
    else
        return Number(viz_slider[n].noUiSlider.get());
}



