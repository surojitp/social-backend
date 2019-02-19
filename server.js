const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();
//Bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//DB config
const db = require("./config/keys").localURI;

//Connect to Mongodb
mongoose.connect(db)
  .then(() => {
    console.log("Connected to Mongodb")
  })
  .catch((err) => {
    console.log(err)
  })


// passport middleware
app.use(passport.initialize());

//passport config
//require('./config/passport')(passport);

//USE Routs
app.use('/api/users', users);
app.use('/api/profile', profile);
// app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);

})