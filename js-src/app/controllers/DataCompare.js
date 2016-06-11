app.controller('DataCompare', function(){
    var dataCompare = this;

    dataCompare.leftDataText = "";
    dataCompare.rightDataText = "";
    
    dataCompare.leftDataMatrix = [
        [1, "foo", true],
        [2, "bar", false]
    ];

    dataCompare.rebuildLeftDataMatrix = function (dataString) {
        dataCompare.leftDataMatrix = new DataMatrix(dataString);
    };

    dataCompare.rightDataMatrix = [
        [2, "bar", false],
        [1, "foo", true]
    ];
});