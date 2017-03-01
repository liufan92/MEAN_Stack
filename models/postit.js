var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mypostitConn = mongoose.createConnection('mongodb://localhost/mypostit');

var postitSchema = new mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	description:{
		type: String
	},
	owner:{
		type: String,
		required: true
	}
});

//var Postit = mongoose.model('Postit', postitSchema);
var Postit = mypostitConn.model('Postit', postitSchema);

module.exports = Postit;

module.exports.getPostits = function(ownerID, callback){
	console.log(ownerID);
	Postit.find({owner: ownerID}, callback);
};

module.exports.addPostit = function(postit, callback){
	Postit.create(postit, callback);
};

module.exports.updatePostit = function(id, postit, options, callback){
	var query = {_id: id};
	var update = {
		$set: {
			title: postit.title,
			description: postit.description,
			owner: postit.owner
		}
	};
	//Book.update(query,update,callback);
	Postit.findOneAndUpdate(query, update, options, callback);
};

module.exports.deletePostit = function(id, callback){
	var query = {_id: id};
	Postit.findOneAndRemove(query, callback);
};
