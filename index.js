var express = require('express')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')

app.use(bodyParser.urlencoded({extended : true}))
//setHeaders
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
app.use(session({
  secret: '1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField : "id",
  passwordField : "password"
  },
  function(id, password, done) {
    User.findOne({ id: id}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log("ID err")
        return done(null, false);
      }else if(user.pw != password){
        console.log("Password Err")
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log("serialize")
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  console.log("deserialize")
  User.findById({_id : id}, function(err, user) {
    if(err){
      console.log("Error" + err)
      done(null, false)
    }else{
      done(null, user);
    }
  });
});

var schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/wy", function(err) {
  if(err){
    console.log("MongoDB Error!");
    throw err;
  }
})


app.listen(3000, function(){
  console.log("Server Runnging at 3000 Port");
})

app.get('/', function(req, res){
  res.send('Server Runnging at Port 3000');
})

var userSchema = new schema({
  id : {
    type : String
  },
  pw : {
    type : String
  },
  name : {
    typd : String
  },
  MD : {
    type : Date
  }
})
var locationSchema = new schema({
  id : {
    type : String
  },
  loca_g : {
    type : String
  },
  loca_w : {
    type : String
  }
})

var User = mongoose.model('user', userSchema);
var Loca = mongoose.model('location', locationSchema);
var Pass = passport.authenticate('local')


require('./route/web')(app, User, Loca, Pass)
require('./route/and')(app, User, Loca, Pass)
require('./route/auth')(app, User, Pass)
