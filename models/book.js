var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
bookstoreConn = mongoose.createConnection('mongodb://localhost/bookstore');
//Book Schema
var bookSchema = new mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	genre:{
		type: String,
		required: true
	},
	author:{
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	img_url:{
		type: String,
		required: true
	},
	created_date:{
		type: Date,
		default: Date.now
	}
});

//var Book = mongoose.model('Book', bookSchema);
var Book = bookstoreConn.model('Book', bookSchema);
module.exports = Book;

//Get Genres
module.exports.getBooks = function(callback,limit){
	Book.find(callback).limit(limit);
}

module.exports.getBookById = function(id, callback){
	Book.findById(id, callback);
}

module.exports.addBook = function(book, callback){
	Book.create(book, callback);
}

module.exports.updateBook = function(id, book, options, callback){
	var query = {_id: id};
	var update = {
		$set: {
			title: book.title,
			genre: book.genre,
			author: book.author,
			description: book.description,
			img_url: book.img_url
		}
	};
	//Book.update(query,update,callback);
	Book.findOneAndUpdate(query, update, options, callback);
}

module.exports.deleteBook = function(id, callback){
	var query = {_id: id};
	Book.findOneAndRemove(query, callback);
}