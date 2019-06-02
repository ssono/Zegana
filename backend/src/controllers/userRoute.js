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
      res.status(500).send("error while hashing");
    });

  let newUser = User(data);
  newUser.save()
    .then(user => {
      if (!user || user.length === 0) {
        return res.status(500).send(user);
      }
      res.status(201).json(user);
    })
    .catch(err => {
      if (err.code == 11000) {
        let availability = {
          email: err.errmsg.includes('email') ? false : true,
          username: err.errmsg.includes('username') ? false : true          
        }
        res.status(409).json(availability);

      } else {
        res.status(500).json(err);
      }
    })
});

//Login
router.post('/users/login', async function(req,res){

 
  let user = await User.findOne({email: req.body.email})
    .catch(err => {
      res.status(404).send("No user with that email");
    });
  
  let passwordMatch = await bcrypt.compare(req.body.password, user.password)
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })

  if(!passwordMatch){
    res.status(401).send("Passwords don't match");
  } else {
    res.status(200).json(user);
  }  
});

// Get all Users
router.get('/users', function (req, res) {
  User.find().limit(100)
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//Get specific user by Id
router.get('/users/:ObjectId', function (req, res) {
  User.findById(req.params.ObjectId)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//Update specific user by Id
router.put('/users/:ObjectId', function (req, res) {
  User.findByIdAndUpdate(req.params.ObjectId, req.body, { new: true })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//Delete specific user by Id
router.delete('/users/:ObjectId', function (req, res) {
  User.findByIdAndDelete(req.params.ObjectId, {})
    .then(() => {
      res.status(202).send("successfully deleted");
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//Get comments
router.get('/users/:ObjectId/comments', function (req, res) {
  Comment.find({ author: req.params.ObjectId })
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

//get posts
router.get('/users/:ObjectId/posts', function (req, res) {
  Post.find({ author: req.params.ObjectId })
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

//get saved posts
router.get('/users/:ObjectId/saved', async function (req, res) {
  let user = await User.findById(req.params.ObjectId)
    .catch(err => {
      console.log(err);
    });

  let posts = [];

  for (let i = 0; i < user.savedPosts.length; i += 1) {
    let post = await Post.findById(user.savedPosts[i])
      .catch(err => {
        console.log(err);
      })
    posts.push(post);
  }

  res.status(200).json(posts);
});

module.exports = router;
