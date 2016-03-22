"use strict";

(function(){
    angular.module("votingApp", [])
    
        .controller("PollController", ["$scope", "$http", function($scope, $http) {
            
            $scope.getPolls = function() {
                $http({
                    method: "GET",
                    url: "api/polls"
                }).then(function(response) {
                    console.log(response.status);
                    $scope.polls = response.data[0];
                }, function(response) {
                    console.log(response.status);
                });
            };
            
            $scope.getPolls();
            $scope.options = [{ text: "" }, { text: "" }];
            $scope.addField = function() {
                $scope.options.push({ });
            };
            
            $scope.newPoll = function() {
                $http({
                    method: "POST",
                    url: "api/new",
                    data: {
                        title: $scope.title,
                        option: $scope.options,
                        votes: new Array($scope.options.length).fill("0")
                    }
                }).then(function(response) {
                    console.log(response.status);
                    $scope.data = response.data;
                }, function(response) {
                    console.log(response.status);
                });
            };
            
            $scope.pollVote = function() {
                $http({
                    method: "PUT",
                    url: "api/vote"
                }).then(function(response) {
                    console.log(response.status);
                    $scope.data = response.data;
                }, function(response) {
                    console.log(response.status);
                });
            };
        }]);
})();