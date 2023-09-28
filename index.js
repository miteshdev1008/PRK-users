const express=require('express');
const app = express();
const cookieParser = require('cookie-parser')   
require('express-async-errors');
const bp=require('body-parser');
var escape = require('escape-html');
var html = escape('&,/,<,>,,.');
const rateLimit = require("express-rate-limit");
var toobusy = require('toobusy-js');
var hpp = require('hpp');
const helmet=require('helmet');

app.use(helmet());
//for rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 600000,
  message: {success:false,mesageg:"you can\'t  make Too many request from same ip"}
});

app.use(limiter);
//when our server is too busy
app.use(function(req, res, next) {
  if (toobusy()) {
    res.status(503).json({success:false,message: "I'm busy right now, sorry."});
  } else {
    next();
  }
});

const customError=require('./users/middlewares/error');
const globalusererrorhandler=require('./users/controllers/errorcontroller');
require('dotenv').config();
require('./dbo');

const port=process.env.PORT;
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({extended:true,limit:'10mb'}));

app.use(cookieParser());
//for preventing http parameter pollution
app.use(hpp()); 

app.use('/api/v1/users',require('./users/routes/usersroutes'));

//when route is not found
app.all('*',(req,res,next)=>{
    console.log(typeof(customError));
  const err=new customError(`requested url${req.url} not found`,404);
  next(err)
})
app.use(globalusererrorhandler);

app.listen(port,()=>{
    console.log('app is live on port'+port);
});
