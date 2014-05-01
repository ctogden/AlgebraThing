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
	
	function realOp(operator){
		if(operator ==="*"){
			return "\\times"
		}
		
		return operator; 
		
	}
	
	function latexGenerator(tree){
		if(tree == null){
			return ""; 
		}
		
		else if(! isNaN(tree) || typeof(tree) === "string"){
			return tree; 
		}
		
		else if(tree.type === "paren"){
			if(tree.value.operator === "/"){
				return latexGenerator(tree.value); 
			}
			else {
				return "{" + latexGenerator(tree.value) + "}";
			}
			
		}
		else if(tree.type === "binop"){
			if(tree.operator === "/"){
				return "\\frac{" + latexGenerator(tree.left) + "}{" + latexGenerator(tree.right) + "}"; 
			}
			else if(tree.operator === "^"){
				return latexGenerator(tree.left) + "^{" + latexGenerator(tree.right) + "}"; 
			}
			else {
				return latexGenerator(tree.left) + realOp(tree.operator) + latexGenerator(tree.right);
			}
		}
	}
	
	equationEditorApp.directive('mathOutput',function(){
		function link(scope, element, attrs) {
		
		scope.$watch(attrs.equation, function(value) {
			if(value == null) {
				return; 
			}
			var parseResult = window.parser.parse(value);
			if(parseResult.status == true){
				element.text(latexGenerator(parseResult.value));
				element.mathquill();
			}
			else {
				element.text("invalid equation"); 
			}
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
		$scope.secondaryInput = [];
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
	    $scope.toggle = function(val){
	    	if(val == 'Functions'){
	    		
	    		$scope.display = false;
	    	    
	    	} else {
	    		
	    		$scope.display = true;
	    	}	
	    };
	    
	    $scope.submitSecondaryInput = function()
		{
			secondaryInput.push($scope.newSecondaryInput);
			$scope.newSecondaryInput = "";
	 
		}
	});
	
//	angular.module('equationEditorApp', []).directive('display', function() {
//	    return function (scope, element, attrs) {
//	    	var top -= 10;
//	        element.css('top' + top + 'px');
//	    }
//	});
	
	equationEditorControllers.controller("ProfileCtrl", function ProfileCtrl($scope) {
		// Profile Content goes here
	});
	
	equationEditorControllers.controller("FAQCtrl", function ProfileCtrl($scope) {
		// FAQ Content
	});
	
	equationEditorControllers.controller("ContactCtrl", function ProfileCtrl($scope) {
		// Contact Page
	});
	
	
})();