/*******************************************************************************
  					Controller for Note Creation Modal
********************************************************************************/

angular
	.module("myApp")
	.controller('TodoPostitController', function($scope, close, todoPostitFactory){

	$scope.noteTitle = "";
	$scope.noteDescription = "";

	$scope.saveNote = function(){
		todoPostitFactory
		.addItem($scope.noteTitle, $scope.noteDescription)
		.then(function(){
			todoPostitFactory
			.getAllItems()
			.then(function(result){
				console.log('then result: ');
				console.log(result.data);
				$scope.postits = result.data;
			});
			close();
		});

	};

});