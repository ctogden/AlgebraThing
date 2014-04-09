/*
*  Converts an infix mathematical expression to postfix (Reverse Polish) notation
*/
var infixToPostfix = function(expression){
    // TODO - add support for multi digit numbers, more operators, and parentheses
    var postfix = [];
    var operators = ["+", "-", "*", "/"];
    // use an array as a stack
    var stack = [];
    for(var count = 0; count < expression.length; count++){
        var char = expression.charAt(count);
        // check for operands, allowing single letter variables or single digit numbers
        // TODO: allow numbers greater than 9
        if(!isNaN(char) || char.match(/[a-z]/i)){
            postfix.push(char);
        }
        else if(operators.indexOf(char) != -1){
            var popped;
            while(stack.length > 0){
                popped = stack.pop();
                if((isLeftAssociative(char) && precedence(char) === precedence(popped)) || (precedence(char) < precedence(popped))){
                    postfix.push(popped);
                }
                else{
                    stack.push(popped);
                    break;
                }
                
            }
            stack.push(char);
        }
        else{
            throw new Exception("Invalid character in input string.");
        }
    }
    while(stack.length > 0){
        var poppedOperator = stack.pop();
        postfix.push(poppedOperator);
    }
    console.log(postfix);
    return postfix;
};

var precedence = function(operator){
    if(operator === "+" || operator === "-"){ return 1; }
    else if(operator === "*" || operator === "/"){ return 2; }
    else{ return "Not an operator"; }
};

var isLeftAssociative = function(operator){
    if(operator === "/" || operator === "-" || operator === "*" || operator === "+"){ return true; }
    return false;
};

/*
*  Takes a postfix (Reverse Polish Notation) expression and combines like terms
*/
var simplifyOperands = function(rpnExpressionArray){
    // Scan from left to right.
    // If two numbers followed by an operator, substitute result and step
    // position back to that substituted value. If either operand is a 
    // variable, move on.
    var testOperation;
    for(var i = 2; i < rpnExpressionArray.length; i++){
        if(rpnExpressionArray[i] === "*"){
            testOperation = parseInt(rpnExpressionArray[i-2], 10) * parseInt(rpnExpressionArray[i-1], 10);
            if(!isNaN(testOperation)){
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i-2, testOperation.toString());
                return simplifyOperands(newPostfixArray);   
            }
        } 
        else if (rpnExpressionArray[i] === "/"){
            testOperation = parseInt(rpnExpressionArray[i-2], 10) / parseInt(rpnExpressionArray[i-1], 10);
            if(!isNaN(testOperation)){
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i-2, testOperation.toString());
                return simplifyOperands(newPostfixArray);
            }
        } 
        else if (rpnExpressionArray[i] === "+"){
            testOperation = parseInt(rpnExpressionArray[i-2], 10) + parseInt(rpnExpressionArray[i-1], 10);
            if(!isNaN(testOperation)){
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i-2, testOperation.toString());
                return simplifyOperands(newPostfixArray); 
            }
        } 
        else if (rpnExpressionArray[i] === "-"){
            testOperation = parseInt(rpnExpressionArray[i-2], 10) - parseInt(rpnExpressionArray[i-1], 10);
            if(!isNaN(testOperation)){
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i-2, testOperation.toString());
                return simplifyOperands(newPostfixArray); 
            }
        }                  
    }
    return rpnExpressionArray;
    // TODO - doesn't fully work for all cases because I haven't yet
    // accounted for associativity.
};

var substituteInPostfixArray = function(array, count, substitution){
    var newArray = [];
    for(var i = 0; i < count; i++){
        newArray.push(array[i]);
    }
    newArray.push(substitution);
    count += 3;
    for(count; count < array.length; count++){
        newArray.push(array[count]);
    }
    return newArray;
};

var toSimplifiedPostfix = function(infixExpression){
    return simplifyOperands(infixToPostfix(infixExpression));
};

function DoMath(rpnExpressionArray){
    this.expression = rpnExpressionArray;
    console.log(this.expression);
}

DoMath.prototype.add = function(value){
    this.expression.push(value);
    this.expression.push("+");
    return simplifyOperands(this.expression);
};

DoMath.prototype.subtract = function(value){
    this.expression.push(value);
    this.expression.push("-");
    return simplifyOperands(this.expression);
};

DoMath.prototype.multiply = function(value){
    this.expression.push(value);
    this.expression.push("*");
    return simplifyOperands(this.expression);
};

DoMath.prototype.divide = function(value){
    this.expression.push(value);
    this.expression.push("/");
    return simplifyOperands(this.expression);
};

console.log("---");
var s = "2+2-3*n-5+6+7";  // Expect 12+3n*-5-6+7+
console.log(toSimplifiedPostfix(s));

console.log(simplifyOperands([2, 2, "*", 2, 13, "*", "*", 3, 4, "-", "/", 1, "+"]));

var doMath = new DoMath(toSimplifiedPostfix("3*n*3"));
console.log(doMath.subtract(7));
console.log(doMath.add(4));
console.log(doMath.divide(129));


