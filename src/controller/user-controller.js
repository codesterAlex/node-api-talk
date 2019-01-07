var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

function createToken(user){
  return jwt.sign({
    id:user.id,
    userEmai:user.userEmail,
  },
  config.jwtSecret,
{
  expiresIn:200//8600 expires in 24 hours
});
}

exports.registerUser=(req,res)=>{
  if(!req.body.userEmail || !req.body.userPassword){
    return res.status(400).json({'msg':'You need to send email and password'});
  }

  User.findOne({userEmail: req.body.userEmail},(err,user)=>{
    if(err){
      console.log("querying database");
      return res.status(400).json({'msg':err});
    }
    if(user){
      return res.status(400).json({'msg':'The user already exist'});
    }

    let newUser = User(req.body);
    newUser.save((err, user)=>{
      if(err){
        console.log(err);
        console.log("not saved");
        return res.status(400).json({'msg':err});
      }
      console.log("saved");
      return res.status(201).json(user);
    });
  });
};

exports.loginUser =(req, res)=>{
  if(!req.body.userEmail || !req.body.userPassword)
  {
    return res.status(400).send({'msg':`You need to send email and password.`});
  }
  User.findOne({userEmail: req.body.userEmail}, (err, user)=>{
    if(err)
    {
      return res.status(400).send({'msg':err});
    }
    if(!user){
      console.log(req.body.userEmail);
      return res.status(400).json({'msg':'The user does not exist'});
    }
    user.comparePassword(req.body.userPassword, function(err, isMatch){
      if(isMatch && !err)
      {
        return res.status(200).json({
          token: createToken(user)
        });
      }else{
        console.log(err);
        return res.status(400).json({msg:'The email and password don\'t match.'});
      }
    });
  });
};
