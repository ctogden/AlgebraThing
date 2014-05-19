//Main script file for the application
$(window).load(function() {
	angular.element('#triggerModal').scope().ModalController;
});

(function() {
	"use strict";
	var equationEditorApp = angular.module('equationEditorApp', [ 'ngCookies',
			'ui.bootstrap', 'ngRoute', 'equationEditorControllers' ]);

	equationEditorApp.controller("ModalController", function($scope,
			$cookieStore, $modal) {
		if ($cookieStore.get("algebraThingReturningVisitor") === undefined) {
			$cookieStore.put("algebraThingReturningVisitor", true);
			console.log($cookieStore.get("algebraThingReturningVisitor"));
			$modal.open({
				templateUrl : 'partials/Modal.html',
				controller : 'ModalInstanceCtrl'
			});
		}
	});

	equationEditorApp.controller("ModalInstanceCtrl", function($scope,
			$modalInstance) {
		$scope.cancel = function() {
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

			if (tree.operator === "*" && parentOp === "*"
					&& isRightChild === true) {
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
				return parenthesis(latexGenerator(tree.left, tree.operator,
						false)
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
			type : "binop",
			left : tree,
			operator : operator,
			right : value,
		};
	}

	function cloneTree(tree) {
		var newTree = {};
		for ( var key in tree) {
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

	function getAddSubChildren(tree, returnList, isNegative) {
		if (tree == null) {
			return;
		}
		if (tree.operator !== "+" && tree.operator !== "-") {
			returnList.push({
				node : tree,
				sign : isNegative ? -1 : 1
			});

		} else {
			getAddSubChildren(tree.left, returnList);
			getAddSubChildren(tree.right, returnList, tree.operator === "-");
		}
	}

	function treeFromList(startNode, list, operator) {
		var currentNode = startNode;
		for (var i = 0; i < list.length; i++) {
			currentNode = {
				type : "binop",
				operator : operator,
				left : currentNode,
				right : list[i]
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
			return tree.right;
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
		for (var i = 0; i < multChildren.length; i++) {
			var child = multChildren[i];
			if (!isNaN(child)) {
				numberTerm *= child;
			} else if (typeof (child) === "string") {
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

	function computeGCD(x, y) {
		while (y != 0) {
			var z = x % y;
			x = y;
			y = z;
		}
		return x;
	}
	
	function countChars(string){
		var counts = {}; 
		for(var i = 0; i < string.length; i++){
			var char = string[i]; 
			counts[char] = counts[char] || 0; 
			counts[char]++; 
		}
		return counts; 
	}

	function stringFromCounts(counts){
		var returnString = ""; 
		for(var key in counts){
			returnString += Array(counts[key]+1).join(key);
		}
		return returnString;
		
	}
	
	function simplifyDivision(tree) {
		var top = getDivVariableInfo(tree.left);
		var bottom = getDivVariableInfo(tree.right);
		var gcd = computeGCD(top.coefficient, bottom.coefficient);
		top.coefficient /= gcd;
		bottom.coefficient /= gcd;
		top.complexNodes.forEach(findDivision); 
		bottom.complexNodes.forEach(findDivision); 
		var topCounts = countChars(top.string);
		var bottomCounts = countChars(bottom.string);
		for(var key in topCounts){
			if(key in bottomCounts){
				var min = Math.min(topCounts[key], bottomCounts[key]); 
				topCounts[key] -= min;
				bottomCounts[key] -= min; 
			}
		}
		var topString = stringFromCounts(topCounts); 
		var bottomString = stringFromCounts(bottomCounts); 
		var topTree = makeTreeFromString(top.coefficient, topString);
		topTree = treeFromList(topTree, top.complexNodes);
		var bottomTree = makeTreeFromString(bottom.coefficient, bottomString);
		bottomTree = treeFromList(bottomTree, bottom.complexNodes);
		tree.left = eliminateMultiplicationOnes(topTree);
		tree.right = eliminateMultiplicationOnes(bottomTree);
		if (tree.right === 1) {
			return tree.left;
		}
		return tree;
	}

	function getAddSubVariableInfo(tree) {
		if (tree.type === "binop" && tree.operator !== "*") {
			return null;
		}
		if (tree.type !== "binop") {
			if (isNaN(tree)) {
				return {
					string : tree,
					coefficient : 1
				};
			} else {
				return {
					string : "",
					coefficient : tree,
				}
			}
		}
		if (tree.right.type === "binop") {
			return null;
		}
		var begin = getAddSubVariableInfo(tree.left);
		if (begin !== null) {
			if (isNaN(tree.right)) {
				return {
					string : begin.string + tree.right,
					coefficient : begin.coefficient,
				}
				return begin + tree.right;
			} else {
				return {
					string : begin.string,
					coefficient : begin.coefficient * tree.right
				}
			}
		}
		return null;
	}

	function getDivVariableInfo(tree) {
		if (tree.type === "binop" && tree.operator !== "*") {
			return {
				string : "",
				coefficient : 1,
				complexNodes : [ tree ],
			};
		}
		if (tree.type !== "binop") {
			if (isNaN(tree)) {
				return {
					string : tree,
					coefficient : 1,
					complexNodes : [],
				};
			} else {
				return {
					string : "",
					coefficient : tree,
					complexNodes : [],

				}
			}
		}

		var left = getDivVariableInfo(tree.left);
		var right = getDivVariableInfo(tree.right);

		return {
			string : left.string + right.string,
			coefficient : left.coefficient * right.coefficient,
			complexNodes : left.complexNodes.concat(right.complexNodes),
		}
	}

	function makeTreeFromString(coefficient, text) {
		return treeFromList(coefficient, text.split(""), "*");
	}

	function simplifyAddSub(tree) {
		var addSubChildren = [];
		getAddSubChildren(tree, addSubChildren, tree.operator === "-");
		addSubChildren.forEach(function(childItem) {
			findAddSub(childItem.node);
		});
		var variableSumMap = {};
		var complexChildren = [];
		for (var i = 0; i < addSubChildren.length; i++) {
			var addSubInfo = getAddSubVariableInfo(addSubChildren[i].node);
			if (addSubInfo !== null) {
				variableSumMap[addSubInfo.string] = variableSumMap[addSubInfo.string] || 0;
				variableSumMap[addSubInfo.string] += addSubInfo.coefficient
						* addSubChildren[i].sign;
			} else {
				complexChildren.push(addSubChildren[i].node);
			}
		}
		var variableSumList = [];
		for ( var key in variableSumMap) {
			var coefficient = variableSumMap[key];
			variableSumList.push(makeTreeFromString(coefficient, key));
		}
		var startNode;
		if (variableSumList.length > 0) {
			startNode = variableSumList[0];
			variableSumList = variableSumList.slice(1)
		} else {
			startNode = complexChildren[0];
			complexChildren = complexChildren.slice(1);
		}
		var returnNode = treeFromList(startNode, variableSumList);
		returnNode = treeFromList(returnNode, complexChildren);
		return returnNode;
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

	function findDivision(tree) {
		if (!tree) {
			return;
		}
		if (tree.operator === "/") {
			return simplifyDivision(tree);
		}
		tree.left = findDivision(tree.left);
		tree.right = findDivision(tree.right);
		return tree;
	}

	function findAddSub(tree) {
		if (!tree) {
			return;
		}
		if (tree.operator === "+" || tree.operator === "-") {
			return simplifyAddSub(tree);
		}
		tree.left = findAddSub(tree.left);
		tree.right = findAddSub(tree.right);
		return tree;
	}

	function simplifyTree(tree) {
		return findDivision(findAddSub(findMultiplication(tree)));
	}

	function Equation(left, right) {
		this.value = {
			left : left,
			right : right
		};
		this.history = [];
	}

	Equation.prototype = {
		performOperation : function(operator, value) {
			this.history.push({
				equation : this.value,
				operator : operator,
				operatorValue : value
			});
			this.value = {
				left : performOperationOnTree(this.value.left, operator, value),
				right : performOperationOnTree(this.value.right, operator,
						value)
			};
		},
		simplify : function() {
			this.value = {
				left : simplifyTree(this.value.left),
				right : simplifyTree(this.value.right),
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
						var newEquation = new Equation(parseResult.value[0],
								parseResult.value[1]);
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