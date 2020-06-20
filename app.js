var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport   = require('passport')
const bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var create_tables = require('./database/create_tables');
const test = require('./routes/test');
const conference = require('./routes/conference');
const coupens = require('./routes/coupon_codes');
const tickets = require('./routes/tickets');
const userData = require('./routes/userdata');
const allData = require('./routes/alldata');
const uploadFile = require('./routes/uploadRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

// uncomment following line to create tables
// create_tables.createAllTables();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', test);
app.use('/conference', conference);
app.use('/coupens', coupens);
app.use('/tickets', tickets);
app.use('/userdata', userData);
app.use('/alldata', allData);
app.use('/uploadfile', uploadFile);

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