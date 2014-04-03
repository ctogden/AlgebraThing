/*Main script file for Angularjs*/

function MainController($scope){
	
	$scope.equations = [];
	
	$scope.submitEquation = function()
	{
		$scope.equations.push($scope.newEquation);
        $scope.newEquation = "";
	}
	
}