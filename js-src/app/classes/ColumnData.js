/**
 * Created by CutmanCometh on 6/8/16.
 * Objects of this class provide metadata about a column in a DataMatrix array
 */

function ColumnData(colNumber){
    this.columnNumber = colNumber;
    this.booleanValues = 0;
    this.stringValues = 0;
    this.maxStringLength = 0;
    this.numberValues = 0;
    //TODO add an 'integerValues' field to ColumnData. number of integer values is a more reliable indicator of whether a column is the unique identifier than just number of number values. i.e. 56391 is more likely to be a UID than 49.39309843
    this.nullValues = 0;
    this.containsUniqueValues = true;
}

ColumnData.compare = function(cd1, cd2){
    //if they are the same object, sort them the same
    if(cd1 === cd2){return 0;}

    //if one has unique values and the other doesn't, sort the one with unique values higher
    if(cd1.containsUniqueValues && !cd2.containsUniqueValues) {return 1;}
    else if(cd2.containsUniqueValues && !cd1.containsUniqueValues) {return -1;}

    //if one has more number values than the other, sort the one with more integer values higher
    if(cd1.numberValues !== cd2.numberValues){return cd1.numberValues - cd2.numberValues;}

    //if one has a shorter max string length than the other, sort the one with the short max length higher, unless then one with the shorter max string length is 0, in which case sort the one with the nonzero max string length higher
    if(cd1.maxStringLength < cd2.maxStringLength){
        return cd1.maxStringLength === 0 ? -1 : 1;
    }
    else if(cd2.maxStringLength < cd1.maxStringLength){
        return cd2.maxStringLength === 0 ? 1 : -1;
    }


    return 0;
};

ColumnData.prototype.equals = function(anotherColumnDataObject){
    if(this === anotherColumnDataObject) {
        return true;
    }

    if(typeof anotherColumnDataObject.booleanValues === 'undefined' || anotherColumnDataObject.booleanValues !== this.booleanValues){
        return false;
    }

    if(typeof anotherColumnDataObject.numberValues === 'undefined' || anotherColumnDataObject.numberValues !== this.numberValues){
        return false;
    }

    if(typeof anotherColumnDataObject.stringValues === 'undefined' || anotherColumnDataObject.stringValues !== this.stringValues){
        return false;
    }

    if(typeof anotherColumnDataObject.maxStringLength === 'undefined' || anotherColumnDataObject.maxStringLength !== this.maxStringLength){
        return false;
    }

    if(typeof anotherColumnDataObject.nullValues === 'undefined' || anotherColumnDataObject.nullValues !== this.nullValues){
        return false;
    }

    if(typeof anotherColumnDataObject.containsUniqueValues === 'undefined' || anotherColumnDataObject.containsUniqueValues !== this.containsUniqueValues){
        return false;
    }

    return true;
};