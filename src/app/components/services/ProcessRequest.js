/*global document, angular, console, window*/

(function () {

    'use strict';
    
    angular
        .module('myClient')
        .factory('ProcessRequest', ['$http', function ($http) {
            return {
                process: function (request, callback) {
                    $http.get(request)
                        .success(function (data) {
                            callback(data);
                        })
                        .error(function (err) {
                            callback(err);
                        });
                }
            };
        }]);
    
}());