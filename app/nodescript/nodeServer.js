//Stubs to simulate the server during development

var serverStub = (function () {

    //test data
    var test_data =
	    [
		    { group: { id: "g1", left: "140px", top: "85px" },
		        symbols: [{ id: "s1", src: "trainSymbolLeftSmall.PNG", labelTxt: "g1s1", labelFg: "black", labelBg: "white", notes: "this is a note"}]
		    },
		    { group: { id: "g2", left: "200px", top: "245px" },
		        symbols: [{ id: "s2", src: "trainSymbolLeftSmall.PNG", labelTxt: "g2s1", labelFg: "black", labelBg: "white", notes: "this is a note" },
				      { id: "s3", src: "trainSymbolRightSmall.PNG", labelTxt: "g2s2", labelFg: "red", labelBg: "#a0a0a0", notes: "this is a note"}]
		    }
	    ];

    function doSendCallback(callback, data) {

        console.log("Server send successfull");

        try {

            if (data.request == "add group") {
                data.requestData.group.id = generate_uid();

                //Push onto test data array
                test_data.push(data.requestData);

            }
            else if (data.request == "move group") {
                for (var i = 0; i < test_data.length; i++) {
                    if (test_data[i].group.id == data.requestData.id) {
                        test_data[i].group.left = data.requestData.left;
                        test_data[i].group.top = data.requestData.top;
                        break;
                    }
                }
            }
            else if (data.request == "delete group") {
                for (var i = 0; i < test_data.length; i++) {
                    if (test_data[i].group.id == data.requestData.id) {
                        test_data.splice(i, 1);
                        break;
                    }
                }
            }
            callback(test_data);
        }
        catch (error) {
            //do nothing
        }
    }

    function doPollCallback(callback, data) {

        console.log("Server poll successfull");

        try {

            callback(test_data);
        }
        catch (error) {
            //do nothing
        }
    }


    function generate_uid() {
        return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }

    return {
        test_data: test_data,
        doSendCallback: doSendCallback,
        doPollCallback: doPollCallback
    };


})();