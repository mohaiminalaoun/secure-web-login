'use strict';

let express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    _               = require('underscore');


var session = require('express-session');
var mongoose = require("mongoose");
var User = require('../../models/user');
var crypto = require('crypto');
var router = express.Router();


var fs = require('fs');


let app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('../../public'));

// mongodb connection
mongoose.connect("mongodb://localhost:27017/login");
var db = mongoose.connection;
//check for errors
db.on('error',console.error.bind(console,'connection error:'));



// Handle POST to create a new user account
app.post('/v1/user', function(req, res) {
    console.log("I am in index js");
    let data = req.body;
    console.log(data);
    if (!data || !data.username || !data.password) {
        res.status(400).send({ error: 'username, password, first_name, last_name and primary_email required' });
    } else {


        let passobj = saltHashPassword(data.hashed_password+"");


        let newUser = new User({
            username: data.username,
            hashed_password: passobj.passwordHash,
            salt : passobj.salt
        });

        console.log(newUser);
        newUser.save(function(err) {
            if (err) throw err;

            console.log('User created!');
        });
    }

});
//-------------------Function to get SALT
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};
//---------------------------------------------------------------------

//--------------Algorithm to generate hash
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};
//-------------------------------------------------------------


//--------------Function to hash password
function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('\nSalt = '+passwordData.salt);
    return passwordData;
}


let server = app.listen(8080, function () {
    console.log('Example app listening on ' + server.address().port);
});