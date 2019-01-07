var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var config  = require('./config/config');
var cors = require('cors');

var port =  process.env.PORT || 4000;

var app = express();
app.use(cors());

//get our request parameter
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Use the passport package in our application
app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

//Demo Route
app.get('/',(req, res)=>{
  return res.send('Hello! the API is at http://localhost:'+port+'/api');
});

var routes = require('./routes');
app.use('/api', routes);

mongoose.connect(config.db);
mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true);

const connection = mongoose.connection;

connection.once('open',()=>{
  console.log('MongoDb database connection established successfully!');
});

connection.on('error',(err)=>{
  console.log('MongoDB connection error Please make sure mongoDB is running');
  process.exist();
});

app.listen(port);
console.log('The ChatApi server is running at: http://localhost:'+port);
