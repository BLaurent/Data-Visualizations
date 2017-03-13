/*
 * Responsible for getting appropriate data from database to display. Filters out only necessary information including
 * sponsor info, monetary contributions, and firm info. concatenates data info one simple array of client to
 * sponsor instances.
 *
 */

var tmpArr = [];
var Nodes = "sponsors";
var DEFAULT_CODE;
var DEFAULT_YEAR;
var naics_tree = {};
var node;
var index = 0;

function create_tree_begin(data){
    var parentbranch = naics_tree;
    var parentName;
    create_tree(data, parentbranch, parentName);
}

function create_tree(data, parentbranch, parentName)
{
    node = data[index];
    if(data.length == 0 || node == undefined){ //if we have stored all naicscodes and naicstitles we return
        return;
    }
    else if(node["2017 NAICS Code"].indexOf(parentName) > -1 || parentbranch == naics_tree){
        create_new_branch(data, parentbranch, parentName);
    }
    else{
        return;
    }
    if(data.length != 0 && node != undefined){
        if(node["2017 NAICS Code"].indexOf(parentName) > -1 || parentbranch == naics_tree){
            create_tree(data,parentbranch,parentName);
        }
    }
}

function create_new_branch(data, parentbranch, parentName){
    var obj = {};
    var array = [obj, node["2017 NAICS Title"]];
    parentbranch[node["2017 NAICS Code"]] = array;
    parentbranch = parentbranch[node["2017 NAICS Code"]][0];
    parentName = node["2017 NAICS Code"];
    delete data[0];
    index++;
    create_tree(data, parentbranch, parentName)
}


function resolveDataConflicts(data, code){

    vizData[code] = {};
    for(i=0; i < data.length; i++){

        var year = data[i].year;
        if(data[i].specific_issues == undefined ){
            continue;
        }
        if(vizData[code][year] == undefined){
            vizData[code][year] = [];
        }
            for(x=0; x < data[i].specific_issues.length; x++){
                var report_info = data[i].specific_issues[x];

    /* Nodes can be either sponsors of a bill or Government Entities */

                    if (Nodes == "sponsors" &&  report_info.bills_by_algo != undefined) {
                        tmpArr = addSponsors(data, i, x, code, year);
                    }
                    /* else if(Nodes == "GovEntities" &&  report_info.gov_entities != undefined){
                        vizData[vizData.length] = addGovEntities(data, i, x);

                    } NOT IMPLEMENTED YET */
                    else{
                        continue;
                    }
            }
    }
    return vizData;
}
     /* represents instance of a halo link and node using a key-value array which holds sponsorship info */
function addSponsors(data, i, x, code, year){
    temp = [];
    report_info = data[i].specific_issues[x];
    for(y = 0; y < report_info.bills_by_algo.length; y++){
            var report_info = data[i].specific_issues[x];
            if(report_info.bills_by_algo[y].sponsor == undefined || data[i].client.bvdid == undefined || data[i].amount
                == undefined ){
                console.log("sponsor is undefined");
                continue;
            }
            var array = [];
            array.firstname = report_info.bills_by_algo[y].sponsor.firstname;
            array.lastname = report_info.bills_by_algo[y].sponsor.lastname;
            array.sponsor_ID = report_info.bills_by_algo[y].sponsor.id;
            //array.sponsor_ID = sponsor_ID.replace(/\s/g, '');
            array.sponsor_PTY = report_info.bills_by_algo[y].sponsor.party;
            array.sponsor = array.firstname + " "+ array.lastname;
            array.amount = data[i].amount;
            array.year = data[i].year;
            array.client_ID = data[i].client.bvdid;
            array.client_name = data[i].client_name;
            vizData[code][year][vizData[code][year].length] = array;
    }
}


/* creates instance of halo link where nodes are govEntities (NOT IMPLEMENTED YET) */
function addGovEntities(data, array, i, x){
    return;
}

/* update assoc. array of naicsCodes that are to be displayed. Called when check box is checked or unchecked */
function changeNaics1(){
    console.log(num);
    num = 1;  
    console.log("changeNaics1");                      //get rid of these two functions
    changeNaics();
}
function changeNaics2(){
    console.log('changeNaics2');
    num = 2;
    if(initialized == 1){
        clear();
        initialized = 2;
    }
    changeNaics();
}
function clear(){
    viz[2].selection().select("svg").selectAll("circle")[0][2].remove();
    viz[2].selection().select("svg").selectAll("circle")[0][0].remove();
    viz[2].selection().select("svg").selectAll("text")[0][2].remove();
    viz[2].selection().select("svg").selectAll("text")[0][1].remove();
    viz[2].selection().select("svg").selectAll("circle")[0][0].remove();
}
function changeNaics(){
    naicsCode = String(event.target.value);
    console.log(naicsCode);
    console.log(num);
    if( event.target.checked == false){
        delete naicsCodes[num][naicsCode];
    }
    else{
        naicsCodes[num][naicsCode] = naicsCode;
    }
    updateHeading();
    concatData();
}
function concatData(){

     var new_data = [];
     if(yearLOW == undefined){
         $.each(naicsCodes[num], function(index, value){
            if(vizData[index][yearTOP] != undefined){

                new_data = new_data.concat(vizData[index][yearTOP]);
            }
         });
     }
     else {
        console.log(yearTOP-yearLOW);
         $.each(naicsCodes[num], function(index, value){
            var y=0;
            for(x = yearLOW; y <= (yearTOP-yearLOW) ; x++){
                new_data = new_data.concat(vizData[index][x]);
                y++
            }
         });
     }
     changeData(new_data);
}



