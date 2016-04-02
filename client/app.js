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
            
            $scope.loggedIn = function() {
                $http({
                    method: "GET",
                    url: "api/user"
                }).then(function(response) {
                    console.log(response.status);
                    $scope.user = response.data;
                }, function(response) {
                    console.log(response.status);
                });
            };
            $scope.loggedIn();
            
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
        
        app.directive("tooltip", function() {
           return {
               restrict: "A",
               link: function(scope, element, attrs) {
                   $(element).hover(function() {
                       $(element).tooltip("show");
                   },
                   function() {
                       $(element).tooltip("hide");
                   });
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
        
        app.directive("d3Graph", function() {
            
            return {
                restrict: "E",
                scope: {
                    d3Data: "=data"
                },
                link: function(scope, element, attrs) {
                    
                    scope.$watch("d3Data", function(d3Data) {
                        
                        if (d3Data) {
                            
                            var height = 500;
                            var margin = { top: 30, right: 15, bottom: 30, left: 15 };              
                            var width = $(".container-fluid").width() - margin.left - margin.right;                    
                            var padding = 5;
                            var max = d3Data.options[0].votes;
                            var total = 0;
                            
                            for (var i = 0; i < d3Data.options.length; i++) {
                                if (d3Data.options[i].votes > max) {
                                    max = d3Data.options[i].votes;
                                }
                                total += d3Data.options[i].votes;
                            }
        
                            var svg = d3.select(".panel-body")
                                .append("svg")
                                .attr("width", width)
                                .attr("height", height);
                                
                            svg.selectAll("rect")
                                .data(d3Data.options)
                                .enter()
                                .append("rect");
                                
                            svg.selectAll("text")
                                .data(d3Data.options)
                                .enter()
                                .append("text")
                                .text(function(d) {
                                    return d.text + " -- " + (d.votes / total * 100).toFixed(1) + "%";
                                });
  
                            function renderGraph() {
                                
                                width = $(".container-fluid").width() - margin.left - margin.right; 
                                
                                svg.selectAll("rect")
                                    .attr("x", function(d, i) {
                                        return padding;
                                    })                        
                                    .attr("y", function(d, i) {
                                        return i * (height / d3Data.options.length);
                                    })
                                    .attr("width", function(d) {
                                        return width * (d.votes / max) - 2 * padding;
                                    })
                                    .attr("height", height / d3Data.options.length - padding);
                                    
                                svg.selectAll("text")
                                    .attr("x", function(d) {
                                        console.log(d.text.length);
                                        return 0.8 * width * (d.votes / max) - d.text.length;
                                    })
                                    .attr("y", function(d, i) {
                                        return i * (height / d3Data.options.length) + (height / d3Data.options.length - d3Data.options.length) / 2 + padding;
                                    });
                            }
                            $(document).ready(renderGraph);
                            $(window).on("resize", renderGraph);s
                        }
                    });
                }
            };
        });
        
        app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
            
            $routeProvider
                .when("/login", {
                    templateUrl: "login.html",
                    controller: "PollController"
                })
                
                .when("/vote", {
                    templateUrl: "vote.html",
                    controller: "PollController"
                })
                
                .when("/graph/:id", {
                    templateUrl: "graph.html",
                    controller: "GraphController"
                })
                
                .otherwise({
                    redirectTo: "/login"
                });
                
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }]);
})();