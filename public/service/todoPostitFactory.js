angular
	.module("myApp")
	.factory("todoPostitFactory",function($http, $q){

		var service = {};
		var _username = '';

		service.setUsername = function(username){
			_username = username;
		};

		service.getUsername = function(username){
			return _username;
		};

		service.getAllItems = function(){	
			var deferred = $q.defer();
			$http.get("/api/todo/postits/"+_username)
			.then(function(data){
				console.log(data);
				deferred.resolve(data);
			}
			,function(err){
				//any error handler 
				console.log("getAll error");
				deferred.reject(err);
			});			
			return deferred.promise;	
		};

		service.addItem = function(title, description){
			var newPostit = {
				title: title,
				description: description,
				owner: _username
			};

			var deferred = $q.defer();
			$http.post("/api/todo/postit", newPostit)
			.then(function(data){
				console.log("add success");
				deferred.resolve(data);
			},function(err){
				console.log("add error");
				deferred.reject(err);
			});
			return deferred.promise;	
		};

		service.deleteItem = function(id){
			var deferred = $q.defer();
			$http.delete("/api/todo/postit/"+id)
			.then(function(data){
				console.log("delete success");
				deferred.resolve(data);
	    	},function(err){
	    		console.log("delete error");
	    		deferred.reject(err);
	    	});
			return deferred.promise;		
		};

		service.updateItem = function(postit){

			var renewPostit = {
				title: postit.title,
				description: postit.description,
				owner: _username
			};

			var deferred = $q.defer();
			$http.put("/api/todo/postit/"+postit._id, renewPostit)
			.then(function(data){
				console.log("update success");
				deferred.resolve(data);
	    	},function(err){
	    		console.log("update error");
	    		deferred.reject(err);
	    	});
			return deferred.promise;		
		};

		return service;
	});