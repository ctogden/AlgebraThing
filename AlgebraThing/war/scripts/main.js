//Main script file for the application
$(function(){
		
        // On loading the initial page, it also loads the modal
		$(window).load(function(){
		        $('#welcome').modal('show');
		        $('#function_bar').hide();
		    });
		 
		// Popover for Equation Help
		$('#equation_help').popover({
	 		trigger: 'click',
		    placement: 'right',
		    title: 'Help'
	 	});
		
		// Popover for more operations
		$('#more_functions').popover({
	 		trigger: 'click',
		    placement: 'right'
	 	});
		
});

//Angular Controller
function MainController($scope){
	
	$scope.equations = [];
	
	$scope.submitEquation = function()
	{
		$scope.equations.push($scope.newEquation);
        $scope.newEquation = "";
        $('#equation_editor').hide();
        $('#equation_help').hide();
        $('#function_bar').show();
	}
	
}