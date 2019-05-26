const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const express = require('express');
const router = express.Router();

// TODO implement routes
// router.method('/path', function(req, res){
//
// });

//create new comment
router.post('/comments', function(req, res) {
  if(!req.body){
    res.status(400).send("body is missing");
  }

  let newComment = Comment(req.body);
  newComment.save()
    .then(comment => {
      if(!comment || comment.length === 0){
        res.status(500).json(comment);
      }
      res.status(201).json(comment);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//get all comments
router.get('/comments', function(req, res) {
  Comment.find().limit(100)
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//get comment by Id
router.get('/comments/:ObjectId', function(req, res){
  Comment.findById(req.params.ObjectId)
    .then(comment => {
      res.status(200).json(comment);
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

//update comment by id
router.put('/comments/:ObjectId', function(req, res){
  Comment.findByIdAndUpdate(req.params.ObjectId, req.body, {new: true, useFindAndModify: false})
    .then(comment =>{
      res.status(200).json(comment);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//delete comment by id
router.delete('/comments/:ObjectId', function(req, res){
  Comment.findByIdAndDelete(req.params.ObjectId, {useFindAndModify: false})
    .then(() =>{
      res.status(202).send("successfully deleted");
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

module.exports = router;
