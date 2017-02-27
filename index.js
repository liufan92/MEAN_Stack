var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');

//Interact MongoDB with MongoJS
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

////Interact MongoDB with Mongoose 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bookstore');
Genre = require('./models/genre');
Book = require('./models/book');

var app = express();

//View Engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

// Body Parser Middleware
app.use(bodyParser.json()); //Handle parsing JSON content
app.use(bodyParser.urlencoded({extended:false}));

//Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

//Global variables
app.use(function(req,res,next){
	res.locals.errors = null;
	next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Handle GET request
app.get('/',function(req,res){
	//res.json(person);
	db.users.find(function (err, docs) {
    // docs is an array of all the documents in mycollection
    res.render('index',{title: 'customer',users: docs});
	});	
});

app.post('/users/add', function(req,res){

	req.checkBody('first_name','First name is required').notEmpty();
	req.checkBody('last_name','Last name is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index',{
			title: 'customer',
			users: users,
			errors: errors
		});
	}else{
		var newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}

		db.users.insert(newUser,function(err,result){
			if(err){
				console.log(error);
			}
			res.redirect('/');
		});
	}
	
});

app.delete('/users/delete/:id', function(req,res){
	//console.log(req.params.id);
	db.users.remove({_id: ObjectId(req.params.id), function(err, result){
		if(error){
			console.log(error);
		}
		res.redirect('/');
	}})
});

//Interact MongoDB with MongoJS
app.get('/api/genres', function(req, res){
	Genre.getGenres(function(err,genres){
		if (err){
			throw err;
			res.status(500).send();
		}else{
			res.json(genres);
		}
	})
});

app.post('/api/genre', function(req, res){
	var genre = req.body;
	Genre.addGenre(genre, function(err,genre){
		if (err){
			throw err;
			res.status(500).send();
		}else{
			res.json(genre);
		}
	})
});

app.put('/api/genres/:_id', function(req, res){
	var id = req.params._id;
	var genre = req.body;
	Genre.updateGenre(id, genre, {}, function(err,genre){
		if (err){
			throw err;
			res.status(500).send();
		}else{
			res.json(genre);
		}
	})
});

app.delete('/api/genres/:_id', function(req, res){
	var id = req.params._id;
	Genre.deleteGenre(id, function(err,genre){
		if (err){
			throw err;
			res.status(500).send();
		}else{
			res.json(genre);
		}
	})
});

app.get('/api/books', function(req, res){
	Book.getBooks(function(err,books){
		if (err){
			throw err;
			res.status(500).send();
		}else{
			res.json(books);
		}
	})
});

app.get('/api/books/:_id', function(req, res){
	Book.getBookById(req.params._id, function(err,book){
		if (err){
			throw err;
			res.status(500).send();
		}else{
			res.json(book);
		}
	})
});

app.post('/api/book', function(req, res){
	var book = req.body;
	Book.addBook(book, function(err,book){
		if (err){
			throw err;
			res.status(500).send();
		}else{
			res.json(book);
		}
	})
});

app.put('/api/books/:_id', function(req, res){
	var id = req.params._id;
	var book = req.body;
	Book.updateBook(id, book, {}, function(err,book){
		if (err){
			throw err;
			res.status(500).send();
		}else{
			res.json(book);
		}
	})
});

app.delete('/api/books/:_id', function(req, res){
	var id = req.params._id;
	Book.deleteBook(id, function(err,book){
		if (err){
			throw err;
			res.status(500).send();
		}else{
			res.json(book);
		}
	})
});

app.listen(3000,function(){
	console.log('Listening on port 3000...');
});