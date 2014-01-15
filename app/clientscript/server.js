//Stuff for interfacing with the server
//Requires host page to include d3.js

var server = (function () {

    var testTimer = -1; //just for stub
    var pollTimer = -1;
    var pollInterval = 5000;

    //Send a request to server to add a new group
    function addGroup(gdata, callback) {
        var data = {
            request: "add group",
            requestData: gdata
        }

        sendData(data, callback);

    }

    //Send a request to server to move existing group
    function moveGroup(gdata, callback) {
        var data = {
            request: "move group",
            requestData: gdata
        }

        sendData(data, callback);

    }

    //Send a request to server to delete existing group
    function deleteGroup(gdata, callback) {
        var data = {
            request: "delete group",
            requestData: gdata
        }

        sendData(data, callback);

    }

    //Sends an entire data object containing all symbol group information.
    //User supplied callback function is executed when request completes.
    //  callback is passed the following variables:
    //      error: info on any errors
    //      json: data returned from the server which in almost every case will be the same data sent
    //              unless another user made a modification in-between.
    function sendData(data, callback) {
        console.log("sending data to server...");

        //TODO - add d3.json call. For now just a timer
        //STUB =====
        if (testTimer > 0) {
            clearTimeout(testTimer);
        }
        var f = function () {
            serverStub.doSendCallback(callback, data);
        }
        testTimer = setTimeout(f, 500);

        //====================
    }


    //Get symbol groups as array of group divs from bound data
    function getSymbolGroups() {
        var symbolGroupData = d3.selectAll("div.symbolGroupDiv").data();
        var gdata = new Array();
        for (var i = 0; i < symbolGroupData.length; i++) {
            gdata.push(symbolGroupData[i]);
        }
        return gdata;
    }


    //Poll the server for the latest data
    function poll(callback) {

        console.log("Polling");

        //Stub for now. Just simulate data callback
        try {

            callback(serverStub.test_data);
        }
        finally {
            //do it again
            pollTimer = setTimeout(function () { poll(callback); }, pollInterval);
        }
    }



    return {
        sendData: sendData,
        getSymbolGroups: getSymbolGroups,
        addGroup: addGroup,
        deleteGroup: deleteGroup,
        moveGroup: moveGroup,
        poll: poll
    };


})();                        //End of creator


