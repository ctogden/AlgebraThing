(function(){
	var regex = Parsimmon.regex;
	var string = Parsimmon.string; 
	var optWhitespace = Parsimmon.optWhitespace; 
	var lazy = Parsimmon.lazy; 
	var seq = Parsimmon.seq;
	var many = Parsimmon.many; 
	
		
	function lexeme(p) {
		return p.skip(optWhitespace);
	}
	
	function treeFromArray(array) {
		var startingValue = array[0];
		var opVals = array[1];
		tree = startingValue;
		for (var i=0; i<opVals.length; i++) {
			tree = {
				type: "binop", 
				left: tree,
				operator: opVals[i].operator,
				right: opVals[i].value
			};
		}
		return tree;
	}
	
	function operatorValue(array) {
		return {
			operator: array[0],
			value: array[1]
		}
	}
	
	function getParenObject(value){
		return {
			type: "paren" ,
			value : value
		};
	}
	
	var lparen = lexeme(string("(")); 
	var rparen = lexeme(string(")")); 
	
	var plusminus = lexeme(string("+").or(string("-"))); 
	var multdiv = lexeme(string("*").or(string("/"))); 
	var exponent = lexeme(string("^")); 
	var number = lexeme(regex(/[0-9]+/).map(parseInt)); 
	var variable = lexeme(regex(/[a-z]/i)); 
	
 
	
	var monomial = seq(number.or(variable),variable.many()).map(function(seqArray){
		var monomialTerms = [seqArray[0]].concat(seqArray[1]); 
		var current = monomialTerms[0]; 
		for(var i = 1; i < monomialTerms.length; i++){
			current = {
				type: "binop",  
				left: current, 
				operator: "*",
				right: monomialTerms[i]  
			};
		}
		return current; 
	}); 
	var parenexpr = monomial.or(lparen.then(lazy(function() {
		return expr;
	}).map(getParenObject)).skip(rparen)); 
	var expexpr = seq(parenexpr, exponent, parenexpr).map(function(array){
		return{
			type: "binop",  
			left: array[0], 
			operator: array[1],
			right: array[2]
		};
	}).or(parenexpr); 
	var multdivexpr = seq(expexpr,seq(multdiv,expexpr).map(operatorValue).many()).map(treeFromArray);  
	var expr = seq(multdivexpr,seq(plusminus,multdivexpr).map(operatorValue).many()).map(treeFromArray);  
	var equality = seq(expr.skip(lexeme(string("="))), expr); 
	window.parser=equality; 
	
})(); 

