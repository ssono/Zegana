const mongoose = require('mongoose');
const Post = require('../models/postModel');
const express = require('express');
const router = express.Router();

// TODO implement routes
// router.method('/path', function(req, res){
//
// });

//create new Post
router.post('/posts', function(req, res){

  if(!req.body) {
    return res.status(400).send("body is missing")
  }

  let newPost = Post(req.body);
  newPost.save()
    .then( post => {
      if(!post || post.length === 0 ){
        return res.status(500).send(post)
      }
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json(err);
    })

});

//get all posts
router.get('/posts', function(req, res){
  Post.find().limit(10)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//get specific post by ID
router.get('/posts/:ObjectId', function(req, res){
  Post.findById(req.params.ObjectId)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//Update specific post by ID
router.put('/posts/:ObjectId', function(req, res){
  Post.findByIdAndUpdate(req.params.ObjectId, req.body, {new: true, useFindAndModify: false})
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//Delete object by Id
router.delete('/posts/:ObjectId', function(req, res){
  Post.findByIdAndDelete(req.params.ObjectId, {useFindAndModify: false})
    .then(() => {
      res.status(202).send("successfully deleted");
    })
    .catch(err => {
      res.status(500).json(err);
    })
})


module.exports = router;
