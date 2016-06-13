/**
 * Created by CutmanCometh on 6/10/16.
 */

app.factory('DataProcessing', ['$q', '$timeout', function ($q, $timeout) {
    var stringToDataMatrix = function(dataString){
        var defer = $q.defer();

        $timeout(function () {
            defer.resolve(new DataMatrix(dataString));
        },1);

        return defer.promise;
    };

    var compareMatrices = function(matrixA, matrixB){
        var defer = $q.defer();

        $timeout(function () {
            defer.resolve(DataMatrix.compareMatrices(matrixA, 0, matrixB, 0));//TODO for now we are only doing comparisons based on the primary key being the first column. need to add support for the user choosing the unique column, and for not having a primaru key at all
        },1);

        return defer.promise;
    };

    return{
        stringToDataMatrix : stringToDataMatrix,
        compareMatrices : compareMatrices
    };
}]);