const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');
const Comment = require('./commentModel');

const postSchema = new Schema({
  title: {type: String, required: true},
  problem: {type: String, required: true},
  pitch: {type: String, required: true},
  edits: {type: [String], default: []},
  author: {type: Schema.Types.ObjectId, required: true},
  dateCreated: {type: Date, default: Date.now()},
  tags: {type: [String], default: []},
  comments: {type: [Schema.Types.ObjectId], default: []},
  votes: {type: Number, default: 0},
  voters: {type: [Schema.Types.ObjectId], default: []}
});

//premethods

//On save, add Id to user
postSchema.pre('save', async function(next){
  let user = await User.findById(this.author);
  let newUserPosts = await user.posts;
  newUserPosts.push(this._id);
  await User.findByIdAndUpdate(
    this.author,
    {posts: newUserPosts},
    {useFindAndModify: false}
  );
  next();
});

//instance.methodName
postSchema.methods = {

  voteUpdateData: function(voterId){

    voterId = mongoose.Types.ObjectId(voterId);
    let voting = true;
    let newVoters = [];

    for(let i = 0; i<this.voters.length; i++){
      let v = this.voters[i];

      if(voterId.equals(v)){
        voting = false;
      }
      else {
        newVoters.push(v);
      }
    }

    if(!voting){

      return{
        votes: this.votes - 1,
        voters: newVoters
      }

    }
    else{

      newVoters.push(voterId);
      return {
          votes: this.votes + 1,
          voters: newVoters
      }

    }
  },

//get author model
  getAuthor: async function() {
    author = await User.findById(this.author)
      .then(author => {
        return author;
      })
      .catch(err => {
        console.log(err);
      })
    return author
  },

//get comment objects
  getComments: function() {
    console.log('here')

    const recHelper = function(commentIds, currentDepth, maxDepth){
      if(commentIds.length == 0) { return [];}
      if(currentDepth == maxDepth) {
          let comments = [];
          for(i in commentIds){
            Comment.findById(commentIds[i])
              .then(comment => {
                comments.push(comment.toObject());
              })
          }
          return comments;
      }
      let comments = [];
      for(i in commentIds){
        Comment.findById(commentIds[i])
          .then(async c => {
            c = c.toObject();
            c.comments = await recHelper(c.comments, currentDepth+1, maxDepth);
            comments.push(c);
          })
      }
      return comments;
    }

    return recHelper(this.comments, 0, 3)
  }

}

//Post.staticName
postSchema.statics = {

};

module.exports = mongoose.model('Post', postSchema);
