app.controller('DataCompare', ['DataProcessing',function(DataProcessing){
    var dataCompare = this;

    dataCompare.processingLeftData = false;
    dataCompare.processingRightData = false;

    /**
     * How many rows of data to show in the primary data table
     * @type {number}
     */
    dataCompare.mainTableRows = 10;

    dataCompare.leftDataText = "";
    dataCompare.rightDataText = "";
    
    dataCompare.leftDataMatrix = [
        [1, "foo", true],
        [2, "bar", false]
    ];

    dataCompare.rightDataMatrix = [
        [2, "bar", false],
        [1, "foo", true]
    ];

    dataCompare.rebuildLeftDataMatrix = function (dataString) {
        dataCompare.processingLeftData = true;
        DataProcessing.stringToDataMatrix(dataString).then(function (dataMatrix) {
            dataCompare.leftDataMatrix = dataMatrix;
            dataCompare.processingLeftData = false;
            //console.log("elements in leftDataMatrix: " + dataCompare.leftDataMatrix.length + "\nelements in first row: " + dataCompare.leftDataMatrix[0].length);
        });
    };

    dataCompare.rebuildRightDataMatrix = function (dataString) {
        dataCompare.processingRightData = true;
        DataProcessing.stringToDataMatrix(dataString).then(function (dataMatrix) {
            dataCompare.rightDataMatrix = dataMatrix;
            dataCompare.processingRightData = false;
            //console.log("elements in rightDataMatrix: " + dataCompare.rightDataMatrix.length + "\nelements in first row: " + dataCompare.rightDataMatrix[0].length);
        });
    };


    dataCompare.getType = function(value){
        var type = typeof value;
        if(type === "number"){
            if((value + "").indexOf(".") >= 0){
                return "decimal";
            }
            else{
                return type;
            }
        }
        else {
            return type;
        }
    }

    //TODO column sorting
    //TODO move business logic to a service
    //TODO make processing asynchrous
}]);