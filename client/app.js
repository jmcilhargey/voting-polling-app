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
                    $scope.polls = response.data;
                }, function(response) {
                    console.log(response.status);
                });
            };
            $scope.getPolls();
            
            $scope.options = [{ text: "", votes: 0, id: 1 }, { text: "", votes: 0, id: 2 }];
            $scope.addField = function() {
                if ($scope.options.length < 8) {
                    $scope.options.push({ text: "", votes: 0, id: $scope.options.length + 1 });
                }
            };  
            
            $scope.newPoll = function() {
                $http({
                    method: "POST",
                    url: "api/new",
                    data: {
                        title: $scope.title,
                        options: $scope.options,
                        date: new Date()
                    }
                }).then(function(response) {
                    console.log(response.status);
                    console.log(response.data);
                    $scope.getPolls();
                }, function(response) {
                    console.log(response.status);
                });
            };
            
            $scope.pollVote = function(poll, vote) {
                console.log(poll);
                console.log(vote);
                $http({
                    method: "PUT",
                    url: "api/vote",
                    data: {
                        poll: poll,
                        vote: vote
                    }
                }).then(function(response) {
                    console.log(response.status);
                    console.log(response.data);
                    $scope.getPolls();
                }, function(response) {
                    console.log(response.status);
                });
            };
        }]);
})();