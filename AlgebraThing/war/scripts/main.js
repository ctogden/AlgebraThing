//Main script file for the application
$(function() {

	// On loading the initial page, it also loads the modal
	// $(window).load(function(){
	// $('#welcome').modal('show');
	//		        
	// });
});
(function() {
	"use strict";
	var equationEditorApp = angular.module('equationEditorApp', [ 'ngRoute',
			'equationEditorControllers' ]);

	equationEditorApp.config(function($routeProvider) {
		$routeProvider.when('/new', {
			templateUrl : 'partials/NewEquation.html',
			controller : 'NewEquationCtrl'
		}).when('/editor/:equationId', {
			templateUrl : 'partials/EquationEditor.html',
			controller : 'EquationEditorCtrl'
		}).when('/profile', {
			templateUrl : '/Profile.html',
			controller : 'ProfileCtrl'
		}).when('/faq', {
			templateUrl : '/FAQ.html',
			controller : 'FAQCtrl'
		}).when('/contact', {
			templateUrl : '/Contact.html',
			controller : 'ContactCtrl'
		}).otherwise({
			redirectTo : '/new'
		});
	});

	function realOp(operator, right) {
		if (operator === "*") {
			if (typeof (right) == "string" && /[a-z]/i.test(right)) {
				return "";
			}
			return "\\times ";
		}

		return operator;

	}

	function latexGenerator(tree, parentOp, isRightChild) {
		function parenthesis(value) {
			var isPlusMinus = tree.operator == "+" || tree.operator == "-";
			if (isPlusMinus && parentOp === "*") {
				return "(" + value + ")";
			}
			var isNotDiv = isPlusMinus || tree.operator === "*";
			if (isNotDiv && isRightChild === false) {
				return "(" + value + ")";
			}
			return value;
		}
		
		if (tree == null) {
			return "";
		}

		else if (!isNaN(tree) || typeof (tree) === "string") {
			return tree;
		} else if (tree.type === "binop") {
			
			if (tree.operator === "/") {
				return "\\frac{" + latexGenerator(tree.left) + "}{"
						+ latexGenerator(tree.right) + "}";
			} else if (tree.operator === "^") {
				return latexGenerator(tree.left) + "^{"
						+ latexGenerator(tree.right) + "}";
			} else {
				return parenthesis(latexGenerator(tree.left, tree.operator, false)
						+ realOp(tree.operator, tree.right)
						+ latexGenerator(tree.right, tree.operator, true));
			}
		}
	}

	equationEditorApp.directive('autoFocus', function($timeout) {
		return {
			restrict : 'AC',
			link : function(_scope, _element) {
				$timeout(function() {
					_element[0].focus();
				}, 0);
			}
		};
	});

	equationEditorApp.directive('mathOutput', function() {
		function link(scope, element, attrs) {

			scope.$watch(attrs.equation, function(value) {
				if (value == null) {
					return;
				}
				element.text(latexGenerator(value.left) + "="
						+ latexGenerator(value.right));
				element.mathquill();
			});
		}
		return {
			restrict : 'E',
			link : link,
		};

	});
	
	
	function performOperationOnTree(tree, operator, value) {
		return {
			type: "binop",
			left: tree,
			operator: operator,
			right: value,
		};
	}
	
	function Equation(left, right) {
		this.value = {
			left: left,
			right: right
		};
		this.history = [];
	}
	
	Equation.prototype = {
		performOperation: function (operator, value) {
			this.history.push({
				equation: this.value,
				operator: operator,
				operatorValue: value
			});
			this.value = {
				left : performOperationOnTree(this.value.left, operator, value),
				right : performOperationOnTree(this.value.right, operator, value)
			};
		}
	};

	var equations = [];
	var equationEditorControllers = angular.module('equationEditorControllers',
			[ 'ui.bootstrap' ]);
	equationEditorControllers.controller('NewEquationCtrl',
			function NewEquationCtrl($scope, $location) {
				$scope.submitEquation = function() {
					var parseResult = window.parser.parse($scope.newEquation);
					if (parseResult.status == true) {
						var newEquation = new Equation(parseResult.value[0], parseResult.value[1]);
						equations.push(newEquation);
						$scope.newEquation = "";
						$location.path("/editor/" + (equations.length - 1));
					} else {
						$scope.error = "Invalid Equation";
					}

				}
			});

	equationEditorControllers.controller("EquationEditorCtrl",
			function EquationEditorCtrl($scope, $routeParams) {
				var addOp = "+";
				var subOp = "\u2212";
				var multOp = "\u00D7";
				var divOp = "\u00F7";
				$scope.equation = equations[$routeParams.equationId];
				this.inputHidden = false; // TODO: we'd like to be able to
											// hide this until a operator is
											// selected
				$scope.setValue = function(val) {
					if (val == 'add')
						$scope.operator = addOp;
					else if (val == 'subtract')
						$scope.operator = subOp;
					else if (val == 'multiply')
						$scope.operator = multOp;
					else if (val == 'divide')
						$scope.operator = divOp;
				};
				$scope.toggle = function(val) {
					if (val == 'Functions') {
						$scope.display = false;
					} else {
						$scope.display = true;
					}
				};

				$scope.performOperation = function() {
					var op;
					if ($scope.operator == addOp) {
						op = "+";
					} else if ($scope.operator == subOp) {
						op = "-";
					} else if ($scope.operator == multOp) {
						op = "*";
					} else if ($scope.operator == divOp) {
						op = "/";
					}
					$scope.equation.performOperation(op, $scope.opValue);
				}
			});

	// angular.module('equationEditorApp', []).directive('display', function() {
	// return function (scope, element, attrs) {
	// var top -= 10;
	// element.css('top' + top + 'px');
	// }
	// });

	equationEditorControllers.controller("ProfileCtrl", function ProfileCtrl(
			$scope) {
		// Profile Content goes here
	});

	equationEditorControllers.controller("FAQCtrl",
			function ProfileCtrl($scope) {
				// FAQ Content
			});

	equationEditorControllers.controller("ContactCtrl", function ProfileCtrl(
			$scope) {
		// Contact Page
	});

})();