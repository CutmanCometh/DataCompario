/**
 * Created by CutmanCometh on 6/10/16.
 */

app.factory('DataProcessing', ['$q', '$timeout', function ($q, $timeout) {
    var stringToDataMatrix = function(dataString){
        var defer = $q.defer();

        //$timeout(function () {
            defer.resolve(new DataMatrix(dataString));
        //},2000);

        return defer.promise;
    };

    return{
        stringToDataMatrix : stringToDataMatrix
    };
}]);