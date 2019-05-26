const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {type: String, required: true},
  problem: {type: String, required: true},
  pitch: {type: String, required: true},
  edits: {type: [String], default: []},
  author: {type: Schema.Types.ObjectId, required: true},
  dateCreated: {type: Date, default: Date.now()},
  tags: {type: [String], default: []},
  comments: {type: [Schema.Types.ObjectId], default: []},
  votes: {type: Number, default: 0}
});

//instance.methodName
postSchema.methods = {

};

//Post.staticName
postSchema.statics = {

};

module.exports = mongoose.model('Post', postSchema);
