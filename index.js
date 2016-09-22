var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
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
app.use(express.static('public'));

passport.use(new LocalStrategy({
  usernameField : "id",
  passwordField : "pw"
  },
  function(id, pw, done) {
    User.findOne({ id: id}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log("ID err")
        return done(null, false);
      }else if(user.pw != pw){
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


http.listen(3000, function(){
  console.log("Server Runnging at 3000 Port");
})


app.get('/', function(req, res){
  res.sendfile('index.html');
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
  },
  Friend : {
    type : []
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

io.on('connection',function(socket) {
  console.log('user')
  //get data(user info)
  socket.on('data', function(data) {
    console.log(data);
    var Data = data;
    //join group
    socket.join(data.room, function() {
      console.log('user' + socket.id + 'join at '+ data.room)
      io.in(data.room).emit('join','user ' + data.user + ' join at '+ data.room)
    })
    //get message
    socket.on('message',function(msg) {
      //response message at client
      socket.emit('mymsg', msg)
      //resoponse message at other
      socket.to(data.room).emit('msg', msg)
    })
  })
})



var User = mongoose.model('user', userSchema);
var Loca = mongoose.model('location', locationSchema);
var Pass = passport.authenticate('local')


require('./route/web')(app, User, Loca, Pass)
require('./route/and')(app, User, Loca, Pass)
require('./route/auth')(app, User, Pass)
