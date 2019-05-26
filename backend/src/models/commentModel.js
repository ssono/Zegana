const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: {type: Schema.Types.ObjectId, required: true},
  content: {type: String, required: true},
  votes: {type: Number, default:0},
  replies: {type: [Schema.Types.ObjectId], default: []},
  parentComment: Schema.Types.ObjectId,
  parentPost: {type: Schema.Types.ObjectId, required:true},
  dateCreated: {type: Date, default: Date.now()}
});

//call with instance.methodName
commentSchema.methods = {

};

//call with Model.methodName
commentSchema.statics = {

};

module.exports = mongoose.model('Comment', commentSchema);
