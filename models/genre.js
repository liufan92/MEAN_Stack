var mongoose = require('mongoose');

//Genre Schema
var genreSchema = mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	created_date:{
		type: Date,
		default: Date.now
	}
});

var Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;

//Get Genres
module.exports.getGenres = function(callback,limit){
	Genre.find(callback).limit(limit);
}
//Add Genre
module.exports.addGenre = function(genre, callback){
	Genre.create(genre,callback);
}
//Update Genre
module.exports.updateGenre = function(id, genre, options, callback){
	var query = {_id: id};
	var update = {
		name: genre.name
	};

	Genre.findOneAndUpdate(query, update, options, callback);
}
//Delete Genre
module.exports.deleteGenre = function(id, callback){
	var query = {_id: id};
	Genre.findOneAndRemove(query, callback);
}