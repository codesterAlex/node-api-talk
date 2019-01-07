var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema =  new mongoose.Schema({
  userEmail:{
    type:String,
    unique:true,
    required:true,
    trim:true
  },
  userPassword:{
    type:String,
    required: true
  },
  firstName:{
    type:String,
    required: false
  },
  lastName:{
    type:String,
    required: false
  },
  userName:{
    type:String,
    required: false
  },
  language:{
    type:String,
    required: false
  }
});

userSchema.pre('save', function(next){
  var user = this;

  if(!user.isModified('userPassword')) return next();

  bcrypt.genSalt(10, (err, salt)=>{
    if(err) return next(err);

    bcrypt.hash(user.userPassword, salt, (err, hash)=>{
        if(err) return next(err);
        user.userPassword = hash;
        next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb){
  bcrypt.compare(candidatePassword, this.userPassword,(err, isMatch)=>{
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
