var express = require('express');
var db = require('./models');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
	res.render('index');
})

app.get('/posts/new', function(req, res) {
	res.render('new');
})

app.get('/authors/:id', function(req, res) {
	db.author.find({
		where: {id: req.params.id},
		include: [db.post] //eager-loading----author.post can now be used
	}).then(function(author) {
		author.getPosts().then(function(posts) { //cool function to find all associated child relations
			res.send(posts); //after eager loading, can just do res.send(author.post)
		}); 
		//author.addPost / setPost
	})
})

app.post('/authors', function(req, res) {
	db.author.create({
		name: req.body.name
	}).then(function(data) {
		res.send(data);
	})
})

app.post('/posts', function(req, res) {
	console.log('in the post route');
 	db.author.find({
 		where: {id: req.body.authorId}
 	}).then(function(author) {
 		author.createPost({
 			title: req.body.title,
 			content: req.body.content
 		 //create+ your model name as a method
 		}).then(function(post) {
 			res.send(post);
 		})
 	})
 })

var port = 3000;

app.listen(port, function() {
	console.log('server running on port' + port + "...");
})