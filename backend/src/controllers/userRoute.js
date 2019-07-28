const mongoose = require('mongoose');
const User = require('../models/userModel');
const express = require('express');
const router = express.Router();
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// TODO implement routes
// router.method('/path', function(req, res){
//
// });

//Create a new User
router.post('/users', async function (req, res) {
  if (!req.body || (Object.entries(req.body).length === 0 && req.body.constructor === Object)) {
    return res.status(400).send("Body is missing");
  }

  let data = req.body;

  data.password = await bcrypt.hash(data.password, saltRounds)
    .catch(err => {
      console.log(err);
      return res.status(500).send("error while hashing");
    });

  let newUser = User(data);
  newUser.save()
    .then(user => {
      if (!user || user.length === 0) {
        return res.status(500).send(user);
      }
      return res.status(201).json(user);
    })
    .catch(err => {
      if (err.code == 11000) {
        let availability = {
          email: err.errmsg.includes('email') ? false : true,
          username: err.errmsg.includes('username') ? false : true          
        }
        return res.status(409).json(availability);

      } else {
        return res.status(500).json(err);
      }
    })
});

//Login
router.post('/users/login', async function(req,res){
 
  let user = await User.find({email: req.body.email})
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    })

  if(user.length === 0){
    return res.status(404).send('User not found');
  }

  user = user[0];
  
  let passwordMatch = await bcrypt.compare(req.body.password, user.password)
    .catch(err => {
      console.log(err);
      return res.status(500).send(err);
    })

  if(!passwordMatch){
    return res.status(401).send("Passwords don't match");
  } else {
    return res.status(200).json(user);
  }  
});

// Get all Users
router.get('/users', function (req, res) {
  User.find().limit(100)
    .then(users => {
      return res.json(users);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//Get specific user by Id
router.get('/users/:ObjectId', function (req, res) {
  User.findById(req.params.ObjectId)
    .then(user => {
      return res.json(user);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//Update specific user by Id
router.put('/users/:ObjectId', function (req, res) {
  User.findByIdAndUpdate(req.params.ObjectId, req.body, { new: true })
    .then(user => {
      return res.json(user);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//Delete specific user by Id
router.delete('/users/:ObjectId', function (req, res) {
  User.findByIdAndDelete(req.params.ObjectId, {})
    .then(() => {
      return res.status(202).json({status: 202});
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//Get comments
router.get('/users/:ObjectId/comments', function (req, res) {
  Comment.find({ author: req.params.ObjectId })
    .then(comments => {
      return res.status(200).json(comments);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    })
});

//get posts
router.get('/users/:ObjectId/posts', function (req, res) {
  Post.find({ author: req.params.ObjectId })
    .then(posts => {
      return res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    })
});

//get saved posts
router.get('/users/:ObjectId/saved', async function (req, res) {
  let user = await User.findById(req.params.ObjectId)
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    });

  let posts = [];

  for (let i = 0; i < user.savedPosts.length; i += 1) {
    let post = await Post.findById(user.savedPosts[i])
      .catch(err => {
        console.log(err);
        return res.status(500).json(err);
      })
    posts.push(post);
  }

  return res.status(200).json(posts);
});

module.exports = router;
