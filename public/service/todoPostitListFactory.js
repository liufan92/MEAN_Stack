angular
	.module("myApp")
	.factory("todoPostitListFactory",function($http, $q){
		var service = {};
		var _postitID = '';

		service.setPostitId = function(postitID){
			_postitID = postitID;
		}

		service.getPostitId = function(){
			return _postitID;
		}

		service.getList = function(){
			var deferred = $q.defer();

			$http.get("/api/todo/postits/"+_postitID+"/items")
			.then(function(data){
				deferred.resolve(data);
			}, function(err){
				console.log('error getting items for postit');
				deferred.reject(err);
			});
			return deferred.promise;
		}

		service.addToList = function(currentPostitId, newPostitItem){

			var newItem = {
				postitId: currentPostitId,
				detail: newPostitItem
			};

			var deferred = $q.defer();

			$http.post("/api/todo/postits/"+_postitID+"/items", newItem)
			.then(function(data){
		        deferred.resolve(data);
			},function(err){
				console.log("error adding items");
				deferred.reject(err);
			});
			return deferred.promise;
		};

		service.removeFromList = function(postitItemID){
			var deferred = $q.defer();

			$http.delete("/api/todo/postits/"+_postitID+"/items/"+postitItemID)
			.then(function(data){
		        deferred.resolve(data);
			},function(err){
				console.log("error removing items");
				deferred.reject(err);
			});
			return deferred.promise;
		};

		service.updateList = function(postitItemID, item){
			var deferred = $q.defer();
			var newStatus = 2; // default;

			if(item.status==2){newStatus = 0;}

			var updateItem = {
				postitId: _postitID,
				detail: item.detail,
				status: newStatus
			}

			$http.put("/api/todo/postits/"+_postitID+"/items/"+postitItemID, updateItem)
			.then(function(data){
		        deferred.resolve(data);
			},function(err){
				console.log("error updating items");
				deferred.reject(err);
			});

			return deferred.promise;
			
		};

		service.clearCheckedItem = function(){
			var deferred = $q.defer();
			$http.delete("/api/todo/postits/"+_postitID+"/items/")
			.then(function(data){
	        	deferred.resolve(data);
	    	}, function(){
	    		console.log("error clearing checked items");
				deferred.reject(err);
	    	});
	    	return deferred.promise;
		};

		return service;
	});