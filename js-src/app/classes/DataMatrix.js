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
    throw new Error("This should NEVER happen. A cell contains data other than string, boolean, number or null data. The offending value is:\n'" + invalidValue + "'\nat row " + row + " and column " + column);
};

DataMatrix.getColumnData = function(dataMatrix, columnNumber){
    var columnData = new ColumnData(columnNumber);

    var temp;

    for(var i = 0; i < dataMatrix.length; i++){
        temp = dataMatrix[i][columnNumber];
        //check what type of value the cell contains
        switch(typeof temp){
            case "string":
                columnData.stringValues ++;
                if(temp.length > columnData.maxStringLength){columnData.maxStringLength = temp.length;}
                break;
            case "boolean":
                columnData.booleanValues ++;
                break;
            case "number":
                columnData.numberValues ++;
                break;
            case "object":
                if(temp===null) {columnData.nullValues ++;}
                else {DataMatrix.throwInvalidDataError(temp, i, columnNumber);}
                break;
            default:
                DataMatrix.throwInvalidDataError(temp, i, columnNumber);
                break;
        }
        //check if the value collides with any previous values
        for(var z = 0; z < i; z++){
            if(temp === dataMatrix[z][columnNumber]) {columnData.containsUniqueValues = false;}
        }
    }


    return columnData;
};

DataMatrix.areRowsEqual = function(rowA, rowB){
    if(rowA.length !== rowB.length){return false;}

    for(var i = 0; i < rowA.length; i++){
        if(rowA[i] !== rowB[i]){return false;}
    }

    return true;
};

DataMatrix.compareRows = function(rowA, rowB, uidColumnNumber){
    return ~DataMatrix.naturalSort(rowA[uidColumnNumber], rowB[uidColumnNumber], false) + 1;//Jim Palmer's sort algorithm returns the inverse of the way I want things sorted, so as a quick fix, I used ~x + 1 to quickly flip the sign
};

/**
 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 */
DataMatrix.naturalSort = function(a, b, caseSensitve) {
    var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
        sre = /(^[ ]*|[ ]*$)/g,
        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        i = function(s) { return !caseSensitve && (''+s).toLowerCase() || ''+s },
    // convert all to strings strip whitespace
        x = i(a).replace(sre, '') || '',
        y = i(b).replace(sre, '') || '',
    // chunk/tokenize
        xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
    // numeric, hex or date detection
        xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
        yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
        oFxNcL, oFyNcL;
    // first try and sort Hex codes or Dates
    if (yD)
        if ( xD < yD ) return -1;
        else if ( xD > yD ) return 1;
    // natural sorting through split numeric strings and default strings
    for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
        // find floats not starting with '0', string or 0 if not defined (Clint Priest)
        oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
        oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
        // handle numeric vs string comparison - number < string - (Kyle Adams)
        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
        // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
        else if (typeof oFxNcL !== typeof oFyNcL) {
            oFxNcL += '';
            oFyNcL += '';
        }
        if (oFxNcL < oFyNcL) return -1;
        if (oFxNcL > oFyNcL) return 1;
    }
    return 0;
}

DataMatrix.comparisonResult = function() {
    return {
        missingFromMatrixA: new Array(),
        missingFromMatrixB: new Array(),
        difference: new Array()
    }
};//define it as a class to help he browser optimize it



DataMatrix.compareMatrices = function(matrixA, primaryKeyColumnA, matrixB, primaryKeyColumnB){
    var result = new DataMatrix.comparisonResult();

    var rowIsPresent;

    for(var a = 0; a < matrixA.length; a++){//makes sure everything in matrixA is in matrixB
        rowIsPresent = false;
        for(var b = 0; b < matrixB.length; b++){
            if(matrixA[a][primaryKeyColumnA] === matrixB[b][primaryKeyColumnB]){//same primary key. TODO this is a horribly inneficient way to search for the same uid
                rowIsPresent = true;
                if(!DataMatrix.areRowsEqual(matrixA[a], matrixB[b])){
                    result.difference.push({
                        a : matrixA[a],
                        b : matrixB[b]
                    });
                }
                break;// no need to continue inner loop
            }
        }
        if(!rowIsPresent){
            result.missingFromMatrixB.push(matrixA[a]);
        }
    }


    for(var b =0; b < matrixB.length; b ++){//make sure every element in matrixB is nin MatrixA
        rowIsPresent = false;
        for(var a = 0; a < matrixA.length; a++){
            if(matrixA[a][primaryKeyColumnA] === matrixB[b][primaryKeyColumnB]){
                rowIsPresent = true;
                break;
            }
        }
        if(!rowIsPresent){
            result.missingFromMatrixA.push(matrixB[b]);
        }
    }

    return result;
};

//TODO handle columns headers