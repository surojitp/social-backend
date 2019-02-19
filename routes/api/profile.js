const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load Middleware authentication
const checkAuth = require('../../middlewere/chech-auth');

//Load user model
const User = require("../../models/User");
const Profile = require("../../models/Profile");

//Profile Input validation
const validateProfileInput = require('../../validation/profile');


//@route GET api/profile
//@desc Return current user
//@access Private


router.get('/', checkAuth, (req, res) => {
  const errors = {};
  Profile.findOne({
      user: req.user.id
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(400).json(errors)
      }
      res.json(profile)


    })
});

//@route POST api/profile
//@desc Return current user
//@access Private


router.post('/', checkAuth, (req, res) => {
  const {
    errors,
    isValid
  } = validateProfileInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  //Get fields
  const profileFields = {}
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.bio) profileFields.bio = req.body.bio;
  //Skills Split into array
  if (req.body.skills) {
    profileFields.skills = req.body.skills.split(",");
  }
  //Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;



  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (profile) {
        Profile.findOneAndUpdate({
            user: req.user.id
          }, {
            $set: profileFields
          }, {
            new: true
          })
          .then(profile => {
            res.json(profile)
          })
      } else {
        //Create

        //Check if handle exist
        Profile.findOne({
            handle: profileFields.handle
          })
          .populate('user', ['name', 'avatar'])
          .then(profile => {
            if (profile) {
              errors.handle = "That handle already exist";
              return res.status(400).json(errors)
            }

            //Save profile
            new Profile(profileFields).save()
              .then(profile => {
                res.json(profile)
              })

          })


      }


    })
});

module.exports = router;