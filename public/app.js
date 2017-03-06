var myApp = angular
	.module('myApp', [
		'ui.router',
		'angularModalService',
		'angular-storage',
		'angular-jwt', 
		'auth0'
		]);

myApp.config(function(/*$provide,*/ authProvider, $urlRouterProvider, $stateProvider, $httpProvider, jwtInterceptorProvider, jwtOptionsProvider){

	var clientId = "lgGpyZ1zbHRNFpX8uJTpS4apngAJLhky";
	var domainName = "iamliufan.auth0.com";
	
	authProvider.init({
		clientID: clientId,
		domain: domainName
	});

	/*jwtOptionsProvider.config({
      whiteListedDomains: ['localhost']
    });
	*/
	jwtOptionsProvider.config({
	  tokenGetter: ['store', function(store) {
	    return store.get('id_token');
	  }]
	});

	$urlRouterProvider.otherwise('/');

	$stateProvider
      .state('home',{
        url: '/',
        templateUrl:'view/aboutme.html'
      })
      .state('login',{
        url:'/todo/login',
        templateUrl:'view/todo_welcome.tpl.html'
      })
      .state('todo',{
        url:'/todo',
        templateUrl:'view/todo.tpl.html',
        //controller:'TodoController as todo'
        controller:'TodoController'
      });
	/*$routeProvider
		.when('/',{
			//controller: 'BooksController',
			templateUrl: 'view/aboutme.html'
		})
		//URL for Bookstore
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
		});*/
		//----For redirecting users back to Home(login) page when their token expired-----//
    /*function redirect($q, $injector, $timeout, store, $location){

      var auth;
      $timeout(function(){
        auth = $injector.get('auth');
      });

      return{
        responseError: function(rejection){
          if(rejection.status === 401){
            auth.signout();
            store.remove('profile');
            store.remove('id_token');
            $location.path('/home');
          }

          return $q.reject(rejection);
        }
      }
    }

    $provide.factory('redirect', redirect);

    $httpProvider.interceptors.push('redirect');*/
	$httpProvider.interceptors.push('jwtInterceptor');

});

myApp.run(function($rootScope, store, auth, jwtHelper, $location, $state) {
	$rootScope.$on('$stateChangeStart', function(){
      var token = store.get('id_token');
      if(token){
        if(!jwtHelper.isTokenExpired(token)){
          if(!auth.isAuthenticated){
            auth.authenticate(store.get('profile'),token);
          }
        }
      }else{
      	//$location.path('/todo');
      }
    });
});