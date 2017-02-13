/*
 Copyright (c) 2016, BrightPoint Consulting, Inc.

 This source code is covered under the following license: http://vizuly.io/commercial-license/

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// @version 1.1.44

//
// This is the base component for a vizuly halo component
//
vizuly.viz.halo_cluster = function (parent) {

    // This is the object that provides pseudo "protected" properties that the vizuly.viz function helps create
    var scope={};

    var properties = {
        "data" : null,          // Expects array of transaction data in format of {haloKey: value, nodeKey: value, nodeGroupKey: value, value: value };
        "margin": {             // Our margin object
            "top": "10%",       // Top margin
            "bottom": "7%",     // Bottom margin
            "left": "9%",       // Left margin
            "right": "7%"       // Right margin
        },
        "duration": 500,        // This the time in ms used for any component generated transitions
        "width": 300,           // Overall width of component
        "height": 300,          // Height of component
        "padAngle" : 1,         // How much distance between the halo arcs
        "haloThickness" : 0.05, // Percentage value total radius to define halo
        "haloKey" : null,       // function(d) that defines the arc grouping (the primary arcs around the circle)
        "nodeKey" : null,       // function(d) that defines the node grouping (the circles themselves)
        "nodeGroupKey" : null,  // function(d) that defines the distinct node groups (groups based on a value, (republican, democrate, etc..)
        "value" : null          // function(d) that defines the value parameter used to determine the transaction amount.

    };

    // Custom events that this viz will emit for various display elements
    var customEvents = ["linkover","nodeover","arcover","linkout","nodeout","arcout","nodeclick"];

    // Create our viz and type it
    var viz=vizuly.component.create(parent,scope,properties,customEvents);
    viz.type="viz.chart.halo_cluster";

    // Flag to see if data has changed - we need this because the data will need to be re-prepped if this happens
    var _dataChanged = false;
    viz.on("data_change.internal",function () { _dataChanged=true; });

    // Measurements

    var size;                   // Holds the 'size' variable as defined in viz.util.size()
    var radian = Math.PI/180;   // Constant for radian conversion
    var innerRadius;            // Calculated inner radius of Halo
    var outerRadius ;           // Calculated outer radius of Halo

    // Definitions
    // Halo: The outer ring surrounding all of the nodes
    // Halo Group: A section of the halo (one segment of the halo)  (haloKey)
    // Halo Slice: A slice of a Halo Group (one segment within a halo group) (each row in data source)
    // Node: The circles in the middle of the visual (nodeKey)
    // Link: The path elements that link a Halo Slice to a node (each row in data source)
    // Cluster: A distinct group of nodes (democrat vs. republican) (nodeGroupKey)

    // d3 path generator for the halo arcs
    var haloArc = d3.svg.arc();
    
    // d3 layout for each halo group
    var haloLayout = d3.layout.pie();
    
    // d3 layout for each halo slice
    var haloSliceLayout = d3.layout.pie();
    
    // d3 layout for radius and position of each node
    var nodeLayout = d3.layout.pack();
    
    // d3 diagonal path generator for each link
    var linkLayout = d3.svg.diagonal.radial();

    // For this visual we have a lot of data prep and object relationships to keep track of.
    // We store them here:

    var haloArcs;                   // Stores all of the data grouped by halo arcs
    var nodes;                  // Stores all of the data grouped by nodes
    var nodeHash;               // A hash that connects each node to the links that come into it
    var clusters;               // Contains the node groups
    var nodeData;               // Layout data from the nodeLayout

    // These are all d3.selection objects we use to insert and update svg elements int
    var svg,g,background, plot, plotBackground, haloPlot, nodePlot, linkPlot, defs;


    initialize();

    // Here we set up all of our svg layout elements using a 'vz-XX' class namespace.  This routine is only called once
    // These are all place holder groups for the individual data driven display elements.   We use these to do general
    // sizing and margin layout.  The all are referenced as D3 selections.
    function initialize() {

        svg = scope.selection.append("svg").attr("id", scope.id).style("overflow","visible").attr("class","vizuly");
        defs = vizuly.util.getDefs(viz);
        background = svg.append("rect").attr("class","vz-background");
        g = svg.append("g").attr("class","vz-halo-viz");
        plot = g.append("g").attr("class","vz-halo-plot").attr("clip-path","url(#" + scope.id + "_plotClipPath)");
        plotBackground = plot.append("rect").attr("class","vz-plot-background");
        linkPlot = plot.append("g").attr("class","vz-halo-link-plot");
        nodePlot = plot.append("g").attr("class","vz-halo-node-plot");
        haloPlot = plot.append("g").attr("class","vz-halo-arc-plot");

        // Tell everyone we are done initializing
        scope.dispatch.initialize();
    }

    // The measure function performs any measurement or layout calcuations prior to making any updates to the SVG elements
    function measure() {

        // Call our validate routine and make sure all component properties have been set
        viz.validate();

        // If the data has changed since the last time we were called then we need to re prep the data
        // and remove all elements.
        if (_dataChanged == true) {
            prepData();
            linkPlot.selectAll("path").remove();
            linkPlot.selectAll("circle").remove();
            haloPlot.selectAll("path").remove();
            nodePlot.selectAll("circle").remove();
            _dataChanged = false;
        }

        // Get our size based on height, width, and margin
        size = vizuly.util.size(scope.margin, scope.width, scope.height);

        // Calcuate the outer radius of the halo
        outerRadius = Math.min(size.width,size.height)/2;

        // Calculate the inner radius of the halo
        innerRadius = outerRadius*(1-scope.haloThickness);

        // Set our node layout properties
        nodeLayout.size([innerRadius*2 *.99,innerRadius*2 * .99])
            .padding(2)
            .sort(null)
            .value(function (d) { return d.value; })
            .children(function (d) { return d.children; });

        // Set our halo layout properties
        haloLayout.padAngle(scope.padAngle*radian)
            .startAngle(0)
            .endAngle(360*radian)
            .value(function (d) { return d.value; });

        // Set our halo slice layout properties
        haloSliceLayout.value(scope.value).padAngle(0);

        // Set our halo arc path generator properties
        haloArc.outerRadius(outerRadius).innerRadius(innerRadius);

        // Get our node layout data to render (we remove the outermost nodes, which are the node groups, we don't
        // want to render these, just use them for the pack layout calcs.
        nodeData = nodeLayout.nodes({children:clusters}).filter(function (d) { return (d.depth > 1)});

        // Tell everyone we are done measuring
        scope.dispatch.measure();

        // The node hash contains total amounts for every link associated with a node, we need these
        // We store this value in the aggregate property.  We use this to determine the radius of the node
        for (var node in nodeHash) {
            nodeHash[node].aggregate=0;
        };

    }

    // The update function is the primary function that is called when we want to render the visualiation based on
    // all of its set properties.  A developer can change properties of the components and it will not show on the screen
    // until the update function is called
    function update() {

        // Call measure each time before we update to make sure all our our layout properties are set correctly
        measure();

        // Update our major place holder elements
        svg.attr("width", scope.width).attr("height", scope.height);
        background.attr("width", scope.width).attr("height", scope.height);
        plot.style("width",size.width).style("height",size.height).attr("transform","translate(" + size.left + "," + size.top +  ")");
        haloPlot.attr("transform","translate(" + size.width/2 + "," + size.height/2 + ")");
        linkPlot.attr("transform","translate(" + size.width/2 + "," + size.height/2 + ")");
        nodePlot.attr("transform","translate(" + (size.width-innerRadius*2)/2 + "," + (size.height-innerRadius*2)/2 + ")");

        // Create the primary halo arcs based on the halo groups and add our event dispatches
        var haloGroup = haloPlot.selectAll(".vz-halo-arc").data(haloLayout(haloArcs));
        haloGroup.enter().append("path")
            .attr("class",function(d) { return "vz-halo-arc " + "halo-key_" + d.data.key })
            .on("mouseover",function (d,i) { scope.dispatch.arcover(this,d,i) })
            .on("mouseout",function (d,i) { scope.dispatch.arcout(this,d,i) });
        haloGroup.exit().remove();
        haloGroup.attr("d",function (d,i) {
            return haloArc(d,i);
        });

        // Store the centroids for each arc group.
        // Themes or page developers can use these stored centroids to place data tips or other information in the
        // center of the group.
        haloGroup.each(function (haloSection) {
            var angle=(haloSection.startAngle + (haloSection.endAngle-haloSection.startAngle)/2)-90*radian;
            haloSection.x=innerRadius * Math.cos(angle);
            haloSection.y=innerRadius * Math.sin(angle);
        });

         var links = linkPlot.selectAll(".vz-halo-group").data(haloLayout(haloArcs));
         links.enter().append("g").attr("class","vz-halo-group");
         links.exit().remove();


        // For each arc group draw a smaller arc, path link, and node circle for each transaction within that arc.
        links.each(function (arcGroup) {

            // Set our new pie layout based on the start/end angles of the arc group.
            haloSliceLayout.startAngle(arcGroup.startAngle+haloLayout.padAngle()/1.415).endAngle(arcGroup.endAngle-haloLayout.padAngle()/1.415);

            // Create our link group
            var link = d3.select(this).selectAll(".vz-halo-link").data(haloSliceLayout(arcGroup.data.values));
            link.enter().append("g").attr("class","vz-halo-link");
            link.exit().remove();

            link.selectAll("path").remove();
            link.selectAll("circle").remove();

            // Add our path for the transaction arcs
            link.append("path").attr("class",function (d) { return "vz-halo-arc-slice node-key_" + scope.nodeKey(d.data); })
                .attr("d",haloArc);

            // For each transaction arc add the link path, and node circle;
            var t=0;
            link.each(function (arc) {
                var linkPath=createLinkPath(arc);

                // Add a circle node with a radius showing the relative link value to all links for that node.
                var node=nodeHash[scope.nodeKey(arc.data)];

                //Adding our link path for each slice of the arc
                var arcSlice = d3.select(this);
                arcSlice.append("path").attr("class",
                    "vz-halo-link-path node-key_" + scope.nodeKey(arc.data) + " halo-key_" + scope.haloKey(arc.data))
                    .on("mouseover",function (d,i) { scope.dispatch.linkover(this,d,i) })
                    .on("mouseout",function (d,i) { scope.dispatch.linkout(this,d,i) })
                    .attr("d",function (d,i) {
                        //This takes two line paths, connects them and creates an arc at the end
                        var diag = linkLayout(linkPath.arc_to_node,i);
                        diag += "L" + String(linkLayout(linkPath.node_to_arc,i)).substr(1);
                        diag += "A" + (innerRadius) + "," + (innerRadius) + " 0 0,0 " +  linkPath.arc_to_node.source.x + "," + linkPath.arc_to_node.source.y;
                    return diag;
                });

                // For each transaction (row in data source) we make a corresponding circle relative to the total
                // size of the node.   This is why you see various opacitys for each node
                // a more opaque node had more transactions than a more transparent one.
                node.aggregate=node.aggregate + scope.value(arc.data);
                var nodeRadius = node.aggregate/node.value * node.r;
                arcSlice.append("circle").attr("class","vz-halo-link-node node-key_" + scope.nodeKey(arc.data) + " halo-key_" + scope.haloKey(arc.data))
                    .attr("r",0)
                    .attr("cx",node.x-innerRadius)
                    .attr("cy",node.y-innerRadius)
                    .transition().duration(scope.duration)
                    .attr("r",nodeRadius);

            });
        });

        // Each node gets its own circle - we create them here and add our event dispatches
        var circle = nodePlot.selectAll(".vz-halo-node").data(nodeData);
        circle.enter().append("circle").attr("class",function (d) { return "vz-halo-node node-key_" + d.key; })
            .on("mouseover",function (d,i) { scope.dispatch.nodeover(this,d,i) })
            .on("mouseout",function (d,i) { scope.dispatch.nodeout(this,d,i) })
            .on("click",function (d,i) { scope.dispatch.nodeclick(this,d,i) });
        circle.exit().remove();
        circle.attr("r",0)
            .attr("cx",function (d) { return d.x })
            .attr("cy",function (d) { return d.y })
            .transition().duration(scope.duration).attr("r",function (d) { return d.r; });

        // Tell everyone we are done with our udpate
        scope.dispatch.update();

    }

    // Here we create a path element that starts at the outside arc and comes to a
    // sharp point at the circle (node) and then goes back to the outside arc.
    function createLinkPath(arcSlice) {

        var node=nodeHash[scope.nodeKey(arcSlice.data)]; //Get the node we are linking to
        var link={};
        link.data = arcSlice.data;

        var o = {}; //Create the link from the start angle of the arc slice to the node
        o.source={};
        o.source.x = innerRadius * Math.cos(arcSlice.startAngle  - 1.57079633) //-(90 degrees)
        o.source.y = innerRadius * Math.sin(arcSlice.startAngle - 1.57079633);
        o.target = {};
        o.target.x = node.x - innerRadius;
        o.target.y = node.y - innerRadius;

        var p = {}; //Create a reverse link from node back to the end angle of the arc slice;
        p.target={};
        p.target.x = innerRadius * Math.cos(arcSlice.endAngle  - 1.57079633) //-(90 degrees)
        p.target.y = innerRadius * Math.sin(arcSlice.endAngle - 1.57079633);
        p.source = o.target;

        link.arc_to_node=o;
        link.node_to_arc=p;

        return link;
    }

    // Before we can render the data we need to perform some preparation so we can
    // organize the data to render the various geometries
    // The data should be passed in as an array of objects with the following properties
    //
    // object {
    //     value: numeric amount
    //     nodeKey: the unique identifier for the node
    //     nodeGroupKey:  the unique identifier for the group the node belongs to
    //     haloKey: the unique identifier for the halo section
    // }
    //
    // In this example we are using the halo_contribution.csv file which has the following values
    //
    //  contribution {
    //      TRANSACTION_AMT: The amount of the contribution  (size of node)
    //      CAND_ID: The unqiue candidate id (the unique node)
    //      PTY:  The candidate party affiliation (the node cluster)
    //      CMTE_ID: The committee that provided the funds for the contribution (the halo arc group)
    // }
    //
    // Each row in the data source is considered a link - as it ties together the transaction
    // to a specific candidate and committee.  Each link is shown as a path in the visual

    function prepData() {

        // Group the data by the halo keys
        haloArcs = d3.nest().key(scope.haloKey).entries(scope.data);
        // Group the nodes by the node keys
        nodes = d3.nest().key(scope.nodeKey).entries(scope.data);

        // Create the cluster keys for the primary node groups
        var clusterKeys = d3.nest().key(scope.nodeGroupKey).key(scope.nodeKey).entries(scope.data);

        // Get our totals for both the halo groups and the nodes
        sumGroup(haloArcs);
        sumGroup(nodes);

        // Create a hash so for each unique node id we associate all transactions with it
        // i.e. for each Candidate we attach each contribution.
        nodeHash=[];
        nodes.forEach(function (d) {
            d.nodeGroup = scope.nodeGroupKey(d.values[0]);
            nodeHash[scope.nodeKey(d.values[0])]=d;
        });

        // Create the unique node clusters
        // i.e. Republican, Democrat, Indepdendent
        clusters=[];
        clusterKeys.forEach(function (d) {
            var o={};
            o.id = d.key;
            o.values = nodes.filter(function (n) {return (d.key == n.nodeGroup)});
            o.children = o.values;
            clusters.push(o);
        });

        // Sum the total of the clusters
        sumGroup(clusters,"value");

    }

    // A utility function that sums the values within a group.
    function sumGroup(group,key) {
        group.forEach(function (d) {
            var sum = 0;
            d.values.forEach(function(o) {
                if (key) {
                    sum+=Number(o[key]);
                }
                else {
                    sum+=Number(scope.value(o));
                }
            });
            d.value = sum;
        });
    }

    // This is our public update call that all viz components implement
    viz.update = function () {
        update();
        return viz;
    };

    // Returns our glorious viz component :)
    return viz;

};