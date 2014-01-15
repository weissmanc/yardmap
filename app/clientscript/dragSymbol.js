//Requires hosting page to include d3.js


var dragSymbol = (function () {

    //Remember if a drag results in a symbol actually moving. Needed since d3.drag will trigger select on
    //just a click
    var dragActive = null;

    //Initialize the drag drop machine with a calllback that will be executed when user
    //completes the drag I.e, to add a new symbol or just move an existing
    function init(onEnd) {

        return d3.behavior.drag()
            .origin(Object)
            .on("dragstart", dragstart)
            .on("drag", dragmove)
        //Call drag end function passing user callback in
            .on("dragend", function (d) { dragend(onEnd, d); });
    }


    function dragstart(data) {

        //console.log(this, data, d3.event);

    }

    function dragmove(data) {
        //console.log(this);

        if (null == dragActive) {
            //Where is the cursor
            var left = d3.event.sourceEvent.x + "px";
            var top = d3.event.sourceEvent.y + "px";

            //Create a clone and move this
            dragActive = this.cloneNode(true);
            d3.select(dragActive).classed("cloned", true)
                .style("top", top)
                .style("left", left);
            document.body.appendChild(dragActive);

        }

        var rect = d3.select(dragActive);
        var top = parseInt(rect.style("top"));
        var left = parseInt(rect.style("left"));

        rect
        .style("top", (top += d3.event.dy) + "px")
        .style("left", (left += d3.event.dx) + "px");


    }

    //Call user onDragEnd function passing in the clone (dragActive) and d3 data for the element if any
    function dragend(onDragEnd, d) {

        if (dragActive) {

            //Call drop action
            try {

                //Pass in the clone and original data (if any) 
                console.log("dragend", dragActive, d);
                onDragEnd(dragActive, d);

            }
            catch (err) {
                console.log("drop error:", err);
            }
            finally {

                dragActive.parentNode.removeChild(dragActive);
                dragActive = null;
            }
        }
    }

    return {
        init: init
    };

})();





