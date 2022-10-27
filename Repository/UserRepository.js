const UserModel = require('../Model/userModel');
const bcrypt = require("bcryptjs");
const LocalStrategy = require('passport-local');
const GetUser = () => {
    return new Promise((resolve,reject)=>{
      UserModel.find({},(err,data)=>{
    if(!err)
     {
        resolve(data)
     }
     else{
        reject(err)
     }
 })
    })
}
const RegisterUser = (userdata) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: userdata.email }, (err, user) => {
            if (user) {
                resolve({ status: 409, message: 'User with specified email already exists' });
            } else if (!user) {
                let usermodel = new UserModel();
                usermodel.firstname = userdata.firstname;
                usermodel.lastname = userdata.lastname;
                usermodel.city = userdata.city;
                usermodel.phone = userdata.phone;
                usermodel.email = userdata.email;
                usermodel.password = bcrypt.hashSync(userdata.password, 10);
                usermodel.save((err) => {
                    if (!err) {
                        resolve({ status: 200, message: 'User registered successfully' });
                    } else {
                        throw err;
                    }
                });
            } else {
                reject(err);
            }
        });
    });
};
const LoginUser=()=>{
        return new LocalStrategy({usernameField:'email',passwordField:'password'},function(username,password,done){
        UserModel.findOne({email:username},(err,user)=>{
            if(err){
                return done(err);
            }
            if(!user){
                return done(null,false,{message:'Incorrect Email'});
            }
            if(!bcrypt.compareSync(password,user.password)){
                return done(null,false,{message:'Incorrect Password'});
            }
            return done(null,user);
        });
    });
};
module.exports = {RegisterUser,LoginUser,GetUser};