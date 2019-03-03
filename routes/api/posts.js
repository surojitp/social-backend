const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load Middleware authentication
const checkAuth = require('../../middlewere/chech-auth');

//Load user model
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//Post Input validation
const validatePostInput = require('../../validation/Post');

//@route POST api/posts
//@desc Create post
//@access Private

router.post('/', checkAuth, (req,res) =>{


  const {errors, isValid} = validatePostInput(req.body);
  console.log(isValid);
  
  //Check validation
  if(!isValid){
    
    return res.status(400).json(errors);
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });
  
  
  newPost.save().then(post => res.json(post));
});

//@route GET api/posts
//@desc Get posts
//@access Public

router.get('/', (req,res) =>{
  Post.find()
    .sort({ date: -1})
    .then(posts =>{
      res.json(posts);
    })
    .catch(err=>{
      res.status(404).json(err)
    })
});

//@route GET api/posts/:id
//@desc Get single post
//@access Public

router.get('/:id', (req,res) =>{
  Post.findById(req.params.id)
    .then(post =>{
      res.json(post);
    })
    .catch(err=>{
      res.status(404).json({err, noPost: "No post found with this id"})
    })
});

//@route DELETE api/posts/:id
//@desc Delete post
//@access Private

router.delete('/:id', checkAuth, (req,res) =>{
  Profile.findOne({ user: req.user.id})
  .then(profile => {
    Post.findById(req.params.id)
    .then(post => {
      //Check for post owner
      if(post.user.toString() !== req.user.id){
        return res.status(401).json({notauthorized: "user not authorized"})
      }

      //Delete
      Post.findByIdAndRemove(req.params.id).then(() => res.json({success: true}))
    })
    .catch(err => res.status(404).json({postnotfound: "No post found"}))
  })
}); 

//@route POST api/posts/like/:id
//@desc Like post
//@access Private

router.post('/like/:id', checkAuth, (req,res) =>{
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
      .then(post =>{
        console.log(post);
        
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
          return res.status(400).json({ alreadyliked: "user already liked this post"})
        }

        //Add user id to like array
        post.likes.unshift({ user: req.user.id})

        post.save().then(post => res.json(post))
      })
      .catch(err => res.status(404).json({err, postnotfound: "no post found"}))
    })
});

//@route POST api/posts/unlike/:id
//@desc Unlike post
//@access Private

router.post('/unlike/:id', checkAuth, (req,res) =>{
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
      .then(post =>{
        console.log(post);
        
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
          return res.status(400).json({ notlike: "You have not liked this post"})
        }

        //Get remove index
        const removeIndex = post.likes
                              .map(item => item.user.toString())
                              .indexOf(req.user.id)
        //Splice array
        post.likes.splice(removeIndex, 1)
        //save
        post.save().then(post => res.json(post))
      })
      .catch(err => res.status(404).json({err, postnotfound: "no post found"}))
    })
});
module.exports = router;

