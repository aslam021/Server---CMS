const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('./config');
const db = require('./database/db');
const { NotExtended } = require('http-errors');

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //extract json web token from req header
opts.secretOrKey = config.secretKey;

//json web token passport strategy
passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => { //done is a callback provided by passport. it will be used to load information to request message
      console.log("JWT payload: ", jwt_payload);

      const query = "SELECT * FROM users WHERE email = '" + jwt_payload._email + "' LIMIT 1";

      db.pool.getConnection((err, connection) => {

        if (err) {
          // not connected!
          return done(err, false);
        } 
        else {
          // Use the connection
          connection.query(query, (error, results, fields) => {
    
            // When done with the connection, release it.
            try {
              connection.release();
            } catch(err) {
              console.log(err);
              throw err;
            }

            //query execution error
            if (error) {
              return done(error, false);
            }
            //if any result is retrieved
            else if(results.length > 0){
              return done(null, results[0]);
            }

            //no results found
            return done(null, false);
          });
        }
      })
  }
));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.varifyAdmin = (req, res, next) => {

  const query = `SELECT name FROM roles WHERE id = (SELECT role_id FROM role_user WHERE user_id ='${req.user.id}' LIMIT 1)`;

  db.read(query, req, res, (result)=>{
    if(result[0].name === 'Admin'){
      next();
    } else {
      var err = new Error("You are not an admin to perform this operation!");
      err.status = 403;
      return next(err);
    }
  });
};

exports.varifyReviewer = (req, res, next) => {

  const query = `SELECT name FROM roles WHERE id = (SELECT role_id FROM role_user WHERE user_id ='${req.user.id}' LIMIT 1)`;

  db.read(query, req, res, (result)=>{
    if(result[0].name === 'Reviewer'){
      next();
    } else {
      var err = new Error("You are not a reviewer to perform this operation!");
      err.status = 403;
      return next(err);
    }
  });
};

exports.varifySuperAdmin = (req, res, next) => {

  const query = `SELECT name FROM roles WHERE id = (SELECT role_id FROM role_user WHERE user_id ='${req.user.id}' LIMIT 1)`;

  db.read(query, req, res, (result)=>{
    if(result[0].name === 'SuperAdmin'){
      next();
    } else {
      var err = new Error("You are not a super admin to perform this operation!");
      err.status = 403;
      return next(err);
    }
  });
};

exports.isAdmin = () =>{
  const query = `SELECT name FROM roles WHERE id = (SELECT role_id FROM role_user WHERE user_id ='${req.user.id}' LIMIT 1)`;

  db.read(query, req, res, (result)=>{
    if(result[0].name === 'Admin'){
      return true;
    }
    return false;
  }); 
}