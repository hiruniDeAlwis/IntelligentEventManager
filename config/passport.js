const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const database = require ('../databaseHandle/connectDatabase');
const config = require('../config/jwt');

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts,function(jwt_payload, done){
        //console.log(jwt_payload);
        database.selectUser(jwt_payload.username,function(err,user){
            if(err){
                return done(err,false)
            }
            if(user){
                //console.log(user);
                return done(null,user[0]);
            }
            else{
                return done(null,false);
            }
        });
    }));
}