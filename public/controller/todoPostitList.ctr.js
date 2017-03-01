angular
	.module("myApp")
	.controller('TodoPostitListController', function($scope, $http, title, postitID, todoPostitListFactory){
	
	//$scope.close = modals.resolve;
	$scope.title = title;
	$scope.currentPostitID = postitID;

	console.log(postitID);
	todoPostitListFactory.setPostitId(postitID); //should be resolved first
	fetchList();

	function fetchList() {
		todoPostitListFactory.getList().then(function(result){
			$scope.lists = result.data;
		});
	};

	$scope.addItem = function(newPostitItem){
		var currentPostitId = todoPostitListFactory.getPostitId();

		todoPostitListFactory.addToList(currentPostitId, newPostitItem)
		.then(function(){
			fetchList();
	        $scope.addNewInput = "";
		}, function(){
			console.log("ERROR: ADD ITEM...");
		});
	};

	$scope.removeItem = function(listItem){
		todoPostitListFactory.removeFromList(listItem._id)
		.then(function(){
			fetchList();
		},function(){
			console.log("ERROR: REMOVE ITEM...");
		});
	};

	$scope.changeStatus = function(listItem){
		todoPostitListFactory.updateList(listItem._id, listItem)
		.then(function(){
			fetchList();
		},function(){
			console.log("ERROR: UPDATE ITEM...");
		});
	};

	$scope.clearItem = function(){
		if(confirm("Delete all checked items?")){
	    	todoPostitListFactory.clearCheckedItem()
	    	.then(function(){
	    		fetchList();
	    	},function(){
				console.log("ERROR: CLEAR ITEM...");
			});
	    };
	};


});