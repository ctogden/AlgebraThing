//Main script file for the application
$(function(){
		
        // On loading the initial page, it also loads the modal
//		$(window).load(function(){
//		        $('#welcome').modal('show');
//		        
//		    });
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
	                        when('/profile', {
	                          templateUrl: '/Profile.html',
		                      controller: 'ProfileCtrl'
	                        }).
	                        when('/faq', {
		                          templateUrl: '/FAQ.html',
			                      controller: 'FAQCtrl'
		                    }).
		                    when('/contact', {
		                          templateUrl: '/Contact.html',
			                      controller: 'ContactCtrl'
		                    }).
	                        otherwise({
	                          redirectTo: '/new'
	                        });
	                    });
	
	equationEditorApp.directive('mathOutput',function(){
		function link(scope, element, attrs) {
		
		scope.$watch(attrs.equation, function(value) {
			element.text(value);
			element.mathquill();
	      });
		} 
		return {
			restrict: 'E',
			link: link,
		};
		
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
		$scope.setValue = function(val) {
	        if(val == 'add')
	        	$scope.operator = "+";
	        else if (val == 'subtract')
	        	$scope.operator = "\u2212";	
	        else if (val == 'multiply')
	        	$scope.operator = "\u00D7";	
	        else if (val == 'divide')
	        	$scope.operator = "\u00F7";	 	
	    };
	});
	
	equationEditorControllers.controller("ProfileCtrl", function ProfileCtrl($scope) {
		// Profile Content goes here
	});
	
	equationEditorControllers.controller("FAQCtrl", function ProfileCtrl($scope) {
		$scope.message = 'Look! I am an FAQ page.';
	});
	
	equationEditorControllers.controller("ContactCtrl", function ProfileCtrl($scope) {
		$scope.message = 'Look! I am an Contact page.';
	});
	
	
})();