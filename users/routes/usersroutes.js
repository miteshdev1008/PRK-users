const { signup, sendotp, verifyotp, login, getmyprofile, changempin, changepass, getalluser, transactionuser, addaddress, deleteaddress, getmyaddress, logedout, dashboard, editaddress } = require('../controllers/usercontroller');
const { auth, islogedin } = require('../middlewares/auth');

const userrouter=require('express').Router();

userrouter.post('/usersignup',signup);

userrouter.post('/sendotp',sendotp);

userrouter.post('/verifyotp',verifyotp);

userrouter.post('/login',login);

userrouter.post('/dashboard',auth,islogedin,dashboard);

userrouter.put('/changempin',auth,islogedin,changempin);

userrouter.put('/resetpassword',auth,islogedin,changepass);

userrouter.get('/getalluser',getalluser);

userrouter.post('/transaction',auth,islogedin,transactionuser);

userrouter.post('/addaddress',auth,islogedin,addaddress);

userrouter.delete('/deleteaddress',auth,islogedin,deleteaddress);

userrouter.get('/getmyalladdress',auth,islogedin,getmyaddress);

userrouter.get('/logout',auth,logedout);

userrouter.put('/editaddress',auth,islogedin,editaddress);
module.exports=userrouter;
