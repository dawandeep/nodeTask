const express = require('express');
const logger = require('morgan');
const repo = require('./Repository/UserRepository')
const passport = require('passport');
const mongoose = require('mongoose');
const userModel = require('./Model/userModel')
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes/UserRoutes');
const dbStore = require('connect-mongodb-session')(session);
const app = express();
const DB_URI = 'mongodb://127.0.0.1:27017/AuthesDB';
const store = new dbStore({
    uri:DB_URI,
    collection:'app-session'
});
mongoose.connect(DB_URI);
mongoose.connection.once('open',(err)=>{
    if(!err){
        console.log("Connected to DB");
    }
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({
    secret:'this is my secret',
    saveUninitialized:false,
    cookie:{
        maxAge:60000
    },
    store:store,
    resave:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(repo.LoginUser());
app.use('/api/v1/auth', routes);
passport.serializeUser(function(user,done){
    done(null,user._id)
});
passport.deserializeUser(function(id,done){
    userModel.findById(id,function(err,user){
        done(err,user);
    });
});
const port = process.env.PORT || 7000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})