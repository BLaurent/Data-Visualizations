
var viz_container2;

function unsplit(){

    num = 1;
    $("#btn").attr("onclick","split()").html("DUAL");
    $("#currentDisplay").css("left", "18%");
    $("#currentDisplay2").css("visibility", "hidden");

}
function split(){

    num = 2;
    viz[num]
    console.log(relatedCodes);
    concatData();
    $("#btn").attr("onClick", "unsplit()").html("SINGLE");
    $("#currentDisplay").css("left", "0%");
    $("#currentDisplay2").css("visibility", "visible");
}

function initSecondary(){
    num = 2;
    naicsCodes[num] = {};

    loadData();

    viz_container2 = d3.selectAll("#viz_container2")
        .style("width", WIDTH +"px")
        .style("height", HEIGHT +"px");

    Initialize();
    updateHeading();
    changeSize(d3.select("#currentDisplay").attr("item_value"));

    viz_slider[2].noUiSlider.on('set', function(values, handle){
        num = 2;
        yearTOP = values[0];
        if(values[1] == undefined){
            yearLOW = undefined;
        }
        else{
            yearLOW = values[1];
        }
        updateHeading();
        concatData();
    });
    split();
}


