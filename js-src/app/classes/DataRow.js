/**
 * Created by CutmanCometh on 6/7/16.
 */

function DataRow(dataString){
    var temp;//used as placeholder during init loop
    this.data = dataString.split("\t");
    this.data.forEach(function (word, index, dataArray) {//fix each value as either a trimmed string or null
        dataArray[index] = ( (temp = word.trim()) === '' ) ? null : temp;//trim it. if it's an empty string, set it to null, otherwise set it to the trimmed value
    });//TODO this should just be implemented as a static method of the DataMatrix class. the datamatrix should be a 2D array rather than an array of objects
}

DataRow.prototype.getData = function () {
    return this.data.slice();
};