//Main script file for the application
$(window).load(function(){
	angular.element('#triggerModal').scope().ModalController;
});

(function () {
	"use strict";
	var equationEditorApp = angular.module('equationEditorApp', [
	                                                             'ngCookies',
	                                                             'ui.bootstrap',
	                                                             'ngRoute',
	                                                             'equationEditorControllers'
	                                                             ]);
	
    equationEditorApp.controller("ModalController", function($scope, $cookieStore, $modal) {
		if ($cookieStore.get("algebraThingReturningVisitor") === undefined){
			$cookieStore.put("algebraThingReturningVisitor", true);
			console.log($cookieStore.get("algebraThingReturningVisitor"));
			$modal.open({
			      templateUrl: 'partials/Modal.html',
			      controller: 'ModalInstanceCtrl'
			});
		}
	});	
    
	
    equationEditorApp.controller("ModalInstanceCtrl", function ($scope, $modalInstance){
    	  $scope.cancel = function () {
    		    $modalInstance.dismiss('cancel');
    	  };
    });

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
			if (isPlusMinus) {
				if (parentOp === "*" || isRightChild == true) {
					return "(" + value + ")";
				}
			}
			
			if (tree.operator === "*" && parentOp === "*" && isRightChild === true) {
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
	
	function cloneTree(tree) {
		var newTree = {};
		for (var key in tree) {
			newTree[key] = tree[key];
		}
		if (tree.left) {
			newTree.left = cloneTree(tree.left);
		}
		if (tree.right) {
			newTree.right = cloneTree(tree.right);
		}
	}
	
	function getMultiplyChildren(tree, returnList) {
		if (tree == null) {
			return;
		}
		if (tree.operator !== "*") {
			returnList.push(tree);
		} else {
			getMultiplyChildren(tree.left, returnList);
			getMultiplyChildren(tree.right, returnList);
		}
	}
	
	function treeFromList(startNode, list, operator) {
		var currentNode = startNode;
		for (var i=0; i<list.length; i++) {
			currentNode = {
				type: "binop",
				operator: operator,
				left: currentNode,
				right: list[i]
			}
		}
		return currentNode;
	}
	
	function eliminateMultiplicationOnes(tree) {
		if (tree.type !== "binop") {
			return tree;
		}
		
		tree.left = eliminateMultiplicationOnes(tree.left);
		tree.right = eliminateMultiplicationOnes(tree.right);
		if (tree.left == 1) {
			return  tree.right;
		} else if (tree.right == 1) {
			return tree.left;
		}
		
		return tree;
	}
	
	function simplifyMultiplication(tree) {
		var multChildren = [];
		getMultiplyChildren(tree, multChildren);
		multChildren.forEach(findMultiplication);
		var variableChildren = [];
		var complexChildren = [];
		var numberTerm = 1;
		for (var i=0; i<multChildren.length; i++) {
			var child = multChildren[i];
			if (!isNaN(child)) {
				numberTerm *= child;
			} else if(typeof(child) === "string") {
				variableChildren.push(child);
			} else {
				complexChildren.push(child);
			}
		}
		variableChildren.sort();
		var currentNode = treeFromList(numberTerm, variableChildren, "*");
		currentNode = treeFromList(currentNode, complexChildren, "*");
		
		return eliminateMultiplicationOnes(currentNode);
	}
	
	function findMultiplication(tree) {
		if (!tree) {
			return;
		}
		if (tree.operator === "*") {
			return simplifyMultiplication(tree);
		}
		tree.left = findMultiplication(tree.left);
		tree.right = findMultiplication(tree.right);
		return tree;
	}
	
	function simplifyTree(tree) {
		return findMultiplication(tree);
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
		},
		simplify: function() {
			this.value = {
				left: simplifyTree(this.value.left),
				right: simplifyTree(this.value.right),
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
				
				$scope.simplify = function() {
					$scope.equation.simplify();
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