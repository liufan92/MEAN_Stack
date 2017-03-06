angular
	.module("myApp")
	//.controller('todoCtrl', function($scope, $http, ModalService, AuthenticationService, $state){
	.controller('TodoController', function($scope, $http, ModalService, todoPostitFactory, store, $location, $state){
	
	var token = store.get('id_token');
	var profile = store.get('profile');

	if (token) {
		$scope.profile = store.get('profile');
		todoPostitFactory.setUsername($scope.profile.user_id.substr($scope.profile.user_id.indexOf("|") + 1)); 
		console.log(todoPostitFactory.getUsername());
	}else{
		$state.go('login');
		return;
	};

	todoPostitFactory
	.getAllItems()
	.then(function(result){
		$scope.postits = result.data;
		//console.log(result.data);
	});

	$scope.newNote = function(){
		ModalService.showModal({
			templateUrl: "view/todoPostit.tpl.html",
			controller:"TodoPostitController"
		}).then(function(modal){
			modal.element.modal();
			modal.close.then(function() {
		        todoPostitFactory
		        .getAllItems()
		        .then(function(result){
					$scope.postits = result.data;
				});
		    });
		});
	};

	$scope.deleteNote = function(postit){
		if(confirm("Are you sure to delete this item?")){
	    	todoPostitFactory
	    	.deleteItem(postit._id)
	    	.then(function(){
	    		todoPostitFactory
	    		.getAllItems()
	    		.then(function(result){
					$scope.postits = result.data;
				});
	    	});
	    }
	};

	$scope.showList = function(postit){

		ModalService.showModal({
			templateUrl: "view/todoPostitList.tpl.html",
			controller: "TodoPostitListController",
			inputs: {
				title: postit.title,
				postitID: postit._id
			}
		}).then(function(modal){
			modal.element.modal();
		});
	};

});