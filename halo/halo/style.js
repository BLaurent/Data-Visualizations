
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