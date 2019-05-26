const mongoose = require('mongoose');
const User = require('../models/userModel');
const express = require('express');
const router = express.Router();

// TODO implement routes
// router.method('/path', function(req, res){
//
// });

//Create a new User
router.post('/users', function(req, res){
  if(!req.body) {
    return res.status(400).send("Body is missing");
  }

  let newUser = User(req.body);
  newUser.save()
    .then(user => {
      if(!user || user.length === 0) {
        return res.status(500).send(user);
      }
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

// Get all Users
router.get('/users', function(req, res){
  User.find().limit(100)
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//Get specific user by Id
router.get('/users/:ObjectId', function(req, res){
  User.findById(req.params.ObjectId)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//Update specific user by Id
router.put('/users/:ObjectId', function(req, res){
  User.findByIdAndUpdate(req.params.ObjectId, req.body, {new: true, useFindAndModify: false})
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

//Delete specific user by Id
router.delete('/users/:ObjectId', function(req, res){
  User.findByIdAndDelete(req.params.ObjectId, {useFindAndModify: false})
    .then(() => {
      res.status(202).send("successfully deleted");
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

module.exports = router;
