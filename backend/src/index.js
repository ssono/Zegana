const mongoose = require('mongoose');
const express = require('express');
const app = express();
// routes
// let blaRoute = require('./routes/bla')
const commentRoute = require('./controllers/commentRoute');
const userRoute = require('./controllers/userRoute');
const postRoute = require('./controllers/postRoute');

const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//middleware template
// app.use((req, res, next) => {
//   console.log('middleware used');
//   next();
// });

// app.use(blaRoute)
app.use(commentRoute);
app.use(userRoute);
app.use(postRoute);

//Server and DB

const port = process.env.PORT || 8000;
const dbUrl = "mongodb://localhost:27017/mydb";

connect();

function listen() {
  app.listen(port);
  console.log('App started on port ' + port);
}

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);
  return mongoose.connect(dbUrl, { keepAlive: 1, useNewUrlParser: true });
}
