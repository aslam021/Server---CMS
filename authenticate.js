const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('./config');
const User = require('./models/user');

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

        User.findOne({
            where: {
              username: jwt_payload._id
            }
          })
        .then(user => {
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
        .catch(err => {
            return done(err, false);
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});