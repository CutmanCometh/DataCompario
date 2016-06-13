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
        /*[1, "foo", true],
        [2, "bar", false]
    ];

    dataCompare.rightDataMatrix = [
        /*[2, "bar", false],
        [1, "foo", true]*/
    ];
    
    dataCompare.leftCompareMatrix = [];
    dataCompare.rightCompareMatrix = [];
    
    dataCompare.leftMissingMatrix = [];
    dataCompare.rightMissingMatrix = [];

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
            
            if(dataCompare.leftDataMatrix.length > 0 && dataCompare.rightDataMatrix.length > 0){
                dataCompare.compareMatrices();
            }
            else {
                dataCompare.clearComparisonData();
            }
            //console.log("elements in rightDataMatrix: " + dataCompare.rightDataMatrix.length + "\nelements in first row: " + dataCompare.rightDataMatrix[0].length);
        });
    };
    
    dataCompare.compareMatrices = function () {
        DataProcessing.compareMatrices(dataCompare.leftDataMatrix, dataCompare.rightDataMatrix).then(function (comparison) {
            var leftMissing = comparison.missingFromMatrixB;
            var rightMissing = comparison.missingFromMatrixA;
            var leftCompare = [];
            var rightCompare = [];

            for(var i = 0; i < comparison.difference.length; i++){
                leftCompare.push(comparison.difference[i].a);
                rightCompare.push(comparison.difference[i].b);
            }

            dataCompare.leftCompareMatrix = leftCompare;
            dataCompare.rightCompareMatrix = rightCompare;

            dataCompare.leftMissingMatrix = leftMissing;
            dataCompare.rightMissingMatrix = rightMissing;
        });


    };
    
    dataCompare.clearComparisonData = function () {
        dataCompare.leftCompareMatrix = [];
        dataCompare.rightCompareMatrix = [];
        dataCompare.leftMissingMatrix = [];
        dataCompare.rightMissingMatrix = [];
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