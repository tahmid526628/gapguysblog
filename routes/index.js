var express = require('express');
var router = express.Router();
const mongo = require('mongodb')
let db = require('monk')('mongodb+srv://tahmid:526628Tahmid@test1.mbzeo.mongodb.net/gapguysblog?retryWrites=true&w=majority');

/* GET home page. */
router.get('/', function(req, res, next) {
  db = req.db;
  let categories = db.get('categories');
  let cat;
  categories.find({}, {}, (err, categories) => {
    cat = categories
  });

  let posts = db.get('posts');
  posts.find({}, {}, (err, posts) => {
    res.render('index', 
    {title: 'Home', 
    "posts": posts,
    "categories": cat
  });
  })
});

module.exports = router;
