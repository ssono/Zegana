const mongoose = require('mongoose');
const Post = require('../models/postModel');
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

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
      console.log(err);
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
    .then(async post =>{
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
  Post.findById(req.params.ObjectId, {useFindAndModify: false})
    .then(post => {
      post.cleanup();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    })

  Post.findByIdAndDelete(req.params.ObjectId, {useFindAndModify: false})
    .then(() => {
      res.status(202).send("successfully deleted");
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//toggleVote
router.get('/posts/:ObjectId/vote/:voterId', function(req, res){
  let voterId = req.params.voterId;

  //get the post to be changes
  Post.findById(req.params.ObjectId)
    .then(async post => {

      //get the update data for new votes and voters
      let data = await post.voteUpdateData(voterId);
      Post.findByIdAndUpdate(req.params.ObjectId, data, {new: true, useFindAndModify: false})
        .then(post => {
          res.status(200).json(post);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        })

    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

//get author instance
router.get('/posts/:ObjectId/author', async function(req, res){
  let post = await Post.findById(req.params.ObjectId)
    .catch(err => {
      console.log(err);
    });

  await User.findById(post.author)
    .then(author => {
      res.status(200).json(author);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//get voter instances
router.get('/posts/:ObjectId/voters', async function(req, res){
  let post = await Post.findById(req.params.ObjectId)
    .catch(err => {
      console.log(err);
    });

  let voters = [];

  for(let i = 0; i<post.voters.length;i+=1){
    let voter = await User.findById(post.voters[i])
      .catch(err => {
        console.log(err);
      })
    voters.push(voter);
  }

  res.status(200).json(voters);
})

//get comment instances
router.get('/posts/:ObjectId/comments', function(req, res) {
  Comment.find({parentPost: req.params.ObjectId, parentComment:undefined})
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});


module.exports = router;
