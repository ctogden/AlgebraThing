//Main script file for the application
$(function(){
		
        // On loading the initial page, it also loads the modal
		$(window).load(function(){
		        $('#welcome').modal('show');
		        
		    });
});
(function () {
	"use strict";
	var equationEditorApp = angular.module('equationEditorApp', [
	                                                             'ngRoute',
	                                                             'equationEditorControllers'
	                                                             ]);
	
	equationEditorApp.config(function($routeProvider) {
	                      $routeProvider.
	                        when('/new', {
	                          templateUrl: 'partials/NewEquation.html',
	                          controller: 'NewEquationCtrl'
	                        }).
	                        when('/editor/:equationId', {
	                          templateUrl: 'partials/EquationEditor.html',
	                          controller: 'EquationEditorCtrl'
	                        }).
	                        otherwise({
	                          redirectTo: '/new'
	                        });
	                    });
	
	var equations = [];
	var equationEditorControllers = angular.module('equationEditorControllers', ['ui.bootstrap']);
	equationEditorControllers.controller('NewEquationCtrl', function NewEquationCtrl($scope, $location) {
		$scope.submitEquation = function()
		{
			equations.push($scope.newEquation);
	        $scope.newEquation = "";
	        $location.path("/editor/" + (equations.length - 1));
		}
    });
	
	equationEditorControllers.controller("EquationEditorCtrl", function EquationEditorCtrl($scope, $routeParams) {
		$scope.equation = equations[$routeParams.equationId];
	});
})();