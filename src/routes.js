var express = require('express'),
    routes = express.Router();
var userController = require('./controller/user-controller');
var passport =  require('passport');

routes.get('/',(req, res)=>{
  return res.send('Hello, this is the API!.');
});

routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);

routes.get('/home', passport.authenticate('jwt',{session: false}), (req, res)=>{
  return res.json({msg:`Hey, ${req.user.userEmail}! I open at the close.`});
});

module.exports =  routes;
