var express = require('express');
var router = express.Router();
const mongo = require('mongodb')
let db = require('monk')('mongodb+srv://tahmid:526628Tahmid@test1.mbzeo.mongodb.net/gapguysblog?retryWrites=true&w=majority');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const localStrategy = require('passport-local');

const global = require('../my_modules/global');
const User = require("../models/user");

// i need categories in all page cause I've added categories dynamically 
// to the navigation
let categories = db.get('categories');
let usernameGlobal;
/* GET users listing. */
router.get('/add_post', function(req, res, next) {
  categories.find({},{}, (err, categories) => {
    res.render('add_post', {
      title: "Add Post",
      categories: categories
    })
  })
});

router.get('/add_category', function(req, res, next) {
  categories.find({},{}, (err, categories) => {
    res.render('add_category', {
      title: "Add Category",
      categories: categories
    })
  })
});

router.get('/', (req, res) => {
  categories.find({},{}, (err, categories) => {
    res.render('members', {
      title: "Members Area",
      categories: categories
    })
  })
})

router.get('/register', (req, res) => {
  categories.find({},{}, (err, categories) => {
    res.render('register', {
      title: "Register",
      categories: categories
    })
  })
})// button: Be a member

router.get('/login', (req, res) => {
  categories.find({},{}, (err, categories) => {
    res.render('login', {
      title: "Login",
      categories: categories
    })
  })
})


//==========================register post method===================
router.post('/register', global.upload2, [
  check('name', "Name field is empty").notEmpty(),
  check('email', "Email is invalid").notEmpty().isEmail(),
  check('username', "username is empty").notEmpty().trim(),
  check('password', "Password field is empty").notEmpty(),
  check('password', "Password must contain at least 6 characters").isLength({min: 6}),
  check('password2', "Password did not match").notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.mapped())
    res.render('register',{
      title: "Register",
      errors: errors.mapped()
    })
    return;
  }

  //store info
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;

  //image
  let profileImageName;
  let profileImageOriginalName;
  let profileImagePath;
  let profileImageMime;
  let profileImageExt;
  let profileImageSize;
  // checking the image
  if(!req.file){
    profileImageName = "profile_image-no-image.png"
  }else{
    profileImageName = req.file.filename;
    profileImageOriginalName = req.file.originalname;
    profileImagePath = req.file.path;
    profileImageExt = req.file.extname;
    profileImageMime = req.file.mimetype;
    profileImageSize = req.file.size;
  }

  console.log(req.file);

  //database work
  // encrypt the password
  // let encryptedPassword = '';
  User.encryptPassword(password, (err, encPass) => {
    if(err) {
      console.log('error') 
    }
    else{
      // store in database with monk
      let members = db.get('members')
      members.insert({
        "name": name,
        "email": email,
        "username": username,
        "password": encPass,
        "profile_image": profileImageName,
        "posts": []
      }, (err, member) => {
        if(err){
          console.log('There are some problem in server. Sorry, we will fix it soon')
        }
        else{
          req.flash('success', "Registered! You're now a member of Gap Guys Blog. Please login.")
          res.location('/members/login')
          res.redirect('/members/login')
        }
      });
    }
  })
  
})

passport.serializeUser((user, done) => {
  done(null, user._id)
});

passport.deserializeUser((_id, done) => {
  User.findUserById(_id, (err, user) => {
    done(err, user)
  })
})

// passport strategy
passport.use(new localStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
  User.findUserByUsername(username, (err, user) => {
    if(err){ return done(err) }
    // if(user.length === 0){
    if(!user){
      console.log('Invalid Username')
      return done(null, false, {message: "Invalid username"})
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) { return done(err) }
      if(!isMatch){
        console.log('Incorrect password')
        return done(null, false, {message: "Incorrect password"})
      }
      usernameGlobal = user.username;
      console.log('successfully logged in')
      return done(null, user)
    })
  })
}
))


//=====================login post method===================
router.post('/login', passport.authenticate('local', {failureFlash: "Invalid username or password", failureRedirect: "/members/login"}),
(req, res) => {
  req.flash('success', "You've logged in successfully");
  res.location('/members')
  res.redirect('/members');
})

//===================log out method======================
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', "You've successfully logged out")
  res.redirect('/');
})




//==================Add post (post method)=================
router.post('/add_post', global.upload,[
  check('author', "Author name is required").notEmpty(),
  check('post_title', "Title of your post is required").notEmpty(),
  check('category', "Please select a category").notEmpty(),
  check('description', "Description about your post is required").notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.mapped());
    res.render('add_post', {
      title: "Add Post",
      errors: errors.mapped(),
    })
    return; 
  } 
  //info
  let author = req.body.author;
  let title = req.body.post_title;
  let category = req.body.category;
  let description = req.body.description;
  let date = new Date()
  
  //image
  let contentImageName;
  let contentImageOriginalName;
  let contentImagePath;
  let contentImageMime;
  let contentImageExt;
  let contentImageSize;
  // checking the image
  if(!req.file){
    contentImageName = "no-image.png"
    // console.log(contentImageName)
  }else{
    contentImageName = req.file.filename;
    contentImageOriginalName = req.file.originalname;
    contentImagePath = req.file.path;
    contentImageExt = req.file.extname;
    contentImageMime = req.file.mimetype;
    contentImageSize = req.file.size;
  }

  console.log(req.file);

  //database work
  let posts = db.get('posts');
  posts.insert({
    "username": usernameGlobal,
    "author": author,
    "title": title,
    "category": category,
    "description": description,
    'content_image': contentImageName,
    "date": date
  }, (err, post) => {
    if(err){
      console.log('Submitting issue');
    }
    else{
      req.flash('success', "Your post is submitted succesfully");
      res.location('/');
      res.redirect('/');
    }
  });

})


//=====================add category====================
router.post('/add_category', [
  check("title", "Field should not be empty").notEmpty(),
],
(req, res) => {
  const errors = validationResult(req);

  categories.find({}, {}, (err, categories) => {
    cat = categories
  });
  if(!errors.isEmpty()){
    res.render('add_category', {
      title: "Add Category",
      user: req.user,
      errors: errors.mapped(),
      categories: cat
    })
  }else{
    //store in datebase
    categories.insert({
      title: req.body.title.charAt(0).toUpperCase() + req.body.title.slice(1)
    }, (err, categories) => {
      if(err)
      {
        req.flash('erros', "There some submitting issues. Sorry, we\'ll fix it soon")
      }
      else{
        console.log('Category added successfully')
        req.flash('success', "Category added successfully")
        res.redirect('/members/add_category');
      }
    })
  }
})



//=================Members Area========================


module.exports = router;
