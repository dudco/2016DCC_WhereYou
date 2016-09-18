var express = require('express')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended : true
}))

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

require('./route/web')(app, User, Loca)
require('./route/and')(app, User, Loca)
