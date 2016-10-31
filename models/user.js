/**
 * Created by Jesse on 10/30/2016.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true, // email must be unique
        required: true,
        trim: true
    },
    hashed_password: {
        type: String,
        //unique: true, // email must be unique
        //required: true,
        trim: true
    },
    salt:{
        type: String,
        //unique: true, // email must be unique
        // required: true,
        trim: true
    }
});



// this gets me the user by username
UserSchema.statics.getUser=function(username,callback){
    User.findOne({username: username})
        .exec(function(error,user){
            if(error){
                return callback(error);
            }else if(!user){
                return callback(error);
            }else{
                return callback(null,user);
            }
        })
}

UserSchema.statics.getIdFromName = function(username,callback){
    User.findOne({username: username})
        .exec(function(error, user){
            if(error){
                console.log(error);
                return callback(error);
            }else if(!user){
                return callback(error);
            }else{
                return callback(null, user._id);
            }
        })
}

UserSchema.statics.getUserByEmail=function(email,callback){
    User.findOne({primary_email: email})
        .exec(function(error,user){
            if(error){
                return callback(error);
            }else if(!user){
                return callback(error);
            }else{
                return callback(null,user);
            }
        })
}

UserSchema.statics.updateUser = function(email, username, first_name, last_name, callback){
    User.update({primary_email: email},
        {$set: {username: username, first_name: first_name, last_name: last_name}});
    return callback();
};

// this authenticates the user against the database
UserSchema.statics.authenticate = function(username, password, callback){
    User.findOne({username: username})
        .exec(function(error, user){
            if(error){
                return callback(error);
            }else if(!user){
                var err = new Error("User not found");
                err.status = 401;
                return callback(err);
            }
            // if we reach this part of the code, then there is a valid username
            let salt = user.salt;
            console.log("salt is "+salt);

            let givenPassObj = sha512(password, salt);
            if(givenPassObj.passwordHash===user.hashed_password){
                return callback(null, user);
            }else{
                console.log(givenPassObj.passwordHash);
                console.log(user.hashed_password);
                return callback();
            }

        });
};



var User = mongoose.model('User',UserSchema);
module.exports = User;