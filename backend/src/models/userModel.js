const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true},
  email: {type: String, required: true},
  hashedPass: {type: String, required: true},
  votes: {type: Number, default: 0},
  friends: {type: [Schema.Types.ObjectId], default: []},
  posts: {type: [Schema.Types.ObjectId], default: []},
  comments: {type: [Schema.Types.ObjectId], default: []},
  upvotedComments: {type: [Schema.Types.ObjectId], default: []},
  upvotedPosts: {type: [Schema.Types.ObjectId], default: []},
  savedPosts: {type: [Schema.Types.ObjectId], default: []},
});

//instance.method()
userSchema.methods = {

}

//User.static()
userSchema.statics = {

}

module.exports = mongoose.model('User', userSchema);
