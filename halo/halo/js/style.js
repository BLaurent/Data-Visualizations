
/* FILE contains helper code used for stylistic purposes or to initialize new elements */


/* CHECKBOX DIV ELEMENT */

function createCheckbox(KEY){ return '<div style="overflow: visible;"><input class="filled-in" onClick="changeNaics'+num+'()" type="checkbox" id="'+ KEY +num+'" value="'+ KEY +
'" ><label padding: 0px; style="overflow: visible;" onmouseover="showLabel(this)" onmouseout="hideLabel(this)" style="font-family:Courier New; color: #EEE;" for="'+KEY+num+'">'+KEY+'</label >&nbsp&nbsp&nbsp<a class="link" href="#" onClick="deleteCheckBox()" class="classname">x</a></div>';
}

function showLabel(x){

    var naics = x.parentNode.children[0].value;
    var height = x.parentNode.clientHeight;
    $(x).parent().append("<div style='width: 200px; top: -23px; border-radius: 3px; "
        + "left: 134px; background-color: white; opacity: .9; position: relative; font-size:12px;"
        + "color: #444; box-shadow: 1px 1px 3px #888888; font-family: 'Helvetica', 'Arial', sans-serif;"
        + "margin: 30px;  z-index: 10;'>"
        + TechIndustries[naics]+"</div>");
    $(x).parent().css("height", height);

}
function hideLabel(x){
    $(x).parent().children('div').remove();
}
/* Adds indentation to Search filter and other styling */

function formatFilter(key){
    if(key.length == 2){
        $("#"+key).css("font-weight", "bold");
    }
    if(key.length == 4){
        $("#"+key).css("padding-left", "20px");
    }   
    if(key.length == 5){
        $("#"+key).css("padding-left", " 40px");
    }
    if(key.length == 6){
        $("#"+key).css("padding-left", "40px");
    }
}


function disableAnimation(){

    ANIMATE = false;
    console.log("disable");
    $("#animatebtn1").text("play_arrow");
    $("#animatebtn1").attr("onclick", null).css("color", "#DDD");
    $('.material-icons').hover( function() {
    $(this).css('text-shadow','0 0 0px rgba(0,0,0,0)'); });
    $("#animatebtn2").attr("onclick", "").css("color", "#DDD"); 
    disabled = true;
}

function enableAnimation(){
    console.log("enable");
    $("#animatebtn1").attr("onclick", "play()").css("color", "#4d4d4d");
    $('.material-icons').hover( function() {
    $(this).css("text-shadow", "0 0 5px rgba(0,0,0,0.5)");}, function(){
    $(this).css("text-shadow", "0 0 0px rgba(0,0,0,0.0)");});
    $("#animatebtn2").attr("onclick", "replay()").css("color", "#4d4d4d"); 
    disabled = false;   
}
/* USED TO CREATE FILLER CIRCLES IN PLACE OF HALO WHEN NO DATA IS BEING DISPLAYED */

function createCircle(n, string){
IsCircle[n] = 1;
circle = 
    viz[n].selection().select("svg")
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

    viz[n].selection().select("svg").append("circle")
        .attr("cy", WIDTH/2 + 40)
        .attr("cx", WIDTH/2)
        .attr("r", 178)
        .style("fill", "white")
        .style("fill-opacity", 1);
    viz[n].selection().select("svg").append("circle")
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

    viz[n].selection().select("svg").append("text")
        .text(string)
        .attr("y", viz[n].height()/2 + 20)
        .attr("x", viz[n].width()/2)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-family", "Raleway")
        .style("font-size", "20px")
        .style("fill-opacity", .8);
}

function clearCircle(n){
    IsCircle[n] = 0;
    viz[n].selection().select("svg").selectAll("circle")[0][2].remove();
    viz[n].selection().select("svg").selectAll("circle")[0][0].remove();
    viz[n].selection().select("svg").selectAll("text")[0][1].remove();
    viz[n].selection().select("svg").selectAll("circle")[0][0].remove();
}

//
// Function takes D3.text object and wraps onto multiple lines, each line of length width
// Used on Industry Heading
//
function wrap(text, width) {

    text.each(function() {
    var text = d3.select(this),
    words = text.text().split(/\s+/).reverse(),
    word,
    line = [],
    lineNumber = 0,
    lineHeight = 1.1, // ems
    y = text.attr("y"),
    x = 0,
    dy = parseFloat(text.attr("dy")),
    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
    }
  });
}

function createSlider(slider){
    noUiSlider.create(slider, {
        start: [DEFAULT_YEAR],
        margin: 0,
        connect: true,
        direction: 'ltr',
        step: 1,
        height: 10,
        behaviour: 'tap-drag',
        tooltips: true,
        format: wNumb({
            decimals: 0
        }),
        range: {
            'min': 2000,
            'max': 2016,
        },
        pips: {
            mode: 'range',
            stepped: true,
            decimals: 0,
            density: 6
        }
    });
}


// Create a skin object that has all of the same properties as the skin objects in the /themes/halo.js vizuly file
customSkin = {
    name: "custom",
    labelColor: "#FFF",
    labelFill: "#000",
    background_transition: function (selection) {
        viz[num].selection().select(".vz-background").transition(1000).style("fill-opacity", 0);
    },
    // Here we set the contribution colors based on the sponsor_PTY
    link_stroke: function (d, i) {
        return (d.data.sponsor_PTY == "Republican") ? repColor : (d.nodeGroup="Democrat") ? demColor: otherColor;
    },
    link_fill: function (d, i) {
        return (d.data.sponsor_PTY == "Republican") ? repColor : (d.nodeGroup="Democrat") ? demColor: otherColor;
    },
    link_fill_opacity:.2,
    link_node_fill_opacity:.5,
    node_stroke: function (d, i) {
        return "#FFF";
    },
    node_over_stroke: function (d, i) {
        return "#FFF";
    },
    // Here we set the candidate colors based on the sponsor_PTY
    node_fill: function (d, i) {
        return (d.nodeGroup == "Republican") ? repColor : (d.nodeGroup=="Democrat") ? demColor: otherColor;
    },
    arc_stroke: function (d, i) {
        return "#FFF";
    },
    // Here we set the arc contribution colors based on the sponsor_PTY
    arc_fill: function (d, i) {
        return (d.data.sponsor_PTY == "Republican") ? repColor : (d.nodeGroup =="Democrat") ? demColor: otherColor;
    },
    arc_over_fill: function (d, i) {
        return "#000";
    },
    class: "vz-skin-political-influence"
}

