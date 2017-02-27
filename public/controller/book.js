var myApp = angular.module('myApp');

myApp.controller('BooksController',function($scope, $http, $location, $routeParams){
	
	//Get all book
	$scope.getBooks = function(){
		$http.get('/api/books').then(function(response){
			$scope.books = response.data;
		});
	};

	//Get a specific book
	$scope.getBook = function(){
		var id = $routeParams.id;
		$http.get('/api/books/'+id).then(function(response){
			$scope.book = response.data;
		});
	};

	//Add book
	$scope.addBook = function(){
		$http.post('/api/book', $scope.book).then(function(response){
			window.location.href='#!/books';
		});
	};

	$scope.updateBook = function(){
		//console.log('updating book id:'+ bookid);
		//var id = bookid;
		var id = $routeParams.id;
		$http.put('/api/books/'+id, $scope.book).then(function(response){
			window.location.href='#!/books';
		});
	};

	$scope.removeBook = function(bookid){
		$http.delete('/api/books/'+bookid).then(function(response){
			window.location.href='#!/books';
		});
	};


});