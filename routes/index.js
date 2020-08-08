var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const { check, validationResult } = require('express-validator');
const e = require('express');
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



// read more button
router.get('/posts/show/:username/:post_id', (req, res) => {
  db = req.db;
  let categories = db.get('categories');
  let cat;
  categories.find({}, {}, (err, categories) => {
    cat = categories
  });
  

  let members = db.get('members');
  let mem;
  members.find({username: req.params.username}, {}, (err, members) => {
    mem = members[0]
  });

  let posts = db.get('posts');
  posts.find({_id: req.params.post_id}, {}, (err, post) => {
    res.render('post.jade', {
      title: "Post: " + post[0].title,
      "post": post[0],
      "categories": cat,
      "author": mem
    })
  })
  console.log(req.params.post_id, req.params.username)
})





//=====================comment===================
router.post('/posts/show/:username/:post_id', [
  check("name", "Name is rquired").notEmpty(),
  check("email", "Email is invalid").notEmpty().isEmail(),
  check("comment", "Comment field should not be empty").notEmpty()
],(req, res) => {
  const errors = validationResult(req);

  let categories = db.get('categories');
  let cat;
  categories.find({}, {}, (err, categories) => {
    cat = categories
  });
  

  let members = db.get('members');
  let mem;
  members.find({username: req.params.username}, {}, (err, members) => {
    mem = members[0]
  });

  let posts = db.get('posts');

  if(!errors.isEmpty()){
    console.log(errors.mapped())
    
    posts.find({_id: req.params.post_id}, {}, (err, post) => {
      res.render('post.jade', {
        title: "Post: " + post[0].title,
        errors: errors.mapped(),
        "post": post[0],
        "categories": cat,
        "author": mem
      })
    })
  }else{
    // store comment in database
    posts.insert({
      post_id: "",
      person_name: "",
      person_email: "",
      comment: "",
      type: ""
    }, (err, post) => {
      if(err){
        console.log('Submitting issue');
        req.flash('error', "There is a submitting issue. Sorry, we will fix it soon")
      }
      else{
        req.flash('success', "Your comment submitted successfully")
        res.redirect('/posts/show/'); //edit please
      }
    })

    console.log('commented successfully');
  }
})

module.exports = router;
