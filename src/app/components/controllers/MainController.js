/*global angular, console*/
(function () {

    'use strict';
    
    angular
        .module('myClient')
        .controller('MainController', ['$scope', '$filter', 'ProcessRequest', function ($scope, $filter, ProcessRequest) {

            $scope.title = 'Computed itineraries';
            
            /**************************************
             * Aside form to process routing request
             **************************************/

            $scope.aside_title = "Process a request";
            
            $scope.timeOffset = new Date().getTimezoneOffset();

            $scope.widths = [];
            
            $scope.fields = [
                {
                    name: 'Time',
                    type: 'LocalTime',
                    value: 37840000,
                    possibleValue: null
                },
                {
                    name: 'Date',
                    type: 'LocalDate',
                    value: '2015-07-24',
                    possibleValue: null
                },
                {
                    name: 'From place - ID',
                    type: 'String',
                    value: '3932',
                    possibleValue: null
                },
                {
                    name: 'To place - ID',
                    type: 'String',
                    value: '2391',
                    possibleValue: null
                },
                {
                    name: 'Max walk distance',
                    type: 'int',
                    value: 750,
                    possibleValue: null
                }
            ];
            
            $scope.submitRequest = function () {
                
                var i, j, k, previousEnd, totalDuration, itinerary,
                    request = 'http://localhost:6543/services/routing?from=' + $scope.fields[2].value
                    + '&to=' + $scope.fields[3].value
                    + '&time=' + $filter("date")($scope.fields[0].value, 'HH:mm')
                    + '&date=' + $filter("date")($scope.fields[1].value, 'yyyy-MM-dd');
                
                ProcessRequest.process(request, function (data) {
                    $scope.journey = data;
                    $scope.journey.plan.itineraries.activePanel = 0;
                
                    for (i = 0; i < $scope.journey.plan.itineraries.length; i += 1) {
                        itinerary = $scope.journey.plan.itineraries[i];
                        totalDuration = itinerary.legs[itinerary.legs.length - 1].endTime - itinerary.legs[0].startTime + 100000; /* Margin */
                        $scope.widths[i] = [];
                        previousEnd = -1;
                        for (j = 0, k = 0; j < itinerary.legs.length; j += 1, k += 1) {
                            if (previousEnd > 0 && (itinerary.legs[j].startTime - previousEnd) > 0) {
                                $scope.widths[i][k] = {};
                                $scope.widths[i][k].width = ((itinerary.legs[j].startTime - previousEnd) / totalDuration) * 100;
                                $scope.widths[i][k].type = 'WAIT';
                                $scope.widths[i][k].leg = null;
                                k += 1;
                            }
                            $scope.widths[i][k] = {};
                            $scope.widths[i][k].width = ((itinerary.legs[j].endTime - itinerary.legs[j].startTime) / totalDuration) * 100;
                            $scope.widths[i][k].type = itinerary.legs[j].mode;
                            $scope.widths[i][k].leg = itinerary.legs[j];
                            previousEnd = itinerary.legs[j].endTime;
                        }
                    }
                });
                
            };
        }]);
    
}());