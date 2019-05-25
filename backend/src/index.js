let mongoose = require('mongoose')
let express = require('express')
let app = express()
// routes
// let blaRoute = require('./routes/bla')


let path = require('path')
let bodyParser = require('body-parser')

//middleware
app.use(bodyParser.json())

//middleware template
app.use((req, res, next) => {
  console.log('middleware used')
  next()
})

// app.use(blaRoute)


app.use((req, res, next) => {
  res.status(404).send("Things is jank!")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.info(`Server has started on ${PORT}`))

const url = "mongodb://localhost:27017/mydb"


mongoose.connect(url, {useNewUrlParser: true}, function(err, db) {

  if (err) throw err;
  console.log("Database created")

  let postSchema = new mongoose.Schema({
    title: String,
    owner: String,
    votes: Number
  });

  postSchema.methods.shout = function(){
    console.log(this.title + "!!!")
  }

  let Post = mongoose.model('post', postSchema)
  let posts = []

  for(let i=0; i<0; i++){
    let newp = new Post({
      title: "post_"+i,
      owner: "ssono",
      votes: Math.floor(Math.random() * 100)
    });

    newp.save(function(err, newp){
      if (err) return console.error(err);
    });
  }


  Post.find(function(err, posts){
    if (err) return console.error(err);
    console.log(posts);
  });

});
