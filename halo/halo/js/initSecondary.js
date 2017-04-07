
var viz_container2;
var IsCircle = [];
/* hides 2nd halo graph when single view button is clicked */
function unsplit(){
    num = 1;
    $("#btn").attr("onclick","split()").html("DUAL&nbspVIEW");
    $("#currentDisplay").css("left", "18%");
    $("#currentDisplay2").css("visibility", "hidden");

}
/* shows 2nd halo graph when dual view is pushed */
function split(){
    num = 2;
    concatData();
    $("#btn").attr("onClick", "unsplit()").html("SINGLE&nbspVIEW");
    $("#btn").attr("onClick", "unsplit()").html("SINGLE&nbspVIEW");
    $("#currentDisplay").css("left", "0%");
    $("#currentDisplay2").css("visibility", "visible");


}

function initSecondary(){
    num = 2;
    naicsCodes[num] = {};
    yearTOP = 2000;
    loadData();

    viz_container2 = d3.selectAll("#viz_container2")
        .style("width", WIDTH +"px")
        .style("height", HEIGHT +"px");

    Initialize();
    updateHeading();

    $("#viz_container"+num).append('<ul class="myUL" id="myUL'+num+'"></ul>');
    $("#viz_container"+num).css("z-index", -2);

    changeSize(d3.select("#currentDisplay").attr("item_value"));
    createCircle(2, "search for Industries to get started");

    viz_slider[2].noUiSlider.on('set', function(values, handle){
        num = 2;
        updateHeading();
        concatData();
    });
    split();
}


