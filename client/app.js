(function(){
    "use strict";
    
    var app = angular.module("votingApp", ["ngRoute"]);
    
        app.controller("PollController", ["$scope", "$http", function($scope, $http) {
            
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
                    $scope.getPolls();
                }, function(response) {
                    console.log(response.status);
                });
            };
            
            $scope.pollVote = function(poll, vote) {
                $http({
                    method: "PUT",
                    url: "api/vote",
                    data: {
                        poll: poll,
                        vote: vote
                    }
                }).then(function(response) {
                    console.log(response.status);
                    $scope.getPolls();
                }, function(response) {
                    console.log(response.status);
                });
            };
        }]);
    
        app.directive("d3Graph", function() {
            var dataset = [ 5, 10, 13, 19, 21, 25 ];
            
            return {
                restrict: "E",
                replace: true,
                link: function(scope, element, attrs) {
                    
                    var height = 500;
                    var margin = { top: 30, right: 15, bottom: 30, left: 15 };              
                    var width = $(".container-fluid").width() - margin.left - margin.right;                    
                    var padding = 5;

                    var svg = d3.select(".panel-body")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);
                        
                    svg.selectAll("rect")
                        .data(dataset)
                        .enter()
                        .append("rect")
                        
                    svg.selectAll("text")
                            .data(dataset)
                            .enter()
                            .append("text")
                            .text(function(d) {
                                return d;
                            })
                        
                    function renderGraph() {

                        width = $(".container-fluid").width() - margin.left - margin.right; 
                        
                        svg.selectAll("rect")
                            .attr("x", function(d, i) {
                                return padding;
                            })                        
                            .attr("y", function(d, i) {
                                return i * (height / dataset.length);
                            })
                            .attr("width", function(d) {
                                return width * (d / d3.max(dataset)) - 2 * padding
                            })
                            .attr("height", height / dataset.length - padding);
                            
                            
                        svg.selectAll("text")
                            .attr("x", function(d, i) {
                                return 3 * padding;
                            })
                            .attr("y", function(d, i) {
                                return i * (height / dataset.length) + (height / dataset.length - padding) / 2;
                            });
                    }
                    
                    $(document).ready(renderGraph);
                    $(window).on("resize", renderGraph);
                }
           };
        });
        
        app.controller("GraphController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams) {

            $scope.getPoll = function() {
                $http({
                    method: "GET",
                    url: "api/poll/" + $routeParams.id
                }).then(function(response) {
                    console.log(response.status);
                    $scope.poll = response.data[0];
                }, function(response) {
                    console.log(response.status);
                });
            };
            $scope.getPoll();
        }]);
        
        app.config(function($routeProvider, $locationProvider) {
            $routeProvider
                .when("/home", {
                    templateUrl: "home.html",
                    controller: "PollController"
                })
                
                .when("/graph/:id", {
                    templateUrl: "graph.html",
                    controller: "GraphController"
                })
                
                .otherwise({
                    redirectTo: "/home"
                });
                
        });
})();