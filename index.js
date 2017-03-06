var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var jwt = require('express-jwt');
var expressValidator = require('express-validator');
var cors = require('cors');


//Interact MongoDB with MongoJS
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

////Interact MongoDB with Mongoose 
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/bookstore');

Genre = require('./models/genre');
Book = require('./models/book');
Postit = require('./models/postit');
PostitItem = require('./models/postit_item');

var app = express();

//View Engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

//Allow Cross Origin Resource Sharing
app.use(cors());
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

var authCheck = jwt({
	//secret: new Buffer('fam8oGxd46ebhs7Ybo0NUodlwjIagvtW4wWDCB29rv7fdpHqzqy6_Ks-wbUkMLu7','base64'),
	secret: 'fam8oGxd46ebhs7Ybo0NUodlwjIagvtW4wWDCB29rv7fdpHqzqy6_Ks-wbUkMLu7',
	audience: 'lgGpyZ1zbHRNFpX8uJTpS4apngAJLhky'
});


//Handle GET request with MongoJS
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

//Interact MongoDB with Mongoose
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

//--TODO with MONGO--//
app.get('/api/todo/postits/:_owner', authCheck, function(req, res){
	Postit.getPostits(req.params._owner, function(err, postits){
		if(err){
			throw err;
			res.status(500).send();
		}else{
			res.json(postits);
		}
	});
});

app.put('/api/todo/postit/:_id', authCheck, function(req, res){
	var postitId = req.params._id;
	var updateInfo = req.body;

	Postit.updatePostit(postitId, updateInfo, {}, function(err, postit){
		if(err){
			throw err;
			res.status(500).send();
		}else{
			res.json(postit);
		}
	})

});

app.post('/api/todo/postit', authCheck, function(req,res){
	var postit = req.body;
	Postit.addPostit(postit, function(err, postit){
		if(err){	
			throw err;
			res.status(500).send();
		}else{
			res.json(postit);
		};
	});
});

app.delete('/api/todo/postit/:_id', authCheck, function(req, res){
	var id = req.params._id;
	Postit.deletePostit(id, function(err, postit){
		if(err){
			throw err;
			res.status(500).send();
		}else{
			res.json(postit);
		};
	});
});

app.get('/api/todo/postits/:postitId/items', authCheck, function(req, res){
	var id = req.params.postitId;
	PostitItem.getPostitItems(id, function(err, postitItems){
		if(err){
			throw err;
			res.status(500).send();
		}else{
			res.json(postitItems);
		}
	});
});

app.post('/api/todo/postits/:postitId/items', authCheck, function(req, res){
	var newPostitItem = req.body;
	PostitItem.addPostitItem(newPostitItem, function(err, postitItems){
		if(err){
			throw err;
			res.status(500).send();
		}else{
			res.json(postitItems);
		}
	});
});

app.put('/api/todo/postits/:postitId/items/:_itemId', authCheck, function(req, res){
	var itemId = req.params._itemId;
	var updatePostitItem = req.body;

	PostitItem.updatePostitItem(itemId, updatePostitItem, function(err, postitItems){
		if(err){
			throw err;
			res.status(500).send();
		}else{
			res.json(postitItems);
		}
	});
});

app.delete('/api/todo/postits/:postitId/items/:itemId', authCheck, function(req, res){
	var itemId = req.params.itemId;
	console.log('removing itemId: '+ itemId)
	PostitItem.deletePostitItem(itemId, function(err, postitItem){
		if(err){
			throw err;
			res.status(500).send();
		}else{
			res.json(postitItem);
		}
	});
});

app.delete('/api/todo/postits/:postitId/items', authCheck, function(req, res){
	var postitId = req.params.postitId;
	PostitItem.clearPostitItems(postitId, function(err, postitItems){
		if(err){
			throw err;
			res.status(500).send();
		}else{
			res.json(postitItems);
		}
	});
});



app.listen(3000,function(){
	console.log('Listening on port 3000...');
});