const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Post = require('../models/postModel');

// TODO implement routes
// router.method('/path', function(req, res){
//
// });

//create new comment
router.post('/comments', function(req, res) {
  if(!req.body || (Object.entries(req.body).length === 0 && req.body.constructor === Object)){
    return res.status(400).send("body is missing");
  }

  let newComment = req.body;
  newComment.dateCreated = Date.now();
  newComment = Comment(newComment);
  
  newComment.save()
    .then(async comment => {
      if(!comment || comment.length === 0){
        return res.status(500).json(comment);
      }

      return res.status(201).json(comment);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    })
});

//get all comments
router.get('/comments', function(req, res) {
  Comment.find().limit(100)
    .then(comments => {
      return res.status(200).json(comments);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//get comment by Id
router.get('/comments/:ObjectId', function(req, res){
  Comment.findById(req.params.ObjectId)
    .then(comment => {
      return res.status(200).json(comment);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
})

//update comment by id
router.put('/comments/:ObjectId', function(req, res){
  Comment.findByIdAndUpdate(req.params.ObjectId, req.body, {new: true})
    .then(comment =>{
      return res.status(200).json(comment);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//delete comment by id
router.delete('/comments/:ObjectId', function(req, res){
  Comment.findByIdAndUpdate(
    req.params.ObjectId,
    {deleted: true, votes: 0, voters: [], author: null, content: null},
    {useFindAndModify: false})
    .then(() =>{
      return res.status(202).send("successfully deleted");
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//toggleVote
router.get('/comments/:ObjectId/vote/:voterId', function(req, res){
  let voterId = req.params.voterId;

  //get the post to be changes
  Comment.findById(req.params.ObjectId)
    .then(async comment => {

      //get the update data for new votes and voters
      let data = await comment.voteUpdateData(voterId);
      data.lastUpdated = Date.now();
      Comment.findByIdAndUpdate(req.params.ObjectId, data, {new: true})
        .then(comment => {
          return res.status(200).json(comment);
        })
        .catch(err => {
          console.log(err);
          return res.status(500).json(err);
        })

    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    })
});

//get author instance
router.get('/comments/:ObjectId/author', async function(req, res){
  let comment = await Comment.findById(req.params.ObjectId)
    .catch(err => {
      console.log(err);
    });

  await User.findById(comment.author)
    .then(author => {
      return res.status(200).json(author);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//get parent post instance
router.get('/comments/:ObjectId/ppost', async function(req, res){
  let comment = await Comment.findById(req.params.ObjectId)
    .catch(err => {
      console.log(err);
    });

  await Post.findById(comment.parentPost)
    .then(post => {
      return res.status(200).json(post);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//get parentComment instance
router.get('/comments/:ObjectId/pcomment', async function(req, res){
  let comment = await Comment.findById(req.params.ObjectId)
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    });

  if(!comment.parentComment){ return res.status(404).send('This comment is an orphan')}

  await Comment.findById(comment.parentComment)
    .then(comment => {
      return res.status(200).json(comment);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//get replies
router.get('/comments/:ObjectId/replies', function(req, res) {
  Comment.find({parentComment: req.params.ObjectId})
    .then(comments => {
      return res.status(200).json(comments);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    })
});

//get voter instances
router.get('/comments/:ObjectId/voters', async function(req, res){
  let comment = await Comment.findById(req.params.ObjectId)
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    });

  let voters = [];

  for(let i = 0; i<comment.voters.length;i+=1){
    let voter = await User.findById(comment.voters[i])
      .catch(err => {
        console.log(err);
        return res.status(500).json(err);
      })
    voters.push(voter);
  }

  return res.status(200).json(voters);
});

module.exports = router;
