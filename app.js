var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const mongo = require('mongodb');
const db = require('monk')('mongodb+srv://tahmid:526628Tahmid@test1.mbzeo.mongodb.net/gapguysblog?retryWrites=true&w=majority');
const multer = require('multer');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var membersRouter = require('./routes/members');
const categoryRouter = require('./routes/category');
const { text } = require('body-parser');

var app = express();

app.locals.moment = require('moment'); // for globally use throughout the app
app.locals.truncateText = (text, length) => {
  let truncatedText = text.substring(0, length);
  return truncatedText;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//multer is always under the view engine
// app.use(multer({dest: './public/images/uploads/'}).any())

//session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

//passport
app.use(passport.initialize());
app.use(passport.session());

//flash and message
app.use(flash())
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//make our database accessible to any route
app.use((req, res, next) => {
  req.db = db
  next()
})

// we can also use the following instead of passing object to layout.jade
// to confirming the user is logged in or not
app.get('*', (req, res, next) => {
  res.locals.user = req.user || null
  next()
})

app.get('*', (req, res, next) => {
  let categories = db.get('categories');
  categories.find({}, {}, (err, categories) => {
    res.locals.categories = categories
  })

  next();
})


app.use('/', indexRouter);
app.use('/members', membersRouter);
app.use('/category', categoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
