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
router.post('/posts', function (req, res) {

  if (!req.body || (Object.entries(req.body).length === 0 && req.body.constructor === Object)) {
    return res.status(400).send("body is missing")
  }

  let newPost = req.body;
  newPost.dateCreated = Date.now();
  newPost = Post(newPost);
  
  newPost.save()
    .then(post => {
      if (!post || post.length === 0) {
        return res.status(500).send(post)
      }
      return res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    })

});

//get new posts
router.get('/posts/new/:page/:userId*?', function (req, res) {
  let options = {};
  if (req.params.userId) {
    options.author = req.params.userId;
  }

  Post.find(options)
    .sort({dateCreated: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) -1 ))
    .then(posts => {
      return res.status(200).json(posts);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//get topDay posts
router.get('/posts/topDay/:page/:userId*?', function (req, res) {
  const dayAgo = Date.now() - 1000*60*60*24
  let options = { dateCreated : { $gte: dayAgo }};
  if (req.params.userId) {
    options.author = req.params.userId;
  }


  Post.find(options)
    .sort({votes: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) -1 ))
    .then(posts => {
      return res.status(200).json(posts);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//get topWeek posts
router.get('/posts/topWeek/:page/:userId*?', function (req, res) {
  const weekAgo = Date.now() - 1000*60*60*24*7
  let options = { dateCreated : { $gte: weekAgo }};
  if (req.params.userId) {
    options.author = req.params.userId;
  }

  Post.find(options)
    .sort({votes: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) -1 ))
    .then(posts => {
      return res.status(200).json(posts);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//get topMonth posts
router.get('/posts/topMonth/:page/:userId*?', function (req, res) {
  const monthAgo = Date.now() - 1000*60*60*24*30
  let options = { dateCreated : { $gte: monthAgo }}
  if (req.params.userId) {
    options.author = req.params.userId;
  }

  Post.find(options)
    .sort({votes: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) -1 ))
    .then(posts => {
      return res.status(200).json(posts);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//get topYear posts
router.get('/posts/topYear/:page/:userId*?', function (req, res) {
  const yearAgo = Date.now() - 1000*60*60*24*365
  let options = { dateCreated : { $gte: yearAgo }};
  if (req.params.userId) {
    options.author = req.params.userId;
  }

  Post.find(options)
    .sort({votes: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) -1 ))
    .then(posts => {
      return res.status(200).json(posts);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//get top all time posts
router.get('/posts/top/:page/:userId*?', function (req, res) {
  let options = {};
  if (req.params.userId) {
    options.author = req.params.userId;
  }

  Post.find(options)
    .sort({votes: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) -1 ))
    .then(posts => {
      return res.status(200).json(posts);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//get lastUpdated posts
router.get('/posts/active/:page/:userId*?', function (req, res) {
  let options = {};
  if (req.params.userId) {
    options.author = userId;
  }
  Post.find(options)
    .sort({lastUpdated: -1})
    .limit(25)
    .skip(25 * (parseInt(req.params.page) -1 ))
    .then(posts => {
      return res.status(200).json(posts);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});


//get specific post by ID
router.get('/posts/:ObjectId', function (req, res) {
  Post.findById(req.params.ObjectId)
    .then(async post => {
      return res.status(200).json(post);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//Update specific post by ID
router.put('/posts/:ObjectId', function (req, res) {
  Post.findByIdAndUpdate(req.params.ObjectId, req.body, { new: true })
    .then(post => {
      return res.status(200).json(post);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//Delete object by Id
router.delete('/posts/:ObjectId', function (req, res) {

  Post.findByIdAndDelete(req.params.ObjectId, {})
    .then(() => {
      return res.status(202).json({message: "successfully deleted"});
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//toggleVote
router.get('/posts/:ObjectId/vote/:voterId', function (req, res) {
  let voterId = req.params.voterId;

  //get the post to be changed
  Post.findById(req.params.ObjectId)
    .then(async post => {

      //get the update data for new votes and voters
      let data = await post.voteUpdateData(voterId);
      data.lastUpdated = Date.now();
      Post.findByIdAndUpdate(req.params.ObjectId, data, { new: true })
        .then(post => {
          return res.status(200).json(post);
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
router.get('/posts/:ObjectId/author', async function (req, res) {
  let post = await Post.findById(req.params.ObjectId)
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    });

  await User.findById(post.author)
    .then(author => {
      return res.status(200).json(author);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
});

//get voter instances
router.get('/posts/:ObjectId/voters', async function (req, res) {
  let post = await Post.findById(req.params.ObjectId)
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    });

  let voters = [];

  for (let i = 0; i < post.voters.length; i += 1) {
    let voter = await User.findById(post.voters[i])
      .catch(err => {
        console.log(err);
        return res.status(500).json(err);
      })
    voters.push(voter);
  }

  return res.status(200).json(voters);
});

//get immediate children comment instances sorted best
router.get('/posts/:ObjectId/comments', function (req, res) {
  Comment.find({ parentPost: req.params.ObjectId, parentComment: null }).sort({votes: -1})
    .then(comments => {
      return res.status(200).json(comments);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    })
});

//get immediate children comment instances sorted new
router.get('/posts/:ObjectId/comments/new', function (req, res) {
  Comment.find({ parentPost: req.params.ObjectId, parentComment: null }).sort({dateCreated: -1})
    .then(comments => {
      return res.status(200).json(comments);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    })
});

//save post
router.get('/posts/:ObjectId/save/:usrId', async function (req, res) {
  const usrId = req.params.usrId;
  const objectId = req.params.ObjectId;  

  let post = await Post.findById(objectId)
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    })

  let user = await User.findById(usrId)
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    })

  if(post.savers.includes(usrId)){

    let newSavers = post.savers.reduce(function(acc, val){
      if(!(val == usrId)){ acc.push(val) };
      return acc;
    }, []);

    let newSaved = user.savedPosts.reduce(function(acc, val){
      if(!(val == objectId)){ acc.push(val) };
      return acc;
    }, []);


    User.findByIdAndUpdate(
        user._id,
        { savedPosts: newSaved },
        { useFindAndModify: false }
      ).catch(err => {
        return res.status(500).json(err);
      })

    const updatedPost = await Post.findByIdAndUpdate(
      objectId,
      { savers: newSavers, lastUpdated: Date.now() },
      { useFindAndModify: false, new: true }
    ).catch(err => {
      return res.status(500).json(err);
    })

    return res.status(200).json(updatedPost);

  } else {
    let newSavers = post.savers;
    newSavers.push(usrId);
    let newSaved = user.savedPosts;
    newSaved.push(objectId);

    User.findByIdAndUpdate(
      user._id,
      { savedPosts: newSaved },
      { useFindAndModify: false }
    ).catch(err => {
      return res.status(500).json(err);
    })

    const updatedPost = await Post.findByIdAndUpdate(
      objectId,
      { savers: newSavers, lastUpdated: Date.now() },
      { useFindAndModify: false, new: true }
    ).catch(err => {
      return res.status(500).json(err);
    })
    
    return res.status(200).json(updatedPost);
  }
  
});


module.exports = router;
