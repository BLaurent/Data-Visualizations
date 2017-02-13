
var viz_container2;
var initialized; //true or false
function unsplit(){

    num = 1;
    $("#btn").attr("onclick","split()").html("DUAL&nbspVIEW");
    $("#currentDisplay").css("left", "18%");
    $("#currentDisplay2").css("visibility", "hidden");

}
function split(){

    num = 2;
    viz[num]
    console.log(relatedCodes);
    concatData();
    $("#btn").attr("onClick", "unsplit()").html("SINGLE&nbspVIEW");
    $("#btn").attr("onClick", "unsplit()").html("SINGLE&nbspVIEW");
    $("#currentDisplay").css("left", "0%");
    $("#currentDisplay2").css("visibility", "visible");
}

function initSecondary(){
    num = 2;
    Initialized = 1;
    naicsCodes[num] = {};

    loadData();

    viz_container2 = d3.selectAll("#viz_container2")
        .style("width", WIDTH +"px")
        .style("height", HEIGHT +"px");

    Initialize();
    updateHeading();
    changeSize(d3.select("#currentDisplay").attr("item_value"));

        var circle = viz[2].selection().select("svg")
        .append("circle")
        .attr("cy", WIDTH/2 + 40)
        .attr("cx", WIDTH/2)
        .attr("r", 188)
        .style("fill", "#F80018")
        .style("fill-opacity", .4)
        .on('mouseover', function(d){
            d3.select(this).style({fill:'#390000'})
            d3.select(this).style('fill-opacity',.9)
            })
        .on('mouseout', function(d){
            d3.select(this).style('fill',"#F80018")
            d3.select(this).style('fill-opacity',.4);
            });

         viz[2].selection().select("svg").append("circle")
        .attr("cy", WIDTH/2 + 40)
        .attr("cx", WIDTH/2)
        .attr("r", 178)
        .style("fill", "white")
        .style("fill-opacity", 1);
        viz[2].selection().select("svg").append("circle")
        .attr("cy", WIDTH/2 + 40)
        .attr("cx", WIDTH/2)
        .attr("r", 178)
        .style("fill", "#F80018")
        .style("fill-opacity", .15)
        .on('mouseover', function(d){
            circle.style({'fill':'#390000'}).style({'fill-opacity': .9})
            d3.select(this).style({'fill-opacity': .6});
        })
        .on('mouseout', function(d){
            d3.select(this).style({'fill-opacity': .15});
            circle.style({'fill': "#F80018"}).style({'fill-opacity': .4});

        });

        viz[2].selection().select("svg").append("text")
        .text("search for Industries to get started")
        .attr("y", viz[2].height()/2 + 20)
        .attr("x", viz[2].width()/2)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-family", "Raleway")
        .style("font-size", "20px")
        .style("fill-opacity", .8);

        viz[2].selection().select("svg").append("text")
        .text("<<")
        .attr("x", WIDTH/5)
        .attr("y", WIDTH/2 -20)
        .style("fill", "white")
        .style("font-family", "Raleway")
        .style("font-size", "100px")
        .style("fill-opacity", .3);

    viz_slider[2].noUiSlider.on('set', function(values, handle){
        num = 2;
        yearTOP = values[0];
        //yearLOW = values[1];
        pause();
        updateHeading();
        concatData();
    });
    split();
}


