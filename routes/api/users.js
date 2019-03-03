const express = require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const key = require("../../config/keys");
const passport = require("passport");

//Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login'); 

//Load Middleware authentication
const checkAuth = require('../../middlewere/chech-auth');

//require('../../config/passport')(passport) // as strategy in ./passport.js needs passport object

//Load user model
const User = require("../../models/User");

//@route GET api/users/test
//@desc Test user route
//@access public
router.get('/test', (req, res) => {
  res.send("working")
});

//@route GET api/users/register
//@desc Register User
//@access public
router.post('/register', (req, res) => {

  const {errors, isValid} = validateRegisterInput(req.body);

  //Check validation
  if(!isValid){
    return res.status(400).json(errors);
  }
  
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      errors.email = "Email already exist";
      if (user) {
        return res.status(400).json(errors)
      } else {
        const avatar = gravatar.url({
          s: '200', //Size
          r: 'pg', //Rating
          d: 'mm' //Default
        })
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          })
        })
      }
    })
});

//@route GET api/users/login
//@desc Login User / Returning JSW token
//@access public
router.post('/login', (req, res) => {
  //res.send(req.body)
  const {errors, isValid} = validateLoginInput(req.body);
  //return console.log(isValid);
  
  //Check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
      email
    })
    .then(user => {
            
      
      //Check for user
      if (!user) {
        errors.email = "User not found !!";
        return res.status(400).json(errors);
      }
      else{
      //Check for Password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            //User matched

            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }
            console.log(payload);

            //Sign token
            jwt.sign(payload, key.jwtKEY, {
              expiresIn: '48h'
            }, (err, token) => {
              res.json({
                success: true,
                token: 'bearer ' + token
              })
            })

          } else {
            errors.password = "passrord incorrect !!"
            return res.status(400).json(errors)
          }
        })

      }
    })
});

//@route GET api/users/current
//@desc Return current user
//@access Private


router.get('/current', /*passport.authenticate('jwt', { session: false }),*/ checkAuth, (req, res) => {
  // console.log("header",req.headers);
  // const token = req.headers.authorization.split(" ")[1];
  // const decoded = jwt.verify(token,key.jwtKEY);
  // console.log("decode---", decoded);
  console.log(req.user);
  

  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
})


module.exports = router;