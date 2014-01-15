//Main application
//Host page also has to load the other script files and d3.js
//

/* TODO
On drop-add do not add unless symbol is dropped within map image
On drop-move do not move unless symbol is dropped within map image. Delete if dropped onto
    trash can symbol
*/

var app = (function () {

    function init() {

        //Setup sybmols that user can drag onto the map to create new groups
        var dragSymbols = d3.select("body").selectAll("img.allowedSymbol")
        .call(dragSymbol.init(function (d) { addSymbol(d); })); /* ====== Enable dragging ===== */

        //Start polling
        server.poll(update);
    }

    //Add a new symbol group. The value fromThis is a symbol that was dragged
    function addSymbol(fromThis) {

        //Drop area must be on the map
        var stage = document.getElementById("stage");
        if (!appUtil.isOverlap(stage, fromThis)) {
            console.log("addSymbol - not dropped onto map.");
            return;
        }


        var newG = d3.select(fromThis);
        var gdata =
        { group: { id: "", //will be assigned by server
            left: newG.style("left"),
            top: newG.style("top")
        },
            symbols: [{ src: newG.attr("src"),
                labelTxt: "???", //Initial symbol label nonesense
                //TODO - get from defaults properties for this src
                labelFg: "black", labelBg: "white",
                notes: ""
            }]
        };

        //Send request to server
        server.addGroup(gdata, function (d) { update(d); });
    }

    //Move symbol group. The value fromThis is a symbol that was dragged
    function moveSymbol(fromThis, data) {

        //If drop area is the trash can then delete
        var trash = document.getElementById("trash");
        if (appUtil.isOverlap(trash, fromThis)) {
            server.deleteGroup({ id: data.group.id }, function (d) { update(d); });
            return;
        }

        //If not dropped onto map then ignore
        var stage = document.getElementById("stage");
        if (!appUtil.isOverlap(stage, fromThis)) {
            console.log("moveSymbol - not dropped onto map.");
            return;
        }


        var newG = d3.select(fromThis);
        var info = {
            id: data.group.id,
            top: newG.style("top"),
            left: newG.style("left")
        };

        //Send request to server
        server.moveGroup(info, function (d) { update(d); });
    }


    function update(data) {

        //Render the divs for each group
        var groupDivs = d3.select("body")
            .selectAll("div.symbolGroupDiv:not(.cloned)")
            .data(data, function (d) { return d.group.id; });
        groupDivs.enter().append("div").classed('symbolGroupDiv', true)
            .call(dragSymbol.init(function (moved, d) { moveSymbol(moved, d); })) /* ====== Enable dragging ===== */ 
        
        groupDivs.transition().style("top", function (d) { return d.group.top; })
            .transition().style("left", function (d) { return d.group.left; });
                   
            
        groupDivs.exit().remove();

        //Render the symbol div for each group div
        var symbolDivs = groupDivs.selectAll("div.symbolDiv")
            .data(function (d, i) { return d.symbols; }, function (d) { return d.id; });
        symbolDivs.enter().append("div").classed("symbolDiv", true);
        symbolDivs.exit().remove();

        var labels = symbolDivs.selectAll("input.symbolTxt").data(function (d) { return [d]; });
        labels.enter().append("input").classed("symbolTxt", true).attr("type", "input")
            .attr("readonly", "readonly")
            .attr("onclick", labelSelect);
        labels.property("value", function (d) { return d.labelTxt; })
            .style("color", function (d) { return d.labelFg; })
            .style("background-color", function (d) { return d.labelBg; })
        labels.exit().remove();

        var imgs = symbolDivs.selectAll("img.symbolImg").data(function (d) { return [d]; })
            .enter().append("img").classed("symbolImg", true);
        imgs.attr("src", function (d) { return d.src; })
            .on("click", symbolSelect);
        //imgs.exit().remove();

    }

    function labelSelect() {
        console.log("labelSelect");
    }

    function symbolSelect() {

        var me = d3.select(this.parentNode.parentNode);
        console.log("symbolSelect",me);
        if (me.classed("selected")) {
            me.classed("selected", false);
            console.log("already selected");
        }
        else {
            me.classed("selected", true);
            console.log("selected");
        }
    }


    //------------- For adding new sybmols to page -----------------

    var newSymbolDragDrop = {


        //To be called when drag starts
        dragstart: function () {
            var dt = event.dataTransfer;
            dt.setData("text/uri-list", event.target.src);
            dt.setData("text/plain", event.target.src);
        },

        //Called when object is dropped in the map div
        drop: function () {
            event.preventDefault();
            var data = event.dataTransfer.getData("Text");

            //Add to document bound data
            console.log(data);
            //serverAddSymbol({ src: data, top: event.clientY, left: event.clientX });
        },

        //Called when object is dragged over map div
        dragover: function dragover() {
            event.preventDefault();
        }
    };

    /////////// - public app members
    return {
        init: init
    };


})();


