const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type:String
    },
    tokenExp: {
        type: Number
    }
});

const bcrypt = require('bcrypt');
const saltRounds = 10;

userSchema.pre('save', function(next){
    var user = this;

    if (user.isModified('password')) {
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);

                user.password = hash;
                //console.log("passward encrypt : " + user.password);
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cd) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err),
        cb(numm, isMatch);
    });
}
const jwt = require('jsonwebtoken');
userSchema.methods.generateToken = function(cb) {
    var user = this;
    console.log(user._id);
    //토큰 생성 처리
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    console.log("user Token : " + token);
    user.token = token;
    
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    });
}

const User = mongoose.model('User', userSchema);
module.exports = {User};