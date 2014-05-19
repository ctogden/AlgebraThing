/*
*  Converts an infix mathematical expression to postfix (Reverse Polish) notation
*/
var infixToPostfix = function(expression){
    // TODO - add support for multi digit numbers, more operators, and parentheses
    var postfix = [];
    // use an array as a stack
    var stack = [];
    for(var count = 0; count < expression.length; count++){
        var char = expression.charAt(count);
        // check for operands, allowing single letter variables or single digit numbers
        // TODO: allow numbers greater than 9
        if(!isNaN(char) || char.match(/[a-z]/i)){
            postfix.push(char);
        }
        else if(isOperator(char)){
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

var isOperator = function(char){
    var operators = ["+", "-", "*", "/"];
    return (operators.indexOf(char) != -1);
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
    // First move any variables as far to the right as possible
    // We can do this across subsequent additions and/or subtractions, or 
    // multiplications, but not divisions
// TODO    rpnExpressionArray = shiftVariables(rpnExpressionArray);
  
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


// TODO complete this method
/*
*  Shift variables as far right as possible to allow for further 
*  combinations of like expressions
*/
var shiftVariables = function (rpnExpressionArray){
    // Move any variables as far to the right as possible
    // We can do this across subsequent additions and/or subtractions, or 
    // multiplications, but not divisions
    for(var i = 0; i < rpnExpressionArray.length; i++){
        if(rpnExpression[i].match(/[a-z]/i)){
            if(!isNaN(rpnExpression[i+1])){
                var temp = rpnExpression[i];
                rpnExpression[i] = rpnExpression[i+1];
                rpnExpression[i+1] = temp;
            }
        }
        else if(isOperator(rpnExpression[i])){
            
        }
    }
    
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

/** Here we just print out some tests.  Remove later **/

console.log("---");
console.log(simplifyOperands("2n*3*3*")); // TODO - fix me, I should output an array...
console.log(simplifyOperands("2n*33**"));
var doMath = new DoMath(toSimplifiedPostfix("3*n*3"));
console.log(doMath.subtract(7));
console.log(doMath.add(4));
console.log(doMath.divide(129));
