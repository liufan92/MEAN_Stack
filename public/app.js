var myApp = angular.module('myApp',['ngRoute','angularModalService']);

myApp.config(function($routeProvider){
	
$routeProvider
	.when('/',{
		//controller: 'BooksController',
		templateUrl: 'view/aboutme.html'
	})
	.when('/todo',{
		controller: 'TodoController',
		templateUrl: 'view/todo.tpl.html'
	})
	.when('/todo/postits',{
		controller: 'TodoPostitController',
		templateUrl: 'view/todoPostit.tpl.html'
	})
	.when('/todo/postit/:id',{
		controller: 'TodoPostitListController',
		templateUrl: 'view/todoPostitList.tpl.html'
	})
	.when('/books',{
		controller: 'BooksController',
		templateUrl: 'view/books.html'
	})
	.when('/books/details/:id',{
		controller: 'BooksController',
		templateUrl: 'view/book_details.html'
	})
	.when('/books/add',{
		controller: 'BooksController',
		templateUrl: 'view/add_book.html'
	})
	.when('/books/edit/:id',{
		controller: 'BooksController',
		templateUrl: 'view/edit_book.html'
	})
	.otherwise({
		redirectTo: '/'
	});

});