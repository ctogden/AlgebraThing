(function(){
	var regex = Parsimmon.regex;
	var string = Parsimmon.string; 
	var optWhitespace = Parsimmon.optWhitespace; 
	var lazy = Parsimmon.lazy; 
	var seq = Parsimmon.seq; 
	
		
	function lexeme(p) {
		return p.skip(optWhitespace);
	}
	
	function treeFromArray(array) {
		var startingValue = array[0];
		var opVals = array[1];
		tree = startingValue;
		for (var i=0; i<opVals.length; i++) {
			tree = {
				left: tree,
				operator: opVals[i].operator,
				right: opVals[i].value
			};
		}
		return tree;
	}
	
	function operatorValue(array) {
		return {
			type: "binop", 
			operator: array[0],
			value: array[1]
		}
	}
	
	function getParenObject(value){
		return {
			type : "paren" 
		};
	}
	
	var lparen = lexeme(string("(")); 
	var rparen = lexeme(string(")")); 
	
	var plusminus = lexeme(string("+").or(string("-"))); 
	var multdiv = lexeme(string("*").or(string("/"))); 
	var number = lexeme(regex(/[0-9]+/).map(parseInt)); 
	var id = lexeme(regex(/[a-z_]\w*/i)); 
	
	var atom = number.or(id); 
	var parenexpr = atom.or(lparen.then(lazy(function() {
		return expr;
	}).map(getParenObject)).skip(rparen)); 
	var multdivexpr = seq(parenexpr,seq(multdiv,parenexpr).map(operatorValue).many()).map(treeFromArray);  
	var expr = seq(multdivexpr,seq(plusminus,multdivexpr).map(operatorValue).many()).map(treeFromArray);  
	
	window.parser=expr; 
	
})(); 

