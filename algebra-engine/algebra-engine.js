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
                    popped = stack.pop();
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
    for(var i = 0; i < rpnExpressionArray.length; i++){
        if(!isNaN(rpnExpressionArray[i]) && !isNaN(rpnExpressionArray[i+1])){
            var a = parseInt(rpnExpressionArray[i], 10);
            var b = parseInt(rpnExpressionArray[i+1], 10);
            if(rpnExpressionArray[i+2] === "*"){
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i, a*b);
                return simplifyOperands(newPostfixArray);
            }
            else if(rpnExpressionArray[i+2] === "+"){
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i, a+b);
                return simplifyOperands(newPostfixArray);
            }
            else if(rpnExpressionArray[i+2] === "/"){
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i, a/b);
                return simplifyOperands(newPostfixArray);
            }
            else if(rpnExpressionArray[i+2] === "-"){
                newPostfixArray = substituteInPostfixArray(rpnExpressionArray, i, a-b);
                return simplifyOperands(newPostfixArray);
            }
        }
        
    }
    return rpnExpressionArray;
    // TODO: doesn't fully work for our example of 12+3n*-5-6+7+ because we forgot to 
    // account for precedence
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

console.log("---");
var s = "1+2-3*n-5+6+7";  // Expect 12+3n*-5-6+7+
console.log(toSimplifiedPostfix(s));

var doMath = new DoMath(toSimplifiedPostfix("1+2-3*n-5+6+7"));
console.log(doMath.subtract(7));


    // use an array as a stack
    var stack = [];
    for(var count = 0; count < expression.length; count++){
        var char = expression.charAt(count);
        // check for operands, allowing single letter variables or single digit numbers
        // TODO: allow numbers greater than 10
        if(!isNaN(char) || char.match(/[a-z]/i)){
            postfix = postfix + char;
            console.log("a" + postfix);
        }
        else if(operators.indexOf(char) != -1){
            var popped;
            while(stack.length > 0){
                popped = stack.pop();
                if((isLeftAssociative(char) && precedence(char) === precedence(popped)) || (precedence(char) < precedence(popped))){
                    postfix = postfix + popped;
                    console.log("b" + postfix);
                    popped = stack.pop();
                }
                else{
                    stack.push(popped);
                    break;
                }
                
            }
            stack.push(char);
        }
        else{
            return "ERROR"; // TODO
        }
    }
    while(stack.length > 0){
        var poppedOperator = stack.pop();
        postfix = postfix + poppedOperator;
        console.log("c" + postfix);
    }
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
                   
var s = "1+2-3*4-5+6+7";  // Expect 12+34*-5-6+7+
console.log(infixToPostfix(s));
