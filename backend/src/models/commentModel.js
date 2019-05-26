const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');
const Post = require('./postModel');

const commentSchema = new Schema({
  author: {type: Schema.Types.ObjectId},
  content: {type: String, required: true},
  votes: {type: Number, default:0},
  replies: {type: [Schema.Types.ObjectId], default: []},
  parentComment: Schema.Types.ObjectId,
  parentPost: {type: Schema.Types.ObjectId, required:true},
  dateCreated: {type: Date, default: Date.now()},
  voters: {type: [Schema.Types.ObjectId], default: []},
  deleted: {type: Boolean, default: false}
});

//premethods

//On save assign to post and user
commentSchema.pre('save', async function(next){

  let user = await User.findById(this.author);
  let newUserComments = await user.comments;
  newUserComments.push(this._id);
  await User.findByIdAndUpdate(
    this.author,
    {comments: newUserComments},
    {useFindAndModify: false}
  );

  let parPost = await Post.findById(this.parentPost);
  let newPostComments = await parPost.comments;
  newPostComments.push(this._id);
  await Post.findByIdAndUpdate(
    this.parentPost,
    {comments: newPostComments},
    {useFindAndModify: false}
  );
  next();
})


//call with instance.methodName
commentSchema.methods = {

};

//call with Model.methodName
commentSchema.statics = {

};

module.exports = mongoose.model('Comment', commentSchema);
