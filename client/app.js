"use strict";
(function(){
    angular.module("votingApp", [])
    
        .controller("PollController", function($scope) {
            $scope.test = 1;
            
            $scope.items = [];
            
            $scope.addField = function() {
                $scope.items.push({
                    option: ""
                });
            };
        });
})();