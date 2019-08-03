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

// get saved new
router.get('/users/:ObjectId/saved/new/:page', async function (req, res) {
  const user = await User.findById(req.params.ObjectId)
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    })

  let options = {
    '_id': { $in: user.savedPosts}
    };

  const posts = Post.find(options)
    .sort({dateCreated: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) - 1))
    .then(posts => {
      return res.status(200).json(posts);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    })
});

// get saved topday
router.get('/users/:ObjectId/saved/topDay/:page', async function (req, res) {
  const user = await User.findById(req.params.ObjectId)
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    })

  const dayAgo = Date.now() - 1000*60*60*24;

  const options = {
    '_id': { $in: user.savedPosts},
    dateCreated: { $gte: dayAgo}
    };

  const posts = Post.find(options)
    .sort({votes: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) - 1))
    .then(posts => {
      return res.status(200).json(posts);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    })
});

// get saved topweek
router.get('/users/:ObjectId/saved/topWeek/:page', async function (req, res) {
  const user = await User.findById(req.params.ObjectId)
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    })

    const weekAgo = Date.now() - 1000*60*60*24*7;

    const options = {
      '_id': { $in: user.savedPosts},
      dateCreated: { $gte: weekAgo}
      };

  const posts = Post.find(options)
    .sort({votes: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) - 1))
    .then(posts => {
      return res.status(200).json(posts);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    })
});

// get saved topMonth
router.get('/users/:ObjectId/saved/topMonth/:page', async function (req, res) {
  const user = await User.findById(req.params.ObjectId)
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    })

    const monthAgo = Date.now() - 1000*60*60*24*30;

    const options = {
      '_id': { $in: user.savedPosts},
      dateCreated: { $gte: monthAgo}
      };

  const posts = Post.find(options)
    .sort({votes: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) - 1))
    .then(posts => {
      return res.status(200).json(posts);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    })
});

// get saved topYear
router.get('/users/:ObjectId/saved/topYear/:page', async function (req, res) {
  const user = await User.findById(req.params.ObjectId)
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    })

    const yearAgo = Date.now() - 1000*60*60*24*365;

    const options = {
      '_id': { $in: user.savedPosts},
      dateCreated: { $gte: yearAgo}
      };

  const posts = Post.find(options)
    .sort({votes: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) - 1))
    .then(posts => {
      return res.status(200).json(posts);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    })
});

// get saved top
router.get('/users/:ObjectId/saved/top/:page', async function (req, res) {
  const user = await User.findById(req.params.ObjectId)
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    })

  const options = {
    '_id': { $in: user.savedPosts}
    };

  const posts = Post.find(options)
    .sort({votes: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) - 1))
    .then(posts => {
      return res.status(200).json(posts);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    })
});

router.get('/users/:ObjectId/saved/active/:page', async function (req, res) {
  const user = await User.findById(req.params.ObjectId)
    .catch(err => {
      console.error(err);
      return res.status(500).json(err);
    })

  const options = {
    '_id': { $in: user.savedPosts}
    };

  const posts = Post.find(options)
    .sort({lastUpdated: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) - 1))
    .then(posts => {
      return res.status(200).json(posts);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    })
});



module.exports = router;
