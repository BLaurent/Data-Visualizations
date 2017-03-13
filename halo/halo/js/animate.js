var ANIMATE; //bool value that determines if animate feature is on or off
var n;       // variable used to indicate which graph is being animated (value = 1 || 2)

function animate_graph(){
    ANIMATE = true;
    if(Number(yearTOP) <= Number(currentYEAR) ){
        setTimeout(function(){ next(); }, 1500); // display changes every 1.5 seconds
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
        yearLOW = undefined;
        num = 1;
        concatData();
        updateHeading();
        yearTOP = Number(yearTOP) +1;
        animate_graph();
    }
}
/*function replay(){
    console.log("replay")
    n = Num(event.target);
    ANIMATE = true;
    yearTOP = Number(yearTOP) + 1;
    viz_slider[n].noUiSlider.set(2000);
    $("#animatebtn"+n).text("pause");
    $("#animatebtn"+n).attr("onclick", "pause()");
    animate_graph();
    return;
}*/

function pause(){
    console.log(n);
    ANIMATE = false;
    $("#animatebtn1").attr("onclick","play()");
    $("#animatebtn1").text("play_arrow");
    console.log("end of pause");
}

function play(){;
    ANIMATE = true;
    $("#animatebtn1").attr("onclick","pause()");
    $("#animatebtn1").text("pause");
    if(yearTOP <= currentYEAR ){ next(); }
}
/*******************************************************************************************************************

                                        Animate for 2nd Halo Graph 
    
*******************************************************************************************************************/

function animate_graph2(){
    console.log("animate_garph2");
    ANIMATE = true;
    if(Number(yearTOP) <= Number(currentYEAR) ){
        setTimeout(function(){ next2(); }, 1500); // display changes every 1.5 seconds
    }
    else {
        $("#animatebtn2").text("play_arrow");
        $("#animatebtn2").attr("onclick", "play2()");
    }
    return;
}

function next2(){
    console.log("next2");
    if(ANIMATE == true) {
        viz_slider[2].noUiSlider.set(yearTOP);
        yearLOW = undefined;
        num = 2;
        concatData();
        updateHeading();
        yearTOP = Number(yearTOP) +1;
        animate_graph2();
    }
}
/*function replay(){
    console.log("replay")
    n = Num(event.target);
    ANIMATE = true;
    yearTOP = Number(yearTOP) + 1;
    viz_slider[n].noUiSlider.set(2000);
    $("#animatebtn"+n).text("pause");
    $("#animatebtn"+n).attr("onclick", "pause()");
    animate_graph();
    return;
}*/

function pause2(){
    console.log("pause2");
    ANIMATE = false;
    $("#animatebtn2").attr("onclick","play2()");
    $("#animatebtn2").text("play_arrow");
}

function play2(){;
    console.log("play2");
    ANIMATE = true;
    console.log("in play2");
    $("#animatebtn2").attr("onclick","pause2()");
    $("#animatebtn2").text("pause");
    if(yearTOP <= currentYEAR ){ next2(); }
    return;
}

