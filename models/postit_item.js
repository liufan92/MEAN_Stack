var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mypostitItemConn = mongoose.createConnection('mongodb://localhost/mypostit');

var postitItemSchema = new mongoose.Schema({
	postitId:{
		type: String,
		required: true
	},
	detail:{
		type: String,
		required: true
	},
	status:{
		type: Number,
		default: 0
	}
});

var PostitItem = mypostitItemConn.model('item', postitItemSchema);
//PostitItem = mypostitConn.model('PostitItem', postitItemSchema);
module.exports = PostitItem;

module.exports.getPostitItems = function(postitID, callback){
	PostitItem.find({postitId: postitID}, callback);
};

module.exports.addPostitItem = function(postitItem, callback){
	PostitItem.create(postitItem, callback);
};

module.exports.updatePostitItem = function(postitItemId, postitItem, options, callback){
	console.log('Updating items for ItemId: '+postitItemId);
	console.log(postitItem.postitId);
	console.log(postitItem.detail);
	console.log(postitItem.status);
	var query = {_id: postitItemId};
	var update = {
		$set: {
			postitId: postitItem.postitId,
			detail: postitItem.detail,
			status: postitItem.status
		}
	};
	//Book.update(query,update,callback);
	PostitItem.findOneAndUpdate(query, update, options, callback);
};

module.exports.deletePostitItem = function(postitItemId, callback){
	var query = {_id: postitItemId};
	PostitItem.findOneAndRemove(query, callback);
};

module.exports.clearPostitItems = function(currentPostitId, callback){
	var query = {postitId: currentPostitId, status: 2};
	PostitItem.remove(query, callback);
}