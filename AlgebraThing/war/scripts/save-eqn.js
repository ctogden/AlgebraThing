var save_req;

function saveEquation() {
	var eqnJSON = {};
	
	// GET ALL VALUES ASSOCIATED WITH AN EQUATION
	var eTag = $('math-output').children()[0];
	var equation = $(eTag).text();
	
	eqnJSON['equation'] = equation;
	
	/*
	var url = "saveEquation"
	save_req = new XMLHttpRequest();
	save_req = open("GET", url, true);
	*/
	
	$.ajax({
		type: "get",
		url: "/saveEquation",
		dataType: "json",
		data: "equationData=" + eqnJSON,
		success: function() {
			alert('Equation was saves successfully.');
		}
	});
}