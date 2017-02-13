


// Create a skin object that has all of the same properties as the skin objects in the /themes/halo.js vizuly file
//
// This is an example of defining a custom skin that creates a different look than the stock ones.
// We want to create a skin that shows the relative political parties by using the party colors
// republican = red and democrat = blue
//
// You can see how we attach and set this skin in the initialize routine at the top of this file with these two lines
//   theme.skins()["custom"]=customSkin;
//   theme.skin("custom");
//

// Set our party colors

//
// This is an example of defining a custom skin that creates a different look than the stock ones.
// We want to create a skin that shows the relative political parties by using the party colors
// republican = red and democrat = blue
//
// You can see how we attach and set this skin in the initialize routine at the top of this file with these two lines
//   theme.skins()["custom"]=customSkin;
//   theme.skin("custom");
//

//
// Functions used by the test container to set various properties of the viz
//
function changeSkin(val) {
    if (!val) return;
    theme.skin(val);
    viz.update();
}

// Set our party colors
var repColor="#F80018";
var demColor="#0543bc";
var otherColor="#FFa400";

// Create a skin object that has all of the same properties as the skin objects in the /themes/halo.js vizuly file
var customSkin = {
    name: "custom",
    labelColor: "#FFF",
    labelFill: "#FFF",
    background_transition: function (selection) {
        viz.selection().select(".vz-background").transition(1000).style("fill-opacity", 0);
    },
    // Here we set the contribution colors based on the party
    link_stroke: function (d, i) {
        return (d.data.PTY == "REP") ? repColor : (d.nodeGroup="DEM") ? demColor: otherColor;
    },
    link_fill: function (d, i) {
        return (d.data.PTY == "REP") ? repColor : (d.nodeGroup="DEM") ? demColor: otherColor;
    },
    link_fill_opacity:.2,
    link_node_fill_opacity:.5,
    node_stroke: function (d, i) {
        return "#FFF";
    },
    node_over_stroke: function (d, i) {
        return "#FFF";
    },
    // Here we set the candidate colors based on the party
    node_fill: function (d, i) {
        return (d.nodeGroup == "REP") ? repColor : (d.nodeGroup=="DEM") ? demColor: otherColor;
    },
    arc_stroke: function (d, i) {
        return "#FFF";
    },
    // Here we set the arc contribution colors based on the party
    arc_fill: function (d, i) {
        return (d.data.PTY == "REP") ? repColor : (d.nodeGroup=="DEM") ? demColor: otherColor;
    },
    arc_over_fill: function (d, i) {
        return "#000";
    },
    class: "vz-skin-political-influence"
}
var customSkin2 = {
    name: "custom2",
    labelColor: "#FFF",
    labelFill: "#000",
    background_transition: function (selection) {
        console.log("background transition");
        viz.selection().select(".vz-background").transition(1000).style("fill-opacity", 0);
    },
    link_stroke: function (d, i) {
        return "#FFF";
    },
   link_fill: function (d, i) {
        return (d.data.PTY == "REP") ? repColor : (d.nodeGroup="DEM") ? demColor: otherColor;
    },    link_fill_opacity:.1,
    link_node_fill_opacity:.8,
    node_stroke: function (d, i) {
        return "repColor";
    },
    node_over_stroke: function (d, i) {
        return "#demColor";
    },
    // Here we set the candidate colors based on the party
    node_fill: function (d, i) {
        return (d.nodeGroup == "REP") ? repColor : (d.nodeGroup=="DEM") ? demColor: otherColor;
    },
    arc_stroke: function (d, i) {
        return "#FFF";
    },
    // Here we set the arc contribution colors based on the party
    arc_fill: function (d, i) {
        return "#FFF";
    },
    arc_over_fill: function (d, i) {
        return "#FFF";
    },
    class: "vz-skin-political-influence"
}

var customSkin3 = {
    name: "custom",
    labelColor: "#FFF",
    labelFill: "#000",
    background_transition: function (selection) {
        viz.selection().select(".vz-background").transition(1000).style("fill-opacity", 0);
    },
    // Here we set the contribution colors based on the party
    link_stroke: function (d, i) {
        return (d.data.PTY == "REP") ? repColor : (d.nodeGroup="DEM") ? demColor: otherColor;
    },
    link_fill: function (d, i) {
        return (d.data.PTY == "REP") ? repColor : (d.nodeGroup="DEM") ? demColor: otherColor;
    },
    link_fill_opacity:.2,
    link_node_fill_opacity:.5,
    node_stroke: function (d, i) {
        return "#FFF";
    },
    node_over_stroke: function (d, i) {
        return "#FFF";
    },
    // Here we set the candidate colors based on the party
    node_fill: function (d, i) {
        return "#FFF";
    },
    arc_stroke: function (d, i) {
        return "#FFF";
    },
    // Here we set the arc contribution colors based on the party
    arc_fill: function (d, i) {
        return (d.data.PTY == "REP") ? repColor : (d.nodeGroup=="DEM") ? demColor: otherColor;
    },
    arc_over_fill: function (d, i) {
        return "#000";
    },
    class: "vz-skin-political-influence"
}

