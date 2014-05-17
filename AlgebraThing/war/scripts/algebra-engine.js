/*
 *  Converts an infix mathematical expression to postfix (Reverse Polish) notation
 */
var postfixStepsLeft = new Array();
var postfixStepsRight = new Array();
var variables = new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z");
var currentVariables = new Array ();
var vars = "";
var equations;
var coefficients = new Array ();
var coef;
var constants = new Array ();
var inverse = new Array ();
var regdec = /[0-9.]/;

function separateSidesOfEquation(expression) {
    var split = expression.split("=");
    var left = split[0].trim();
    var right = split[1].trim();
    return infixToPostfix(left, 'left') + ":" + infixToPostfix(right, 'right');
}

var infixToPostfix = function(expression, side) {
    // TODO - more operators, and parentheses
    var postfix = [];
    var postfixSteps = [];
    // use an array as a stack
    var stack = [];
    for (var count = 0; count < expression.length; count++) {
        var char = expression.charAt(count);
        // check for operands, allowing single letter variables or any number
        if (!isNaN(char)) {
            var numExp = char;
            var done = false;
            while (!done) {
                if (count + 1 < expression.length) {
                    var nextChar = expression.charAt(count + 1);
                    if (!isNaN(nextChar)) {
                        numExp += nextChar;
                        count++;
                    } else {
                        done = true;
                    }
                } else {
                    done = true;
                }
            }
            postfix.push(numExp);
        }
        else if (char.match(/[a-z]/i)) {
            postfix.push(char);
        }
        else if (isOperator(char)) {
            var popped;
            while (stack.length > 0) {
                popped = stack.pop();
                if ((isLeftAssociative(char) && precedence(char) === precedence(popped)) || (precedence(char) < precedence(popped))) {
                    postfix.push(popped);
                }
                else {
                    stack.push(popped);
                    break;
                }
            }
            stack.push(char);
        }
        else {
            throw "Invalid character in input string.";
        }
    }
    
    while (stack.length > 0) {
        var poppedOperator = stack.pop();
        postfix.push(poppedOperator);
    }
    combineLikeTerms(postfix, postfixSteps);
    console.log(postfixSteps);
    if(side === 'left') {
        postfixStepsLeft = postfixSteps;
    } else {
        postfixStepsRight = postfixSteps;
    }
    return postfix;
};

function Operator(op, index) {
    this.op = op;
    this.index = index;
}

function Variable(coefficient, variable, operator, index) {
    this.coefficient = coefficient;
    this.variable = variable;
    this.operator = operator;
    this.index = index;
}

/**
 * Combines like terms, currently only works for operators *,/,+,-
 * @param {type} postfix
 * @param {type} postfixSteps
 */
function combineLikeTerms(postfix, postfixSteps) {
    var opIndex = new Array();
    var pmOpIndex = new Array();
    var variableIndex = new Array();
    var last = postfix.toString();
    postfixSteps.push(last);

    if (postfix.indexOf('*') > -1 || postfix.indexOf('/')) {
        for (var count = 0; count < postfix.length; count++) {
            var char = postfix[count];

            switch (char) {
                case '*':
                    opIndex.push(new Operator('*', count));
                    break;
                case '/':
                    opIndex.push(new Operator('/', count));
                    break;
            }
        }
    }

    // combines * and / terms
    var shiftCount = 0;
    for (var count = 0; count < opIndex.length; count++) {
        var shift = shiftCount * 2;
        var operator = opIndex[count];

        var varOne = postfix[operator.index - 2 - shift];
        var varTwo = postfix[operator.index - 1 - shift];

        if (!isNaN(varOne) && !isNaN(varTwo)) {
            var result;
            if (operator.op === '*') {
                result = varOne * varTwo;
            } else {
                result = varOne / varTwo;
            }

            postfix[operator.index - 2 - shift] = result;
            postfix.splice(operator.index - 1 - shift, 2);
        } else {
            var result;
            if (isNaN(varOne)) {
                result = varTwo + varOne;
            } else {
                result = varOne + varTwo;
            }

            postfix[operator.index - 2 - shift] = result;
            postfix.splice(operator.index - 1 - shift, 2);
        }

        if (postfix.toString() !== last) {
            postfixSteps.push(postfix.toString());
            shiftCount++;
        }
        last = postfix.toString();
    }

    console.log(variableIndex);
    if (postfix.indexOf('*') > -1 || postfix.indexOf('/')) {
        for (var count = 0; count < postfix.length; count++) {
            var char = postfix[count];

            switch (char) {
                case '+':
                    pmOpIndex.push(new Operator('+', count));
                    break;
                case '-':
                    pmOpIndex.push(new Operator('-', count));
                    break;
            }
        }
    }

    // combines + and - terms
    shiftCount = 0;
    for (var count = 0; count < pmOpIndex.length; count++) {
        var shift = shiftCount * 2;
        var operator = pmOpIndex[count];

        var varOne = postfix[operator.index - 2 - shift];
        var varTwo = postfix[operator.index - 1 - shift];

        if (!isNaN(varOne) && !isNaN(varTwo)) {
            var result;
            if (operator.op === '+') {
                result = parseFloat(varOne) + parseFloat(varTwo);
            } else {
                result = parseFloat(varOne) - parseFloat(varTwo);
            }

            postfix[operator.index - 2 - shift] = result;
            postfix.splice(operator.index - 1 - shift, 2);
        } else {

            if ((varOne.length >= 2 && varTwo.length >= 2) && varOne.length === varTwo.length) {
                if (varOne.charAt(varOne.length - 1) === varTwo.charAt(varTwo.length - 1)) {
                    var result;
                    if (operator.op === '+') {
                        result = (parseFloat(varOne.charAt(0)) + parseFloat(varTwo.charAt(0))) + varOne.charAt(1);
                    } else {
                        result = (parseFloat(varOne.charAt(0)) - parseFloat(varTwo.charAt(0))) + varOne.charAt(1);
                    }
                    postfix[operator.index - 2 - shift] = result;
                    postfix.splice(operator.index - 1 - shift, 2);
                }
            }
        }

        if (postfix.toString() !== last) {
            postfixSteps.push(postfix.toString());
            shiftCount++;
        }
        last = postfix.toString();
    }
}

var isOperator = function(char) {
    var operators = ["+", "-", "*", "/"];
    return (operators.indexOf(char) !== -1);
};

var precedence = function(operator) {
    if (operator === "+" || operator === "-") {
        return 1;
    }
    else if (operator === "*" || operator === "/") {
        return 2;
    }
    else {
        return "Not an operator";
    }
};

var isLeftAssociative = function(operator) {
    if (operator === "/" || operator === "-" || operator === "*" || operator === "+") {
        return true;
    }
    return false;
};

/*
 *  Takes a postfix (Reverse Polish Notation) expression and combines like terms
 */
var simplifyOperands = function(rpnExpressionArray) {
    // First move any variables as far to the right as possible
    // We can do this across subsequent additions and/or subtractions, or 
    // multiplications, but not divisions
// TODO    rpnExpressionArray = shiftVariables(rpnExpressionArray);

    // Scan from left to right.
    // If two numbers followed by an operator, substitute result and step
    // position back to that substituted value. If either operand is a 
    // variable, move on.
    var testOperation;
    for (var i = 2; i < rpnExpressionArray.length; i++) {
        if (rpnExpressionArray[i] === "*") {
            testOperation = parseInt(rpnExpressionArray[i - 2], 10) * parseInt(rpnExpressionArray[i - 1], 10);
            if (!isNaN(testOperation)) {
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i - 2, testOperation.toString());
                return simplifyOperands(newPostfixArray);
            }
        }
        else if (rpnExpressionArray[i] === "/") {
            testOperation = parseInt(rpnExpressionArray[i - 2], 10) / parseInt(rpnExpressionArray[i - 1], 10);
            if (!isNaN(testOperation)) {
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i - 2, testOperation.toString());
                return simplifyOperands(newPostfixArray);
            }
        }
        else if (rpnExpressionArray[i] === "+") {
            testOperation = parseInt(rpnExpressionArray[i - 2], 10) + parseInt(rpnExpressionArray[i - 1], 10);
            if (!isNaN(testOperation)) {
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i - 2, testOperation.toString());
                return simplifyOperands(newPostfixArray);
            }
        }
        else if (rpnExpressionArray[i] === "-") {
            testOperation = parseInt(rpnExpressionArray[i - 2], 10) - parseInt(rpnExpressionArray[i - 1], 10);
            if (!isNaN(testOperation)) {
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i - 2, testOperation.toString());
                return simplifyOperands(newPostfixArray);
            }
        }
    }
    return rpnExpressionArray;
    // TODO - doesn't fully work for all cases because I haven't yet
    // accounted for associativity.
};


// TODO complete this method
/*
 *  Shift variables as far right as possible to allow for further 
 *  combinations of like expressions
 */
var shiftVariables = function(rpnExpressionArray) {
    // Move any variables as far to the right as possible
    // We can do this across subsequent additions and/or subtractions, or 
    // multiplications, but not divisions
    for (var i = 0; i < rpnExpressionArray.length; i++) {
        if (rpnExpression[i].match(/[a-z]/i)) {
            if (!isNaN(rpnExpression[i + 1])) {
                var temp = rpnExpression[i];
                rpnExpression[i] = rpnExpression[i + 1];
                rpnExpression[i + 1] = temp;
            }
        }
        else if (isOperator(rpnExpression[i])) {

        }
    }

};

var substituteInPostfixArray = function(array, count, substitution) {
    var newArray = [];
    for (var i = 0; i < count; i++) {
        newArray.push(array[i]);
    }
    newArray.push(substitution);
    count += 3;
    for (count; count < array.length; count++) {
        newArray.push(array[count]);
    }
    return newArray;
};

var toSimplifiedPostfix = function(infixExpression) {
    return simplifyOperands(infixToPostfix(infixExpression));
};

function DoMath(rpnExpressionArray) {
    this.expression = rpnExpressionArray;
}

DoMath.prototype.add = function(value) {
    this.expression.push(value);
    this.expression.push("+");
    return simplifyOperands(this.expression);
};

DoMath.prototype.subtract = function(value) {
    this.expression.push(value);
    this.expression.push("-");
    return simplifyOperands(this.expression);
};

DoMath.prototype.multiply = function(value) {
    this.expression.push(value);
    this.expression.push("*");
    return simplifyOperands(this.expression);
};

DoMath.prototype.divide = function(value) {
    this.expression.push(value);
    this.expression.push("/");
    return simplifyOperands(this.expression);
};

/** Here we just print out some tests.  Remove later **/
/*
 console.log("---");
 console.log(simplifyOperands("2n*3*3*")); // TODO - fix me, I should output an array...
 console.log(simplifyOperands("2n*33**"));
 var doMath = new DoMath(toSimplifiedPostfix("3*n*3"));
 console.log(doMath.subtract(7));
 console.log(doMath.add(4));
 console.log(doMath.divide(129));
 */

function solve() {
	// Clear any global variables from the previous equations.
	currentVariables = new Array ();
	vars = "";
	equations = new Array();
	coefficients = new Array ();
	coef = new Array ();
	constants = new Array ();
	inverse = new Array ();	

	// Get the equations from the user input, and initialize the display of the equations.
	var textarea = $('input');
	var hidden = $('hidden');
	hidden.style.display = "block";
	var solution = $('solution');
	solution.innerHTML = "";


	// Split the block the user has entered into separate equations.
	equations = textarea.value.split(/\n/);	
	
	// Spit the equations back at the user as confirmation they have been entered correctly.
	displaySolution("<strong>Equaltion.</strong><br/>");
	for (var i = 0; i<equations.length;i++) {
		equations[i] = equations[i].replace(/ /g,"");
		equations[i] = equations[i].replace(/\r/,"");
		if (equations[i]=="") {
			var temp = equations.pop();
			continue;
		}
		equations[i] = equations[i].toLowerCase();
		displaySolution(equations[i]);
	}	
	// Confirm that the equations have at least a chance at being solvable.	Check here to look for obvious syntax errors.
	for (i = 0; i<equations.length;i++) {
		incrementCurrentVariables(equations[i],i,equations);
		if (invalidSyntax(equations[i])) {
			displaySolution("<br /><strong>Syntax Error</strong>");
			return;
		}
	}
	
	if (vars.length > equations.length) {
		displaySolution("<strong>There are too many variables to determine the solutions exactly.</strong>");	
		return;
	}
	if (vars.length < equations.length) {
		displaySolution("<br /><strong>There are more equations than variables.  Please simplify your equations.</strong>");
		return;
	}	
	// Start making the equations easier to parse.  This will be expanded eventually to allow many different ways of entering the equations.
	var tempeq = new Array();
	var same = true;
	for (i = 0; i<equations.length;i++) {
		tempeq[i] = equations[i];
		equations[i] = removeImplicit(equations[i]);
		var sides = equations[i].split("=");
		sides[0] = removeImplicit(sides[0]);
		sides[1] = removeImplicit(sides[1]);
		equations[i] = sides[0] + "=" + sides[1];
		if (tempeq[i]!== equations[i]) {
			same = false;
		}
	}
	if (!same) {
		displaySolution("<br /><strong>Remove any implicit multiplication.</strong><br/>");
		for (i = 0; i<equations.length;i++) {
			displaySolution(equations[i]);
		}
	} 
	
	same = true;
	for (i = 0; i<equations.length;i++) {
		tempeq[i] = equations[i];
		var sides = equations[i].split("=");			
		sides[0] = fixDivision(sides[0]);
		sides[1] = fixDivision(sides[1]);
		equations[i] = sides[0] + "=" + sides[1];
		if (tempeq[i]!=equations[i]) {
			same = false;
		}
	}
	if (!same) {	
		displaySolution("<br /><strong>Fix any division present in the equations.</strong><br/>");
		for (i = 0; i<equations.length;i++) {
			displaySolution(equations[i]);
		}		
	}
	
	same = true;
	for (i = 0; i<equations.length;i++) {
		tempeq[i] = equations[i];
		var sides = equations[i].split("=");			
		sides[0] = foil(sides[0]);		
		sides[1] = foil(sides[1]);
		equations[i] = sides[0] + "=" + sides[1];
		if (tempeq[i]!=equations[i]) {
			same = false;
		}
	}
	if (!same) {
		displaySolution("<br /><strong>Multiply out any double brackets in the equations using FOIL.</strong><br/>");
		for (i = 0; i<equations.length;i++) {
			displaySolution(equations[i]);
		}		
	}
	
	
	same = true;
	for (i = 0; i<equations.length;i++) {
		tempeq[i] = equations[i];
		var sides = equations[i].split("=");			
		sides[0] = removeParenthesis(sides[0]);
		sides[1] = removeParenthesis(sides[1]);
		equations[i] = sides[0] + "=" + sides[1];
		if (tempeq[i]!=equations[i]) {
			same = false;
		}
	}
	if (!same) {
		displaySolution("<br /><strong>Remove any existing parenthesis.</strong><br/>");
		for (i = 0; i<equations.length;i++) {
			displaySolution(equations[i]);
		}		
	}
	
	same = true;
	for (i = 0; i<equations.length;i++) {
		tempeq[i] = equations[i];
		var sides = equations[i].split("=");
		sides[0] = collectLikeTerms(sides[0]);
		sides[1] = collectLikeTerms(sides[1]);
		equations[i] = sides[0] + "=" + sides[1];
		if (tempeq[i]!=equations[i]) {
			same = false;
		}
	}
	if (!same) {
		displaySolution("<br /><strong>Collect like terms.</strong><br/>");
		for (i = 0; i<equations.length;i++) {
			displaySolution(equations[i]);
		}		
	}
		
	for (i = 0; i<equations.length;i++) {
		tempeq[i] = equations[i];
		var sides = equations[i].split("=");
		if ((/\^/.test(sides[0]))||(/\^/.test(sides[1]))) {
			tempeq[0] = sides[0];
			tempeq[1] = sides[0];
			var left = collectSquared(sides[0],sides[1]);
			var right = 0;
			var linear = false;
			sides[0] = left;
			sides[1] = right;
			
			if ((tempeq[0] != sides[0])||(tempeq[1] != sides[0])) {
				displaySolution("<br /><strong>Getting every term onto the left side of the equation...</strong><br />");	
				displaySolution(sides[0]+"="+sides[1]);
			}
			
			if (sides[0].charAt(0)) {
				var a = parseFloat(/^[0-9.-]*/.exec(sides[0]));
				sides[0] = sides[0].replace(/^[0-9.-]*[a-z]\^2(?=[+-])/,"");			
				sides[0] = sides[0].replace(/^\+/,"");
				var b = parseFloat(/^[0-9.-]*[a-z]/.exec(sides[0]));
				sides[0] = sides[0].replace(/^[0-9.-]*[a-z](?=[+-])/,"");
				sides[0] = sides[0].replace(/^\+/,"");
				var c = parseFloat(sides[0]);
				var discriminant = Math.pow(b,2)-4*a*c;
				if (discriminant >= 0 ) {
					displaySolution("<br /><strong>Find the solutions to the equation using the quadratic formula...</strong><br />");
					displaySolution(vars.charAt(0)+"<sub>1</sub> = " + Math.round((-1*b+Math.sqrt(discriminant))/(2*a)*100000)/100000);
					displaySolution(vars.charAt(0)+"<sub>2</sub> = " + Math.round((-1*b-Math.sqrt(discriminant))/(2*a)*100000)/100000 + "<br />");
				} else {
					displaySolution("<br /><strong>Find the solutions to the equation using the quadratic formula...solutions are complex...</strong><br />");
					var complex = Math.round(Math.sqrt(-1*discriminant)/(2*a)*100000)/100000;
					var real = Math.round((-1*b)/(2*a)*100000)/100000;
					displaySolution(vars.charAt(0)+"<sub>1</sub> = " + real + "-" + complex + "<strong>i</strong><br />");
					displaySolution(vars.charAt(0)+"<sub>2</sub> = " + real + "+" + complex + "<strong>i</strong><br />");
				}
				return;
			} else {
				var left = collectVars(sides[0],sides[1]);
				var right = collectNums(sides[0],sides[1]);		
				equations[i] = left + "=" + right;
				if (tempeq[i]!=equations[i]) {
					same = false;
				}
			}	
		} else {			
			var left = collectVars(sides[0],sides[1]);
			var right = collectNums(sides[0],sides[1]);			
			equations[i] = left + "=" + right;			
			if (tempeq[i]!=equations[i]) {
				same = false;
			}			
		}
	}
	
	// Collect the coefficients of each variable into an array.
	for (i = 0; i<equations.length;i++) {
		coefficients[i] = findCoefficients(equations[i],i);	
	}
	
	if (!same) {
		displaySolution("<br /><strong>Move variables to the left of the equal sign, and numbers to the right...</strong><br/>");
		for (i = 0; i<equations.length;i++) {
			displaySolution(equations[i]);
		}		
	}	
	
	// Don't go through Gaussian elimination if we have a single variable problem.
	if (equations.length==1) {
		var sides = equations[0].split("=");
		var xnum = parseFloat(sides[0]);
		var num = parseFloat(sides[1]);
		sides[0] = vars.charAt(0);
		if (xnum) {
			sides[1] = Math.round(num/xnum*100000)/100000;
			displaySolution("<br /><strong>Solving for " + vars.charAt(0) + "</strong><br />");
			displaySolution(sides[0]+"="+sides[1]);
		} else {
			if (num) {
				displaySolution("<br /><strong>No solution for " + vars.charAt(0) + "</strong><br />");
			} else {
				displaySolution("<br /><strong>Infinite solutions for " + vars.charAt(0) + "</strong><br />");			
			}
		}
		return;
	}
	
	// Initialize the identity matrix
	identityMatrix();

	//Find the inverse of the matrix given using Gaussian elimination.
	displaySolution("<br /><strong>Attempting Gaussian Elimination.</strong><br />");
	if (gaussianElimination()) {
		displaySolution("<strong>Constructed the inverse</strong><br />");	
		displaySolution(displayMatrix(inverse));

		var inv = product(inverse,coefficients);
		displaySolution("<strong>Checking the inverse and the coefficients matrix are actually inverses.</strong><br />");
		displaySolution(displayMatrix(inv));

		// Find the solution of the equations
		var solution = findSolution();
		var variableVector = new Array();
		for (var j = 0; j<vars.length; j++) {
			variableVector[j] = new Array ();
			variableVector[j][0] = vars.charAt(j);
		}
		displaySolution("<strong>The solution vector</strong><br />");
		displaySolution("<div style=\"display: block; width: 200px; height: 102px;\">" + displayMatrix(variableVector) + "<div style=\"float:left; width: 30px; height: 20px; margin-top: " + (equations.length*8) + "px; text-align: center;\"> = </div>" + displayMatrix(solution) + "</div>");
	}
	return;
}

// Check for obvious syntax errors.
function invalidSyntax(equation) {
	var sides = equation.split("=");
	for (var j=0;j<2;j++) {
		if (/\$|\*|\!|"|'|?|%|&|{|}|@|\:|;|'|#|~|?|`|,|<|>|\?|\\/.test(sides[j])) {	
			return true;
		}
		if (/[a-z][a-z]/.test(sides[j])) {
			return true;
		}
		if (/\(|\)/.test(sides[j])) {
			if (/\((.*?)\)/.test(sides[j])) {
				return false;
			} else {
				return true;
			}
		}
		if (/[0-9](?=\^)/.test(sides[j])) {
			return true;
		}
		if (/[a-z](?=\^[^2])/.test(sides[j])) {
			return true;
		}
	}
	return false;
}

// Collect like terms on each side of the equation.
function collectLikeTerms(side) {
	var regsign = /[+-]/;	
	var pos;
	var matches = new Array();
	var chars;
	var terms = side.split(regsign);
	var term = 0;
	if (terms[0] == side) {
		return side;
	}
	var signs = side.split(/[^+-]*/g);
	if (terms[0]=="") {
		for (var i=0; i<terms.length-1; i++) {
			terms[i] = terms[i+1]			
		}
		terms.pop();
	}
	if (signs.length < terms.length) {
		for (var j = terms.length-1; j >-1 ; j--) {
			signs[j+1] = signs[j];
		}
		signs[0] = "";
	}
	for (var j=0; j<signs.length; j++) {
		if (signs[j]=="+") {
			signs[j]="";
		}
		
	}	
	side = "";
	var num = 0;
	for (var i = 0; i<terms.length; i++) {
		if (matches = /[a-z]/.exec(terms[i])) {
			continue;
		}
		if (terms[i]=="") {
			continue;
		} else {
			num += parseFloat(signs[i] + parseFloat(terms[i].replace(/[a-z]/,"")));
		}
	}	
	for (var j = 0; j<vars.length; j++) {
		var xnum = 0;
		var regvar = new RegExp (vars.charAt(j));		
		for (var i = 0; i<terms.length; i++) {
			if (terms[i]=="") {
				continue;
			}
			if (/\^/.test(terms[i])) {
				term += parseFloat(signs[i] + parseFloat(terms[i]));
				terms[i] = "";
				continue;
			}
			if (matches = regvar.exec(terms[i])) {
				chars = matches[0];
				xnum += parseFloat(signs[i] + parseFloat(terms[i].replace(regvar,"")));
			}
		}
		if (xnum > 0) {
			if (j!=0) {
				side += "+" + xnum + chars;
			} else {
				side += xnum + chars;
			}
		}
		if (xnum < 0) {
			side += xnum + chars;
		}
	}
	if (num < 0) {
		side = side + num;
	}
	if (num > 0) {
		side = side + "+" + num;
	}
	if (parseFloat(term)) {
		if (xnum > 0) {
			side = term  + vars.charAt(0)+ "^2" + "+" + side;	
		} else {
			side = term  + vars.charAt(0)+ "^2" + side;
		}
	}
	return side;
}

// Converts all instances of division to multiplication.
function fixDivision(side) {
	var reg = /\//;
	var regdec = /[0-9.]/;	
	var matches;
	var matches2;
	var pos;
	var rightpos;
	var leftpos;
	var right = "";
	var left = "";
	var leftnum = "";
	var j = 0;
	while ((matches = reg.exec(side))&&(j<5)) {
		for (var i = 0; i<matches.length; i++) {
			pos = side.indexOf(matches[0]);			
			rightpos = ++pos;
			leftpos = --pos-1;
			while (matches2 = regdec.exec(side.charAt(rightpos))) {
				right = right + matches2[0];
				rightpos++;
			}
			// Here I need to break the logic up into 3 possible characters left of the division sign.
			// The character is a number.
			if (matches2 = /[0-9]/.exec(side.charAt(leftpos))) {
				while (matches2 = regdec.exec(side.charAt(leftpos))) {
					leftnum = matches2[0] + leftnum;
					leftpos--;
				}
			}
			// The character is an x.  This has 2 subpossibilities.  Either it will be preceded again by a number, or it will 
			// be a solitary x (with an implicit 1 - which we might as well insert now).
			if (matches2 = /[a-z]/.exec(side.charAt(pos-1))) {
				var chars = side.charAt(pos-1);
				if (matches2 = regdec.exec(side.charAt(pos-2))) {
					leftpos--;
					while (matches2 = regdec.exec(side.charAt(leftpos))) {
						leftnum = matches2[0] + leftnum;						
						leftpos--;
					}
					left = chars;
				} else {
					// This should work...
					leftpos--;
					leftnum = 1;
					left = chars;
				}
			}
			// The character is a ).  This also has 3 subpossibilities.  The parenthesis will either be preceeded by a number, a ) or a sign.
			// This case is slightly tricky because I cannot make any assumptions about what is inside the parenthesis.
			if (matches2 = /[\)]/.exec(side.charAt(pos-1))) {
				// First find the other set of parenthesis, while keeping track of the characters in between.
				leftpos--;
				matches2 = /\(/.exec(side.charAt(leftpos));
				while (!matches2) {
					left = side.charAt(leftpos) + left;
					leftpos--;
					matches2 = /\(/.exec(side.charAt(leftpos));
				}
				left = "(" + left + ")";
				leftpos--;
				// If there is another set of parenthesis, find the end of it as well.
				if (side.charAt(leftpos)==")") {
					matches2 = /\(/.exec(side.charAt(leftpos));
					while (!matches2) {
						left = side.charAt(leftpos) + left;
						leftpos--;
						matches2 = /\(/.exec(side.charAt(leftpos));
					}
					left = "(" + left;
					leftpos--;
				}
				if (matches2 = /[0-9]/.exec(side.charAt(leftpos))) {
					while (matches2 = regdec.exec(side.charAt(leftpos))) {
						leftnum = matches2[0] + leftnum;				
						leftpos--;
					}
				} else {
					leftnum = 1;	
				}
			}
			// Now update the main string.
			leftnum = parseFloat(leftnum)/parseFloat(right);
			matches2 = side.substring(leftpos+1, rightpos);
			side = side.replace(matches2, leftnum + left);			
		}		
		j++;		
		// Reset the temporary storage variables.
		leftnum = "";
		rightnum = "";		
		right = "";
		left = "";
	}
	return side;
}

// Collect all of the variables on the left hand side of the equals sign.
function collectVars(leftside, rightside) {
	var rightnum;
	var leftnum;
	var templeft = "";
	var tempright = "";
	var matches;
	for (var j = 0; j<vars.length; j++) {
		var regvar = new RegExp (vars.charAt(j));
		leftnum = matchNum(regvar,leftside);
		rightnum = matchNum(regvar,rightside);
		if ((rightnum)||(leftnum)) {
			leftnum = leftnum - rightnum;
		}
		if (j != 0) {
			if (leftnum >= 0) {
				sign = "+";
			} else {
				sign = "";
			}
			templeft += sign + leftnum  + vars.charAt(j);
		} else {
			templeft = leftnum + vars.charAt(j);
		}
	}
	return templeft;
}

// Regular expressions function to find the value of the numbers before a variable.
function matchNum(regvar,side) {
	var num = "";
	var sign;
	if (matches = regvar.exec(side)) {
		var pos = side.indexOf(matches[0])-1;
		sign = false;
		if (side.charAt(pos)=="+") {
			num = 1;
		}
		if (side.charAt(pos)=="-") {		
			num = 1;
			sign = true;
		}		
		while (matches2 = regdec.exec(side.charAt(pos))) {
			num = matches2[0] + num;
			pos--;
		}
		if (side.charAt(pos)=="-") {
			sign = true;
		}		
		if (sign) {
			num = "-" + num;
		}
	}
	if (num == "") {
		num = 0;
	}
	return num;
}

// Regular expressions tester to find the value of the number at the end of the expression.
function findNum(side) {
	var pos = side.length-1;
	var num = "";
	var sign = false;
	var matches;
	if (matches = /[a-z]/.exec(side.charAt(pos))) {
		return 0;
	}
	while (matches = regdec.exec(side.charAt(pos))) {
		num = matches[0] + num;
		pos--;
	}	
	if (side.charAt(pos)=="-") {
		sign = true;
	}
	if (sign) {
		num = "-" + num;
	}
	return num;
}


// Collect all of the numbers on the right hand side of the equals sign.
function collectNums(leftside,rightside) {	
	rightside = findNum(rightside)- findNum(leftside);
	return rightside;
}


// Remove the implicit multiplication from the algebra.
function removeImplicit(equation) {
	var reg = /(\+|-|\()(\(|[a-z])/;
	var reg2 = /\(|[a-z]/;
	var pos;
	var matches;
	
	// Handle the cases when x appears elsewhere in the expression.
	while (matches = reg.exec(equation)) {
		pos = equation.indexOf(matches[0])+1;
		equation = equation.replace(matches[0],matches[0].charAt(0) + "1" + matches[0].charAt(1));
	}
	
	// Handle the leading variable case or leading parenthesis case.
	if (matches = reg2.exec(equation.charAt(0))) {
		return "1" + equation;
	}

	return equation;
}

// Multiply out parenthesis.
function foil(side) {
	var regfoil = /\(([a-z0-9.+-]*)\)\(([a-z0-9.+-]*)\)/;
	var matches;
	var matches2;
	var factor1;
	var factor2;
	var sign1;
	var sign2;
	var num;
	var tmp = 0;
	var tmp2;
	while (matches = regfoil.exec(side)) {
		factor1 = matches[1].split(/[+-]/);
		factor2 = matches[2].split(/[+-]/);
		sign1 = matches[1].split(/[^+-]*/g);
		sign2 = matches[2].split(/[^+-]*/g);		
		if (factor1[0]=="") {
			for (var i=0; i<factor1.length-1; i++) {
				factor1[i] = factor1[i+1]			
			}
			factor1.pop();
		}
		if (factor2[0]=="") {
			for (i=0; i<factor2.length-1; i++) {
				factor2[i] = factor2[i+1]			
			}
			factor2.pop();
		}
		if (sign1.length < factor1.length) {
			for (var j=0; j < factor1.length; j++) {
				sign1[j+1] = sign1[j];
			}
			sign1[0] = "";
		}
		if (sign2.length < factor2.length) {
			for (var j=0; j < factor2.length; j++) {
				sign2[j+1] = sign2[j];
			}
			sign2[0] = "";
		}		
		for (var j=0; j<sign1.length; j++) {
			if (sign1[j]=="+") {
				sign1[j]="";
			}
			
		}		
		for (j=0; j<sign2.length; j++) {
			if (sign2[j]=="+") {
				sign2[j]="";
			}

		}
		var terms = new Array(factor1.length*factor2.length);
		for (i=0; i<factor1.length; i++) {
			for (var j=0; j<factor2.length; j++) {
				if (/[a-z]/.test(factor1[i])) {
					if (/[a-z]/.test(factor2[j])) {			
						terms[tmp] = (sign1[i] + parseFloat(factor1[i]))*(sign2[j] + parseFloat(factor2[j])) + vars.charAt(0) + "^2";
					} else {
						terms[tmp] = (sign1[i] + parseFloat(factor1[i]))*(sign2[j] + parseFloat(factor2[j])) + vars.charAt(0);
					}
				} else {
					if (/[a-z]/.test(factor2[j])) {					
						terms[tmp] = (sign1[i] + parseFloat(factor1[i]))*(sign2[j] + parseFloat(factor2[j])) + vars.charAt(0);
					} else {
						terms[tmp] = (sign1[i] + parseFloat(factor1[i]))*(sign2[j] + parseFloat(factor2[j]));
					}				
				}				
				tmp++;				
			}
		}
		var term = new Array(0,0,0);
		var num = "";
		var pos = side.indexOf(matches[0])-1;
		if (side.charAt(pos)=="+") {
			num = 1;
		}
		if (side.charAt(pos)=="-") {		
			num = 1;
			sign = true;
		}
		while (matches2 = regdec.exec(side.charAt(pos))) {
			num = matches2[0] + num;		
			pos--;
		}
		for (j=0; j<terms.length; j++) {
			if (/\^/.test(terms[j])) {
				term[0] = Math.round(num*parseFloat(terms[j])*100000)/100000 + vars.charAt(0) + "^2";
				terms[j] = "";
			}
			if (/[a-z]/.test(terms[j])) {
				term[1] += Math.round(num*parseFloat(terms[j])*100000)/100000;
				terms[j] = "";				
			}
			if (/[0-9]/.test(terms[j])) {
				term[2] += Math.round(num*terms[j]*100000)/100000;
			}
		}
		if (term[1]>0) {			
			term[1] = "+" + Math.round(term[1]*100000)/100000 + vars.charAt(0);
		} 		
		if (term[1] < 0 ) {
			term[1] = Math.round(term[1]*100000)/100000 + vars.charAt(0);
		} 
		if (!term[1]) {
			term[1] = "";
		}
		if (term[2] > 0) {
			term[2] = "+" + term[2];
		}
		if (term[2] == 0) {
			term[2] = "";
		}
		term = term.join("");
		side = side.replace(num+matches[0],term);
	}
	return side;
}

// Remove the parenthesis from an equation. 
function removeParenthesis(side) {
	var regpar = /\((.*?)\)/;
	var regsign = /[+-]/;
	var matches;
	var matches2;
	var string;
	var string2;
	var sign = null;		
	var pos;
	var num = "";
	var text;
	while (((matches = regpar.exec(side)) != undefined)) {		
		num = "";
		pos = side.indexOf(matches[0])-1;
		if (side.charAt(pos)=="+") {
			num = 1;
		}
		if (side.charAt(pos)=="-") {		
			num = 1;
			sign = true;
		}
		while (matches2 = regdec.exec(side.charAt(pos))) {
			num = matches2[0] + num;		
			pos--;
		}
		if (side.charAt(pos)=="-") {
			sign = true;
		}
		side = side.substr(0,pos+1) + side.substr(pos+num.length+1);		
		string = matches[1].split(regsign);
		for (var j=0; j<string.length;j++) {
			if ((0+string[j]) == parseFloat(string[j])) {
				string[j] = string[j]*num;
			} else {
				if (/\^/.test(string[j])) {
					matches2 = /[a-z]/.exec(string[j]);					
					string[j] = num*parseFloat(string[j]) + string[j].substr(string[j].indexOf(matches2[0]));
				} else {
					string[j] = num*parseFloat(string[j]) + string[j].charAt(string[j].length-1);
				}
			}
		}
		text = new Array ();
		pos = matches[1].split(/[^+-]/);
		var temp = 0;
		for (j = 0; j<pos.length; j++) {
			if (pos[j]!="") {
				text[temp] = pos[j];
				temp++;
			}
		}
		pos = text;
		text = string[0];
		for (j = 1; j<string.length; j++) {					
			if (sign!=null) {
				if (pos[j-1] == "-") {
					var temppos = "+";
				} 
				if (pos[j-1] == "+") {
					var temppos = "-";
				}
				pos[j-1] = temppos;
			}
			text = text + pos[j-1] + string[j];			
		}
		text = text.replace("NaN","");
		side = side.replace(matches[0],text);
		sign = null;
	}
	return side;	
}

// This counts the number of times a string is matched in another string
function CountValue( strText, reTargetString ){	
	var intCount = 0;
	strText.replace(reTargetString, function(){ intCount++;});
	// Return the updated count variable.
	return	(intCount);
}

// Count the variables in the given string and update the currentVariables array
function incrementCurrentVariables (element, index, array) {
	var matches;
	currentVariables[index] = new Array();
	for (var j = 0; j< variables.length; j++) {
		if (matches = CountValue (element, new RegExp(variables[j], "g" ))) {			
			currentVariables[index].push(variables[j]);
			currentVariables[index].push(matches);
			if (!vars.match(variables[j])) {
				vars += variables[j];
			}
		}
	}
	return;
}

// Collect the like terms when the equation includes an x^2
function collectSquared(leftside,rightside) {
	var x2num = Math.round((matchNum(/[a-z]\^2/,leftside)-matchNum(/[a-z]\^2/,rightside))*100000)/100000;
	leftside = leftside.replace(/[0-9.]*[a-z]\^2/,"");
	rightside = rightside.replace(/[0-9.]*[a-z]\^2/,"");	
	var xnum = Math.round((matchNum(/[a-z](?!\^)/,leftside)-matchNum(/[a-z](?!\^)/,rightside))*100000)/100000;
	var num = Math.round((findNum(leftside) - findNum(rightside))*100000)/100000;
	var pos = 0;
	if (x2num) {
		if (xnum >= 0) {
			if (num >= 0) {
				leftside = x2num + vars.charAt(0) + "^2+" + xnum + vars.charAt(0) + "+" + num;
			} else {
				leftside = x2num + vars.charAt(0) + "^2+" + xnum + vars.charAt(0) + num;
			} 
		} else {
			if (num >= 0) {
				leftside = x2num + vars.charAt(0) + "^2" + xnum + vars.charAt(0) + "+" + num;
			} else {
				leftside = x2num + vars.charAt(0) + "^2" + xnum + vars.charAt(0) + num;
			}
		}		
	} else {
		if (num >= 0) {
			leftside = xnum + vars.charAt(0) + "+" + num;
		} else {
			leftside = xnum + vars.charAt(0) + num;
		} 
	}
	return leftside;
}

// Find the constants, this function assumes they are on the right hand side of the equation.
function findConstants(equation) {
	var num = "";
	var regdec = /[0-9.]/;
	pos = equation.length-1;	
	while (matches2 = regdec.exec(equation.charAt(pos))) {
		num = matches2[0] + num;
		pos--;
	}
	if (equation.charAt(pos)=="-") {
		num = "-" + num;
	}	
	return num;
}

// Find the number of each variable in the array.
function findCoefficients(equation,i) {
	var matches;
	var reg;
	var regdec = /[0-9.]/;	
	var pos;
	var num ="";
	var matches2;
	var row = new Array ();	
	constants[i] = findConstants(equations[i]);
	equations[i] = "";
	for (var j = 0; j<vars.length; j++) {
		reg = new RegExp(vars.charAt(j));
		if (matches = reg.exec(equation)) {
			pos = equation.indexOf(matches[0])-1;
			while (matches2 = regdec.exec(equation.charAt(pos))) {
				num = matches2[0] + num;
				pos--;
				if (equation.charAt(pos)=="-") {
					num = "-" + num;
				}
			}
		}		
		if (num=="") {
			row[j] = 0;
			num = "0";
		} else {
			row[j] = num;
		}
		if (parseFloat(num)<0) {
			equations[i] += num + vars.charAt(j);
		} else {
			if (j==0) {
				equations[i] += num + vars.charAt(j);
			} else {
				equations[i] += "+" + num + vars.charAt(j);
			}
		}		
		num = "";
	}
	equations[i] = equations[i] + "=" + constants[i];
	return row;	
}

// Create an appropriate identity matrix to hold our Gaussian elimination.  Note that we call it the inverse, since it will eventually be the inverse matrix.
function identityMatrix() {
	for (var i = 0; i<equations.length; i++){		
		inverse[i] = new Array();
		for (var j = 0; j<equations.length;j++) {
			if (i==j) {
				inverse[i].push(1);
			} else {
				inverse[i].push(0);
			}
		}
	}
	return;
}

// Multiply two matrices.
function product(left,right) {
	var answer = new Array();
	var sum = 0;
	for (var i = 0; i<equations.length; i++) {
		answer[i] = new Array();
		for (var j = 0; j<equations.length; j++) {
			for (var k =0; k<equations.length;k++) {
				sum += left[i][k]*right[k][j];
			}
			//if (sum==parseFloat(sum)) {
				answer[i][j] = sum;
			//}
			sum = 0;
		}		
	}
	return answer;	
}

// Construct a row multiplication matrix
function multRow (row, num) {
	var answer = new Array ();
	for (var m = 0; m<equations.length; m++) {
		answer[m] = new Array ();
		for (var n = 0; n<equations.length; n++) {
			if (m == n) {
				if (m == row) {
					answer[m][n]=num;
				
				} else {
					answer[m][n]=1;
				}
			} else {
				answer[m][n]=0;
			}
		}
	}	
	return answer;
}

// Construct a row addition (or subtraction) matrix
function addRow (row, col, num) {
	var answer = new Array ();
	for (var m = 0; m<equations.length; m++) {
		answer[m] = new Array ();
		for (var n = 0; n<equations.length; n++) {
			if (m == n) {
				answer[m][n] = 1;
			} else {
				answer[m][n] = 0;
			}
			if ((m==row)&&(n==col)) {
				answer[m][n] = num;
			}
		}
	}	
	return answer;
}

// Creates a matrix to swap two rows.  You can also to swap to columns by multiplying on the other side.
function swapRows(row1,row2) {
	var answer = new Array();
	for (var m = 0; m<equations.length; m++) {
		answer[m] = new Array ();
		for (var n = 0; n<equations.length; n++) {
			if (m==row1) {
				if (n==row2) {
					answer[m][n] = 1;
					continue;
				} else {
					answer[m][n] = 0;
					continue;
				}
			} 
			if (m==row2) {
				if (n==row1) {
					answer[m][n] = 1;
				} else {
					answer[m][n] = 0;
				}
			} else {
				if(n==m) {
					answer[m][n] = 1;
				} else {
					answer[m][n] = 0;
				}
			}
		}
	}	
	return answer;	
}

// This is the crux of the solving of the equations.  We use Gaussian elimination (done in a rigid format) to find
// the inverse of the matrix.  This inverse will then be multiplied by the constants vector to product the solution.
function gaussianElimination() {
	coef = coefficients;
	var num = 0;
	var tmp = 0;
	var mult;
	var add;
	var swp;
	var step = 1;	
	for (var i = 0; i<equations.length; i++) {
		num = coef[i][i];
		if (num!=0) {
			mult = multRow(i,1/num);
			inverse = product(mult,inverse);
			coef = product(mult,coef);			
			displaySolution("<strong>Step " + step+ "</strong><br />");
			step++;
			displaySolution(displayMatrix(coef));
		} else {
			for (var j = 0; j < equations.length; j++) {
				tmp += coef[i][j];				
			}
			if (tmp == 0) {
				displaySolution("Indeterminant Solution.");
				return false;
			}
			var mx = maxValue(coef,i);
			swp = swapRows(i,mx);
			inverse = product(swp,inverse);
			coef = product(swp,coef);
			displaySolution("<strong>Step " + step+ "</strong><br />");
			step++;
			displaySolution(displayMatrix(coef));			
			num = coef[i][i];
			if (num!=0) {
				mult = multRow(i,1/num);
				inverse = product(mult,inverse);
				coef = product(mult,coef);
				displaySolution("<strong>Step " + step+ "</strong><br />");
				step++;
				displaySolution(displayMatrix(coef));
			} else {
				displaySolution("Indeterminant Solution.");
				return false;
			}
		}
		for (var j = 0; j<equations.length; j++) {
			if (i!=j) {
				num = coef[j][i];
				add = addRow (j, i, -1*num);
				inverse = product(add,inverse);
				coef = product(add,coef);
				displaySolution("<strong>Step " + step+ "</strong><br />");
				step++;				
				displaySolution(displayMatrix(coef));
			}
		}
		num = 0;
	}
	return true;
}

// Need special multiplication for finding the answer.
function findSolution() {
	var ans = new Array();	
	var sum = 0;	
	for (var i = 0; i<equations.length; i++) {
		ans[i] = new Array();
		for (var k = 0; k<equations.length; k++) {
			sum += inverse[i][k]*constants[k];
		}
		ans[i][0] = sum;
		sum = 0;
	}	
	return ans;	
}

// Find the row with the maximum value.
function maxValue(arr,col) {
    var mxm = arr[0][col];
	var k;
    for (var l=0; l<arr.length; l++) {
    	if (arr[l][col]>mxm) {
    		mxm = arr[l][col];
			k = l;
    	}
    }
    return k;
};

// Display a matrix as a table
function displayMatrix (matrix) {
	if (matrix[matrix.length-1][matrix.length-1]==undefined) {
		var text = "<table style=\"border-right: 1px solid black; border-left: 1px solid black; float: left; font-size: small;\">\n";
	} else {
		var text = "<table style=\"border-right: 1px solid black; border-left: 1px solid black; font-size: small;\">\n";
	}
	for (var i = 0; i<matrix.length; i++) {
		text += "<tr>\n";
		for (var j = 0; j<matrix.length; j++) {
			if (matrix[i][j]==parseFloat(matrix[i][j])) {
				text += "<td style=\"width: 50px; text-align: center; font-size: smaller;\">" + Math.round(matrix[i][j]*100000)/100000 + "</td>\n";
				continue;
			}
			if (matrix[i][j]==vars.charAt(i)) {
				text += "<td style=\"width: 50px; text-align: center; font-size: smaller;\">" + matrix[i][j] + "</td>\n";
			}
		}
		text += "</tr>\n";
	}
	text += "</table>\n";
	return text;	
}

// helper function for DOM
function $(el) {
	return document.getElementById(el);
}


// Display the solution, which currently only includes the rhs and the lhs.
function displaySolution(input) {
	var solution = $('solution');
	solution.innerHTML += input + "<br />\n";
	return;
}