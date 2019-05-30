const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');
const Post = require('./postModel');

const commentSchema = new Schema({
  author: {type: Schema.Types.ObjectId},
  content: {type: String, required: true},
  votes: {type: Number, default:0},
  parentComment: Schema.Types.ObjectId,
  parentPost: {type: Schema.Types.ObjectId, required:true},
  dateCreated: {type: Number, default: Date.now()},
  voters: {type: [Schema.Types.ObjectId], default: []},
  deleted: {type: Boolean, default: false}
});

commentSchema.index({dateCreated: -1});
commentSchema.index({votes: -1});

//premethods

//call with instance.methodName
commentSchema.methods = {

  voteUpdateData: async function(voterId){

    voterId = mongoose.Types.ObjectId(voterId);
    let voting = true;
    let newVoters = [];

    //check if voting or unvoting and assemble data
    for(let i = 0; i<this.voters.length; i++){
      let v = this.voters[i];

      if(voterId.equals(v)){
        voting = false;
      }
      else {
        newVoters.push(v);
      }
    }

    //update author's kudos
    let author = await User.findById(this.author)
      .catch(err => {
        console.log(err);
      })
    let votes = voting ? author.votes + 1: author.votes -1;
    User.findByIdAndUpdate(
      this.author,
      {votes: votes},
      {useFindAndModify: false}
    ).catch(err => {
      console.log(err);
    });

    //return correct data
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
  }

};

//call with Model.methodName
commentSchema.statics = {

};

module.exports = mongoose.model('Comment', commentSchema);
