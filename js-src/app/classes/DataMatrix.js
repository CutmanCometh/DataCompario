/**
 * Created by CutmanCometh on 6/7/16.
 */


function DataMatrix(dataString){
    var arrayOfDataStrings = dataString.split("\n");
    var dataMatrix = new Array(arrayOfDataStrings.length);

    for(var i = 0; i < arrayOfDataStrings.length; i++){
        dataMatrix[i] = DataMatrix.getRowFromDataString(arrayOfDataStrings[i]);
    }

    return dataMatrix;
}

DataMatrix.booleanPattern = /^(?:true|false)$/;

/**
 * If this is set to true, the string "NULL" we be treated like an empty string, and will evaluate to the javascript value null.
 * @type {boolean}
 */
DataMatrix.sqlNULLs = true;


DataMatrix.getRowFromDataString = function(dataString){
    var dataArray = dataString.split("\t");
    dataArray.forEach(function (word, index, dataArrayRef) {//fix each value as either a trimmed string or null
        dataArrayRef[index] = DataMatrix.getValue(word);
    });
    return dataArray;
};

DataMatrix.getValue = function(string){
    if((string = string.trim()) === '' || (DataMatrix.sqlNULLs && string === 'NULL')){
        return null;}//assign it for use later if needed. if the value of the assignment operation is the empty string, or an SQL NULL and sqlNULLs is turned on, return null

    if(isFinite(string)){//if it's a number, return the numeric value
        return string - 0;}//this is faster. jsperf.com it

    if(DataMatrix.booleanPattern.test(string)){//if it's a boolean, return the boolean value
        return string === "true";}

    return string;//it must be something else. return it as a string
};

DataMatrix.throwInvalidDataError = function(invalidValue, row, column){
    throw new Error("This should NEVER happen. A cell contains data other than string, boolean, number or null data. The offending value is:\n'" + invalidValue + '\nat row ' + row + ' and column ' + column);
};

DataMatrix.getColumnData = function(dataMatrix, columnNumber){
    var columnData = new ColumnData();

    var temp;

    for(var i = 0; i < dataMatrix.length; i++){
        temp = dataMatrix[i][columnNumber];
        //check what type of value the cell contains
        switch(typeof temp){
            case "string":
                columnData.containsString = true;
                break;
            case "boolean":
                columnData.containsBoolean = true;
                break;
            case "number":
                columnData.containsNumber = true;
                break;
            case "object":
                if(temp===null) {columnData.containsNull = true;}
                else {DataMatrix.throwInvalidDataError(temp, i, columnNumber);}
                break;
            default:
                DataMatrix.throwInvalidDataError(temp, i, columnNumber);
                break;
        }
        //check if the value collides with any previous values
        for(var z = 0; z < i; z++){
            if(temp === dataMatrix[z][columnNumber]) {columnData.containsUniqueData = false;}
        }
    }


    return columnData;
};