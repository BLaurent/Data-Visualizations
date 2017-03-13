
/* FILE contains helper code used for stylistic purposes or to initialize new elements */

function createCheckbox(KEY){ return '<div><input class="filled-in" onClick="changeNaics'+num+'()" type="checkbox" id="'+ KEY +'" value="'+ KEY +
'" ><label style="font-family:Courier New; color: #EEE;" for="'+KEY+'">'+KEY+'</label>&nbsp&nbsp&nbsp<a class="link" href="#" onClick="deleteCheckBox()" class="classname">x</a></div>';
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

