var num;                //used to determine elements of correct halo PRIMARY(1) or SECONDARY(2)
var viz = {};           // vizuly ui objects
var viz_slider ={};     //slider forms for both graphs, PRIMARY(1) and SECONDARY(2)
var theme = {};         // Theme variables for both graphs, PRIMARY(1) and SECONDARY(2)
var naicsCodes = {};    // array naicsCode1 and naicsCode2
var naicsCodes1 = {};   // holds checked codes that are currently/to be displayed in PRIMARY(1) graph
var naicsCodes2 = {};   // holds checked codes that are currently/to be displayed in SECONDARY(2) graph
var Industry_title = {};// D3 selection that holds displayed industry title
var vizData = {};       // updated data used attached to viz selection
var viz_container;      // html element that holds the viz (d3 selection)
var yearTOP;            // upper bound of year range for PRIMARY GRAPH
var loadedIndustries = {};
var circle;
var customSkin;         // biparison theme
var relatedCodes;       // suggested Industy Data based on user's NaicsCode search (NOT IN USE)
var Industry;           // text to go in Industry title
var repColor="#F80018";
var demColor="#0543bc";
var otherColor="#FFa400";
var ANIMATE; //bool value that determines if animate feature is on or off

var WIDTH = 450;
var HEIGHT = 510;
var currentYEAR;
var INDUSTRY_TITLE_WIDTH = 500;
var formatDate = d3.time.format("%b %d, 20%y");

var datatip='<div class="tooltip" style="width: 250px; background-opacity:.5">' +
    '<div class="header-rule"></div>' +
    '<div class="header2"> HEADER2 </div>' +
    '<div class="header-rule"></div>' +
    '<div class="header3"> HEADER3 </div>' +
    '</div>';

function loadData() {
    d3.json("/halo/data/tech_naics/"+DEFAULT_CODE+".json", function (json) {
        data = json;
        //console.log(data);
        resolveDataConflicts(data, DEFAULT_CODE);
        if(IsCircle[2] == 0){
            initPrimary();
        }
        //console.log(vizData);
    });
    d3.csv("/halo/data/2017_NAICS_structure.csv",function (csv) {
        //console.log(csv);
        create_tree_begin(csv);
    });
}

//Initializes Primary Halo Viz.

function initPrimary() {
    /*var url = "http://beta.lobbyview.org/api/viz?legal_name=Google";
    d3.json(url, function(error, d) {
        console.log(d);
    });*/
    num = 1;
    Initialize();
    changeSize(d3.select("#currentDisplay").attr("item_value"));
    updateHeading();
    yearTOP = Number(yearTOP) + 1;
    $("#viz_container"+num).append('<ul class="myUL" id="myUL'+num+'"></ul>');
    $("#viz_container"+num).css("z-index", -2);
    //animate_graph();


    viz_slider[1].noUiSlider.on('set', function(values, handle){
        num = 1;
        if(yearTOP != values[0]){
            yearTOP = values[0];
            yearLOW = undefined;
            ANIMATE = false;
             $("#animatebtn1").attr("onclick","play()");
             $("#animatebtn1").text("play_arrow");
            concatData();
            updateHeading();
        }
    });
}

function Initialize(){

    viz[num] = vizuly.viz.halo_cluster(document.getElementById("viz_container"+num));

    viz[num].data(vizData[DEFAULT_CODE][DEFAULT_YEAR])
        .width(800).height(800)
        .haloKey(function (d) {
            return d.client_ID;})
        .nodeKey(function (d) {
            return d.sponsor_ID;})
        .nodeGroupKey(function (d) {
            return(d.sponsor_PTY);})
        .value(function (d) {
            return d.amount; })
        .on("update", onUpdate)                     // Callback for viz update
        .on("nodeover",node_onMouseOver)            // Callback for mouseover on the candidates
        .on("nodeout",onMouseOut)                   // Callback for mouseout on from the candidate
        .on("arcover",arc_onMouseOver)              // Callback for mouseover on each CLIENT
        .on("arcout",onMouseOut)                    // Callback for mouseout on each CLIENT
        .on("linkover",link_onMouseOver)            // Callback for mousover on each contribution
        .on("linkout",onMouseOut)                   // Callback for mouseout on each contribution
        .on("nodeclick",node_onClick)

    theme[num] = vizuly.theme.halo(viz[num]);
    theme[num].skins()["custom"]=customSkin;
    theme[num].skin("custom");

    Industry_title[num] = viz[num].selection().select("svg").append('text').attr("class", "industry")
        .style("font-family","Raleway")
        .style("font-size", "14")
        .attr("y", '115%')
        .attr("x", 0)
        .attr("dy", 0)
        .text(Industry)
        .call(wrap, INDUSTRY_TITLE_WIDTH);

    viz_slider[num] = document.getElementById("slider"+num);
    createSlider(viz_slider[num]);
    $("#currentDisplay2").css("visibility", "hidden");
}

function onUpdate() {
}
// An example of how you could respond to a node click event
function node_onClick(e,d,i) {                                  
    console.log(d);   //object Dem or Rep node
    console.log(e);   //circle HTML element
    console.log(i);   //element index
    console.log("You have just clicked on " + d.values[0].CAND_NAME);
}

// For each mouse over on the node we want to create a datatip that shows information about the candidate
// and any assoicated PACs that have contributed to the candidate.
function node_onMouseOver(e,d,i) {

    //Find all node links (candidates) and create a label for each arc

    var haloLabels={};
    var links=viz[num].selection().selectAll(".vz-halo-link-path.node-key_" + d.key);
    var total=0;

    //For each link we want to dynamically total the transactions to display them on the datatip.
    links.each(function (d) {
        total+= viz[num].value()(d.data);
        var halos=viz[num].selection().selectAll(".vz-halo-arc.halo-key_" + viz[num].haloKey()(d.data));
        halos.each(function (d) {
            if (!haloLabels[d.data.key]) {
                haloLabels[d.data.key]=1;
                createPacLabel(d.x, d.y,d.data.values[0].client_name);
            }
        })
    });

    //Format the label for the datatip.
    total = "$" + d3.format(",.2f")(total);

    //Create and position the datatip
    var rect = d3.selectAll(".vz-halo-arc-plot")[0][0].getBoundingClientRect();

    var node = viz[num].selection().selectAll(".vz-halo-node.node-key_" + d.key);

    //Create and position the datatip
    var rect = node[0][0].getBoundingClientRect();


    var x = rect.left;
    var y = rect.top + document.body.scrollTop;
    createDataTip(x + d.r, y + d.r + 25, "Politician", d.values[0].sponsor,"Total Received: " + total);
}

// For each PAC we want to create a datatip that shows the total of all contributions by that PAC
function arc_onMouseOver(e,d,i) {

    if(event.target.closest("#viz_container1") != null)
        num = 1;
    else
        num = 2;
    var links=viz[num].selection().selectAll(".vz-halo-link-path.halo-key_" + d.data.key);
    var total=0;
    links.each(function (d) {
        total+= viz[num].value()(d.data);
    });
    total = "$" + d3.format(",.0f")(total);
    //Create and position the datatip
    var rect = viz[num].selection().selectAll(".vz-halo-node-plot")[0][0].getBoundingClientRect();
    createDataTip(d.x + rect.left  + rect.width/2, (d.y + rect.top + 100),"CLIENT", d.data.values[0].client_name,"Total Spent: " + total);
}

// When the user rolls over a link we want to create a lable for the PAC and a data tip for the candidate that the


function link_onMouseOver(e,d,i) {

    if(event.target.closest("#viz_container1") != null)
        num = 1;
    else
        num = 2;
    // find the associated candidate and get values for the datatip
    var cand=viz[num].selection().selectAll(".vz-halo-node.node-key_" + viz[num].nodeKey()(d.data));
    var datum=cand.datum();
    var total = "$" + d3.format(",.0f")(viz[num].value()(d.data));
    var date = d.data.Month + "/" + d.data.Day + "/" + d.data.Year;

    //Create and position the datatip
    var rect = viz[num].selection().selectAll(".vz-halo-arc-plot")[0][0].getBoundingClientRect();
    createDataTip(datum.x + rect.left + datum.r, datum.y + datum.r + 25 + rect.top, date, d.data.sponsor,"Received: " + total);

    //find the pac and create a label for it.
    var client=viz[num].selection().selectAll(".vz-halo-arc.halo-key_" + viz[num].haloKey()(d.data));
    datum= client.datum();
    createPacLabel(datum.x, datum.y, datum.data.values[0].client_name);
}

// This function uses the above html template to replace values and then creates a new <div> that it appends to the
// document.body.  This is just one way you could implement a data tip.

function createDataTip(x,y,h1,h2,h3) {

    var html = datatip.replace("HEADER2", h2);
    html = html.replace("HEADER3", h3);

    d3.select("body")
        .append("div")
        .attr("class", "vz-halo-label")
        .style("position", "absolute")
        .style("top", y + "px")
        .style("left", (x - 125) + "px")
        .style("opacity",0)
        .html(html)
        .transition().style("opacity",1);

}

// This function creates a highlight label with the PAC name when an associated link or candidate has issued a mouseover
// event.  It uses properties from the skin to determine the specific style of the label.

function createPacLabel (x,y,l) {

    var g = viz[num].selection().selectAll(".vz-halo-arc-plot").append("g")
        .attr("class","vz-halo-label")
        .style("pointer-events","none")
        .style("opacity",0);

    g.append("text")
        .style("font-size","11px")
        .style("fill",theme[num].skin().labelColor)
        .style("fill-opacity",.75)
        .attr("text-anchor","middle")
        .attr("x", x)
        .attr("y", y)
        .text(l);

    var rect = g[0][0].getBoundingClientRect();
    g.insert("rect","text")
        .style("shape-rendering","auto")
        .style("fill",theme[num].skin().labelFill)
        .style("opacity",.45)
        .attr("width",rect.width+12)
        .attr("height",rect.height+12)
        .attr("rx",3)
        .attr("ry",3)
        .attr("x", x-5 - rect.width/2)
        .attr("y", y - rect.height-3);

    g.transition().style("opacity",1);
}

// When we mouse out we want to remove all pac datatips and labels.
function onMouseOut(d,i) {
    d3.selectAll(".vz-halo-label").remove();
}


function changeSize(val) {
    var s = String(val).split(",");
    viz_container.transition().duration(300).style('width', s[0] + 'px').style('height', s[1] + 'px');
    viz[num].width(Number(s[0])).height(Number(s[1])).update();
    theme[num].apply();
}

function changeData(new_data) {
    viz[num].data(new_data).update();
}
//
// Functions used by the test container to set various properties of the viz
//
function changeSkin(val) {
    if (!val) return;
    theme[num].skin(val);
    viz[num].update();
}

function updateHeading(){

    Industry = ': ';
    $.each(naicsCodes[num], function(key, val){
        Industry =  Industry + "  " + key + " - " + IndustryNames[key] + "  ";
    })

    if(yearLOW == undefined){
        $("#title"+num).html(yearTOP).css("font-size", "60px");
    }
    else {
        $("#title"+num).html(yearLOW + "<br> - " + yearTOP).css("font-size", "45px");
    }
    $("#gt"+num).html("Lobbying Expenses for Congressional Bills by Firms in Industry Group " + num);
    Industry_title[num].text(Industry).call(wrap, INDUSTRY_TITLE_WIDTH);
}
/***********************************************************************************************************************

                                                SEARCH BOX FILTER

************************************************************************************************************************/

function search(){

    num = Num(event.target);
    var KEY = event.target.value;
    if(event.target.value == ""){
        hideFilter();
    }
    else if(event.target.value.length == 1){
        showFilter();
    }
    else if(event.keyCode == 13){
        hideFilter()
        loadCheckBoxEnter(KEY);
    }
    else{
        $("#myUL"+num).children().remove();
        getfilterOptions(KEY, naics_tree);
    }
    if($("#myUL"+num).children().length > 8){           //adds border if there is an overflow
        $("#myUL"+num).css("border", "1px solid #ddd")
    }
    else{                                               //removes border of UL element if no overflow
        $("#myUL"+num).css("border", "0px solid #ddd")
    }
}

/* Add indentation so that filter represents a tree */

function getfilterOptions(KEY, object){
    $.each(object, function(key, value){
        if(KEY.indexOf(key) == 0 || key.indexOf(KEY) == 0){
            if(key.length <= KEY.length){
                $("#myUL"+num).prepend('<li ><a id='+key+' onclick="loadCheckBoxClick()" >'+key+" : "+value[1]+'</a></li>');
            }
            else{
                $("#myUL"+num).append('<li ><a id='+key+' onclick="loadCheckBoxClick()" >'+key+" : "+value[1]+'</a></li>');
            }
            formatFilter(key);
            getfilterOptions(KEY, object[key][0]);
        }
    });
}
function hideFilter(){
    num = Num(event.target);
    $("#myUL"+num).css("border", "0px solid #ddd");
    event.target.value = "";
    setTimeout(function(){ 
        $("#myUL"+num).children().remove();
        $("#myUL"+num).css("z-index", "-2");

    }, 10);
}

function showFilter(){
    num = Num(event.target);
    $("#myUL"+num).css("z-index", "2");
}
/***********************************************************************************************************************

************************************************************************************************************************/
/*
 * If searched number is a valid code and the code doesn't already have a CB we create a CB for it
 * Is getting into function double the amount of times the second time with KEY = ''; FIX THIS FUNCTION
 */
function loadCheckBoxClick(){
    var KEY = event.target.id;
    if(loadedIndustries[KEY] == undefined){
        loadedIndustries[KEY] = KEY;
        elem = createCheckbox(KEY);
        $("#form"+num).append(elem);
        if($("#form"+num).children().length > 8){
            delete loadedIndustries[$("#form"+num).children()[2].value];
            $("#form"+num).children()[2].remove();    
        }
        d3.json("/halo/data/tech_naics/"+KEY+".json", function (json) {
            data = json;
            resolveDataConflicts(data, KEY);
        });
        $("#search"+num).val("");
    }
}
function loadCheckBoxEnter(KEY){
    if(KEY != '' && IndustryNames[KEY] != undefined && loadedIndustries[KEY] == undefined){
        loadedIndustries[KEY] = KEY;
        num = Num(event.target.parentNode);
        elem = createCheckbox(KEY);
        naicsCodes[num][KEY] = KEY;
        $("#form"+num).append(elem);
        if($("#form"+num).children().length > 8){  
            delete loadedIndustries[$("#form"+num).children()[2].value];
            $("#form"+num).children()[2].remove();
        }

        d3.json("/halo/data/tech_naics/"+KEY+".json", function (json) {
            data = json;
            resolveDataConflicts(data, KEY);
        });
    
     $("#search"+num).val("");
    }
}

function deleteCheckBox() {
    // If checkbox is checked we remove assoc. Industry data from the display
    var elem = event.target.parentNode.children[2].parentNode.parentNode;
    var chkbox = event.target.parentNode.children[0];
    num= Num(elem);
    if(chkbox.checked == true){
        delete naicsCodes[num][chkbox.value];
        concatData();
    }
    delete loadedIndustries[chkbox.value];
    delete event.target.parentNode.remove();
}

/* function used to search DOM tree to see which halo graph (1 or 2) to change */
function Num(element){
    if(element.id.indexOf("1") > -1){
        return 1;
    }
    else
        return 2;
}
/* Adds indentation to filter and other styling */

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




