require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./route/route')
const app = express();
require("../auth/strategies/googleLoginStrategy")



const passport = require('passport');
const session = require('express-session')
// const googleStrategies=require('./auth/strategies/googleLoginStrategy');


app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}))

app.use(passport.initialize());
app.use(passport.session());
//DB Connection 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb+srv://Shreya1998:1234.qwer@cluster0.gzlyp.mongodb.net/Final-DB?retryWrites=true&w=majority',{
    useNewUrlParser:true
})



.then (() => console.log('mongoDB is connected '))
.catch(err => console.log(err))
app.use('/',router)

app.listen(process.env.PORT || 3000,()=>{
    console.log(`server is running on port 3000`);
})













