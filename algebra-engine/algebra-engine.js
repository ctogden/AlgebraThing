
var infixToPostfix = function(expression){
    console.log("---");
    var postfix = "";
    var operators = ["+", "-", "*", "/"];
    // use an array as a stack
    var stack = [];
    for(var count = 0; count < expression.length; count++){
        var char = expression.charAt(count);
        // check for operands, allowing single letter variables or single digit numbers
        // TODO: allow numbers greater than 10
        if(!isNaN(char) || char.match(/[a-z]/i)){
            postfix = postfix + char;
            console.log(postfix);
        }
        else if(operators.indexOf(char) != -1){
            var popped;
            while(stack.length > 0){
                popped = stack.pop();
                if((isLeftAssociative(char) && precedence(char) === precedence(popped)) || (precedence(char) < precedence(popped))){
                    postfix = postfix + popped;
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
        var chara = stack.pop();
        console.log(chara);
        postfix = postfix + chara;
        console.log(postfix);
    }
    return postfix;
};

var precedence = function(operator){
    if(operator === "+" || operator === "-"){ return 1; }
    else if(operator === "*" || operator === "/"){ return 2; }
    else{ return "Not an operator"; }
};

var isLeftAssociative = function(operator){
    if(operator === "/" || operator === "-"){ return true; }
    return false;
};
                   
var s = "1+2-3*4-5+6+7";  // Expect 12+34*-5-6+7+
console.log(infixToPostfix(s));
# start in web directory
cd /var/www

