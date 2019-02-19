var JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require("passport-jwt").ExtractJwt;
//const mongoose = require("mongoose");
//const User = mongoose.model('users');
const keys = require('../config/keys');

const passport = require("passport");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret-key";
//opts.ignoreExpiration = true;

console.log(opts);

module.exports = () => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("payload", jwt_payload);
    done(null, true)
  }));
}

// module.exports = (passport) => {
//   console.log(123);

//   passport.use(
//     new JwtStrategy(opts, (jwt_payload, done) =>{
//       console.log("payload", jwt_payload)
//       // User.findById(jwt_payload._id)
//       // .then(user=>{
//       //   if(user){
//       //     return done(null, user);
//       //   }
//       //   return done(null, false);
//       // })
//       // .catch(err => console.log(err))
//     })
//   )
// }