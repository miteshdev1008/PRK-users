const usermodel = require('../models/usermodel');
const otpmodel = require('../models/otp');
const transactionmodel = require('../models/transactions');
const addressmodel = require('../models/address');
const { otpexpires, gettimeformat } = require('../utilities/utility');
const { passcheck, stringonly } = require('../validators/validation');
const { createtoken } = require('../middlewares/token');
require('dotenv').config('../.env');
const customError=require('../middlewares/error')
//creating asynchandler higherorder function
const asyncerrorhandler=(fun)=>{
  return(req,res,next)=>{
    console.log("a");
      fun(req,res,next).catch(err=>next(err));
}}

const signup = asyncerrorhandler(async (req, res) => {
console.log("b");
  const mobile = req.body.mobile;
  const otp = req.body.otp;
  console.log(otp);
  if (!mobile && !otp) return res.status(417).json({ success: false, message: 'please enter mobileno and otp',data:{}});

  //  const verifyuser=await otpmodel.find({no:mobile});
  // //  console.log(verifyuser);
  //  if(!verifyuser.length>0) return res.status(417).json({success:false,message:'this mobile number is not found any match please enter valid mobile number'});

  //    time=verifyuser[0].updatedAt;
  //   //  console.log(time);
  //    const checklimit=otpexpires(time);
  //    console.log("expires"+checklimit);
  //    if(checklimit==false) return res.status(417).json({success:false,message:'your otp has been expires'});
  //  console.log(verifyuser[0].otp+" "+otp);

  //  if(verifyuser[0].otp!=otp) return res.status(417).json({success:false,data:'sorry your otp has not been matched'});

  const prop = ['city', 'password', 'mobile', 'conformpassword', 'mpin'];
  const empty = [];
  for (var i = 0; i < prop.length; i++) {
    if (req.body.hasOwnProperty(prop[i])) {
      console.log(prop[i])
      continue;
    }
    else {
      empty.push(prop[i]);
      console.log("is" + empty)
    }
  }
  console.log(empty);
  const spcae = "please enter field :" + empty.toString();
  if (empty.length != 0) return res.status(417).json({ success: false, message: spcae,data:{}});

  const user = req.body;
  if (user.mobile.length != 10) return res.status(417).json({ success: false, status: 417, message: 'please enter 10 digit mobile no',data:{}})
  if (isNaN(user.mobile)) return res.status(417).json({ success: false, status: 417, message: 'please enter digits only in mobileno',data:{}});

  // var userregister = await usermodel.find({ mobile: user.mobile });
  // if (userregister.length > 0) return res.status(409).json({ success: false, status: 409, message: 'user already register' });
  // //  console.log("name is "+checkname);

 // if (!user.name.length > 0) return res.json({ success: false, message: 'please enter name',data:{}});
  //const checkname = stringonly(user.name);
  // console.log(checkname)
  //if (checkname != true) {
   // const mesage = checkname + ' only in name'
    //return res.json({ success: false, message: mesage,dat:{}});
 // }

  if (!user.city.length > 0) return res.json({ status: false, message: 'please enter city name',data:{}});
  const checkcity = stringonly(user.city);
  if (checkcity != true) {
    const mesage = checkcity + 'in city'
    return res.json({ success: false, message: mesage,data:{}});
  }

  //  if(user.city) return res.json({status:false,message:'please enter city in characters ojnly'}) 
  if (!user.password.length > 0) return res.status(417).json({ success: false, message: 'please enter password',data:{}})
  const passc = passcheck(user.password);

  if (passc != true) return res.status(417).json({ success: false, status: 417, message: passc,data:{}});

  if (user.conformpassword != user.password) return res.status(417).json({ success: false, status: 417, message: 'conform and  password doesn\'t match',data:{}});

  if (user.mpin.length != 4) return res.status(417).json({ success: false, status: 417, message: 'please enter 4 digit m-pin',data:{}})
  if (isNaN(user.mpin)) return res.status(417).json({ success: false, status: 417, message: 'your mpin contains non digitvalue please enter only digits',data:{}});

  //saving user 
  const newuser = new usermodel({ name: user.name, password: user.password, mobile: user.mobile, city: user.city, mpin: user.mpin });
  var usersave = await newuser.save();
  //  console.log(usersave);
  if (usersave) {
    const token = await createtoken(usersave._id);
    console.log(token)
    const finaldatais = { name: usersave.name, mobile: usersave.mobile, balanceofuser: usersave.balanceofuser, token:token }
    res.json({ success: true, status: 200, data: finaldatais })
  }
  else {
    return res.status(417).json({ success: false, message: 'signup failed',data:{}});
  }
}
)

const sendotp = asyncerrorhandler(async (req, res) => {
  const { phone_no } = req.body;
  if (!phone_no) return res.status(417).json({ success: false, message: 'please enter phone number',data:{}});

  if (isNaN(phone_no)) return res.status(417).json({ success: false, message: 'please enter digits only in phone no',data:{}});

  if (phone_no.length != 10) return res.status(417).json({ success: false, message: 'please enter 10 digit number',data:{}});

  // const finduser=await usermodel.find({mobile:no});
  // res.json(finduser.length);

  // if(finduser.length>0) return res.json({success:false,message:'user already registered'});
  let otp = "";
  for (i = 0; i <= 5; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  // console.log(otp+no);
  const accountSid = process.env.SMS_KEY_ID;
  const authToken = process.env.SMS_AUTHTOKEN;
  const client = require('twilio')(accountSid, authToken);
  const message = `your otp for verify your account is${otp} it's expires in 2 min`;
  const reciverno = `+91${phone_no}`;
  const sendmessage = await client.messages
    .create({
      body: message,
      to: reciverno,
      from: process.env.SMS_FROMNO,
    }).catch(e => { console.log("yes  " + e); });
  // console.log(Date.now());
  if (sendmessage) {
    // const saveotp=await new otpmodel({no:no,otp:otp}).upsert();
    const updt = await otpmodel.updateOne(
      { no: phone_no },
      { $set: { otp: otp } },
      { upsert: true },
      { new: true }, // Make this update into an upsert
    );
    console.log(updt);
    // console.log(Date.now());
    res.status(200).json({ success: true, message: 'otp sent successfully', data: phone_no });
  }
  else {
    res.json({ success: false,data:{}, message: 'error while generating otp' });
  }


}
)

const verifyotp = asyncerrorhandler(async (req, res) => {
  const phone_no = req.body.phone_no;
  const otp = req.body.otp;
  console.log(!otp);
  if (!phone_no || !otp) return res.json({ success: false,data:{}, message: 'please enter no and otp' });

  const verifyuser = await otpmodel.find({ no: phone_no });
  console.log(verifyuser);
  if (!verifyuser.length > 0) return res.status(417).json({ success: false, message: 'please enter valid no',data:{}});

  time = verifyuser[0].updatedAt;
  console.log(time);
  const checklimit = otpexpires(time);
  console.log(checklimit);
  if (checklimit == false) return res.status(401).json({ success: false, message: 'your otp has been expires',data:{}});
  // console.log(verifyuser[0].otp+" "+otp);
  if (verifyuser[0].otp != otp) return res.status(417).json({ success: false, data: 'sorry your otp has not been matched',data:{}});

  const finduserid = await usermodel.find({ mobile: phone_no })
  // const tk=createtoken(finduserid[0]._id)
  // console.log(finduserid[0]._id);
  return res.status(200).json({ success: true, message: 'welcome user' });
}
)

const login = asyncerrorhandler(async (req, res) => {
  const user = req.body;

  if (!user.mobile && !user.password) return res.json({ success: false, status: 417, message: 'please enter email and password',data:{}})
  if (!user.mobile) return res.status(417).json({ success: false, status: 417, message: 'please enter email',data:{}});

  if (!user.password) return res.status(417).json({ success: false, status: 417, message: 'please enter password',data:{}});

  const userfind = await usermodel.find({ mobile: user.mobile });
  // console.log(userfind);
  if (userfind.length == 0) return res.status(417).json({ success: false, status: 417, message: 'please signup',data:{}})

  if (userfind.length > 0 && userfind[0].password == user.password) {
    const token = await createtoken(userfind[0]._id);
    // console.log(token)
    const finaldatais = { name: userfind[0].name, mobile: userfind[0].mobile, balanceofuser: userfind[0].balanceofuser, token: token }
    res.cookie('token', token, {
      httpOnly: true
    })
    res.json({ success: true, status: 200, data: finaldatais })
  }
  else { res.status(417).json({ success: false, status: 417, message: 'you are entering wrong password',data:{}}); }
}
)

const dashboard = asyncerrorhandler(async (req, res) => {
  // console.log(req.cookies.token) 
  const user = req.user;
  // console.log(req.user);
  const userdetails = await usermodel.findById(user[0]._id);

  var final=[];
  for (let i = 0; i <= 7; i++) {
    if (i == 0) continue;
   
    var startdate = new Date().setDate(new Date().getDate() - i);
      var enddate = new Date().setDate(new Date().getDate() - i + 1);
     
  
    const senddata = await transactionmodel.find({ $and: [{ from: '6492d0d0397c51cfa21a72f9' }, { createdAt: { $gte: startdate, $lt: enddate} }] });
    const receivedata = await transactionmodel.find({ $and: [{ to: '6492d0d0397c51cfa21a72f9' }, { createdAt: { $gte: startdate, $lt: enddate } }] });
  

  console.log(new Date(startdate).toString().split(' ')[2]+" "+new Date(enddate).toString().split(' ')[2])
 
var send=senddata.reduce((sum,ele)=>{return sum+ele.amount},0);
var receive=receivedata.reduce((sum,ele)=>{return sum+ele.amount},0);


    final.push({ days: new Date(startdate).toString().split(' ')[0], send:send,rec:receive});
    
  }

  const fres = { id: userdetails._id, name: userdetails.name, balance: userdetails.balanceofuser.toString(), weekly: final }

  res.json({ success: true, message: 'your profile is', data: fres });
}
)

const changempin = asyncerrorhandler(async (req, res) => {
  const user = req.user;
  //  console.log("condition result is"+!req.body.oldmpin||req.body.oldmpin.length!=4)

  if (!req.body.oldmpin || req.body.oldmpin.length != 4) return res.status(417).json({ success: false, message: 'please enter 4 digit old mpin',data:{}})
  const regex = /^[0-9]+$/;
  //console.log("test result is"+regex.test(req.body.oldmpin)==false)
  if (regex.test(req.body.oldmpin) == false) return res.status(417).json({ success: false, message: 'please enter only numeric value in mpin',data:{}})

  if (!req.body.newmpin) return res.status(417).json({ success: false, message: 'please enter new mpin',data:{}});
  if (regex.test(req.body.newmpin) == false) return res.status(417).json({ success: false, message: 'please enter only numeric value in newmpin',data:{}})

  if (!req.body.conformmpin) return res.status(417).json({ success: false, message: 'please enter conform mpin',data:{}});
  if (regex.test(req.body.conformmpin) == false) return res.status(417).json({ success: false, message: 'please enter only numeric value in conformmpin',data:{}})

  if (req.body.newmpin != req.body.conformmpin) return res.status(417).json({ success: false, message: 'newmpin and conformmpin doesn\'t match',data:{}});

  if (user[0].mpin != req.body.oldmpin) return res.status(417).json({ success: false, message: 'your old mpin isnot match with oldone',data:{}});

  const updateuser = await usermodel.findByIdAndUpdate(user[0]._id, { mpin: req.body.newmpin }, { new: true });

  return res.json({ success: true, message: 'mpin is updatedsuccessfully',data:{}})
}
)

const changepass = asyncerrorhandler(async (req, res) => {
  const user = req.user;
  const prop = ['oldpassword', 'newpassword', 'conformpassword'];
  const empty = [];
  for (var i = 0; i <= prop.length; i++) {
    if (req.body.hasOwnProperty(prop[i]))
      continue;
    else
      empty.push(prop[i]);
  }
  // console.log(empty);
  empty.pop(empty.length - 1);
  const spcae = "please enter field :" + empty.toString();
  //  console.log(empty.length);
  if (empty.length != 0) return res.status(417).json({ success: false, status: 417, message: spcae ,data:{}});

  const passc = passcheck(req.body.newpassword);
  if (passc != true) return res.status(417).json({ success: false, status: 417, message: passc,data:{} });
  //  console.log(passc);
  if (req.body.newpassword != req.body.conformpassword) return res.json({ status: 417, success: false, message: 'new and conform password doesn\'t match',data:{} })
  //  console.log("first")
  //  console.log(req.user)
  if (req.body.oldpassword != req.user[0].password) return res.status(417).json({ success: false, message: 'your old password isnot match with current',data:{}});
  //  console.log(req.user[0].password)
  //  console.log(req.user[0]);
  const updatepass = await usermodel.findByIdAndUpdate(req.user[0]._id, { $set: { password: req.body.newpassword } }, { new: true });
  res.status(200).json({ success: true, message: 'password changes successfully',data:{}});

})

const getalluser = asyncerrorhandler(async (req, res) => {
  const alluser = await usermodel.find();
  res.json(alluser);
})

const transactionuser = asyncerrorhandler(async (req, res) => {
  //  res.json({user:req.user});
  const user = req.user;
  const prop = ['receiverno', 'amount', 'commission'];
  // console.log(prop.length)
  const empty = [];
  for (var i = 0; i <= prop.length; i++) {
    if (req.body.hasOwnProperty(prop[i]))

      continue;
    else
      empty.push(prop[i]);
  }

  empty.pop(empty.length - 1);
  // console.log(empty);
  const space = "please enter field :" + empty.toString();
  if (empty.length != 0) return res.status(417).json({ success: false, status: 417, message: space,data:{} });

  const checkno=parseFloat(req.body.amount);
  if(checkno<=0) return res.status(417).json({success:false,message:'please enter amount bigger than 0',data:{}})
  //console.log("test result is"+regex.test(req.body.oldmpin)==false)
  if (isNaN(req.body.receiverno)) return res.status(417).json({ success: false, message: 'please enter digit only in receiver\'s no',data:{}})
  
  const regex = /^[0-9+.]+$/;
  //console.log("test result is"+regex.test(req.body.oldmpin)==false)
 if (regex.test(req.body.receiverno) == false) return res.status(417).json({ success: false, message: 'please enter digit only in receiver\'s no',data:{}})
  if (req.body.receiverno.length != 10) return res.status(417).json({ success: false, message: 'please enter 10 digit in receiver\'s no',data:{}})
    
  if (regex.test(req.body.amount) == false) return res.status(417).json({ success: false, message: 'please enter amount in digits only',data:{}});
  if(isNaN(parseFloat(req.body.commission))) return res.status(417).json({success:false,message:'please enter commission in digit only',data:{}})
  if (parseFloat(req.body.commission)<=0) return res.status(417).json({ success: false, message: 'please enter commission',data:{}});

    const findreceiver=await usermodel.find({mobile:req.body.receiverno});
      if(findreceiver.length<=0) return res.status(417).json({success:false,message:'receiver not found',data:{}})
  console.log(user[0].balanceofuser < parseFloat(req.body.amount));
  if (user[0].balanceofuser < req.body.amount) return res.status(417).json({ success: false, message: 'your are not able to do transaction due to low balance',data:{}})
  var amount = parseFloat(req.body.amount);
  
  var newtrans = new transactionmodel({ from: user[0]._id, to: findreceiver[0]._id, type: req.body.type, amount: amount });
  var transsave = await newtrans.save();

  if (newtrans) {
    const newbalance = user[0].balanceofuser - amount;
    const addbalance=await usermodel.find({mobile:req.body.receiverno})
    const updatebalance=addbalance[0].balanceofuser+amount;
    // return console.log("updated balance is"+updatebalance);
    await usermodel.findByIdAndUpdate(addbalance[0]._id,{balanceofuser:updatebalance},{new:true});
    await usermodel.findByIdAndUpdate(user[0]._id, { balanceofuser: newbalance }, { new: true });
    const checkuser=await usermodel.find({mobile:req.body.receiverno})
    console.log("checkuser is"+checkuser)
    //for date format
    var currentDate = new Date();

    var monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    var month = monthNames[currentDate.getMonth()];
    var date = currentDate.getDate();
    var year = currentDate.getFullYear();

    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();

    const dt = `${month} ${date},${year} ${hours}:${minutes}`;

    const fr = await usermodel.findOne({ mobile: req.body.receiverno }, { name: 1, _id: 0 });
    const format = { amount: parseFloat(amount), status: 'success', transactionid: transsave._id, datentime: dt, payto: fr.name, mobileno: req.body.receiverno };
    res.status(200).json({ success: true, data: format });
  }
  else {
    res.status(417).json({ status: 417, message: 'transactin is failed',data:{}});
  }
})

const addaddress = asyncerrorhandler(async (req, res) => {
  // res.json('add adress here');
  // const user=req.user;
  const prop = ['lat', 'long', 'address', 'type', 'title'];
  const empty = [];
  for (var i = 0; i < prop.length; i++) {
    if (req.body.hasOwnProperty(prop[i]))
      continue;
    else
      empty.push(prop[i]);
  }
  const spcae = "please enter field :" + empty.toString();
  // console.log(empty);
  if (empty.length != 0) return res.status(417).json({ success: false, status: 417, message: spcae,data:{}});

  // const latPattern = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
  // const lonPattern = /^[-+]?((1[0-7]\d(\.\d+)?|180(\.0+)?)|(0?\d{1,2}(\.\d+)?))$/;

  // console.log(latPattern.test(req.body.lang)!=true&&lonPattern.test(req.body.lat)!=true)
  // if(lonPattern.test(req.body.lang)!=true&&latPattern.test(req.body.lat)!=true) return res.status(417).json({success:false,message:'please enter valid lattitude and longitude'})

  if (!req.body.address || req.body.address.length <= 0) return res.status(417).json({ success: false, message: 'please enter address',data:{}})
  // console.log(req.body.title.length<=0)
  if (req.body.title.length <= 0) return res.status(417).json({ success: false, message: 'title field should not be empty',data:{}});
  if ((req.body.type != 'home') && (req.body.type != 'office') && (req.body.type != 'other')) return res.status(417).json({ success: false, message: 'please select proper address type',data:{}});
  const user = req.user;
  const addaddress = new addressmodel({ title: req.body.title, lat: req.body.lat, long: req.body.long, type: req.body.type, address: req.body.address, uploadedby: user[0]._id });
  await addaddress.save();
  res.status(200).json({ success: true, message: 'your adddress added successfully',data:{}});

})

const deleteaddress = asyncerrorhandler(async (req, res) => {
  if (!req.body.id || req.body.id.length <= 0) return res.status(417).json({ success: false, message: 'please enter id to delete address',data:{}});

  const user = req.user;
  //  if((req.user[0].address.reduce(ele=>{return ele==req.body.address}))!=true) return res.status(417).json({success:false,message:'please enter valild address'});
  const addaddress = await addressmodel.findByIdAndDelete(req.body.id);
  // console.log(addaddress)
  // console.log(addaddress);
  res.status(200).json({ success: true, message: 'your adddress has been deleted successfully',data:{}});

})

const getmyaddress = asyncerrorhandler(async (req, res) => {
  const address = await addressmodel.find({ uploadedby: req.user[0]._id }, { uploadedby: 0, __v: 0, createdAt: 0, updatedAt: 0 });
  const final = address.map(ele => { ele.type, ele.title, ele.address });
  //console.log(final)  
  res.status(200).json({ success: true, data: address });

})

const logedout = asyncerrorhandler(async (req, res) => {
    const user=req.user[0];
    const deletetoken=await usermodel.findByIdAndUpdate(user._id,{token:null});
    if(deletetoken) return res.status(200).json({sucess:true,message:'user loggedout successfully'})
  return res.status(417).json({sucess:false,message:'you are alreadyloggedout',data:{}});
  
})

const editaddress=asyncerrorhandler(async(req,res,next)=>{
    console.log(req.body.id.length>0);
    if(req.body.id.length<=0) { const err=new customError(`please enter id`,417);
    next(err);
    return
  }
    const user=req.user;
      // res.json(user);
      const updateaddressis=await addressmodel.findById(req.body.id);
          // console.log(updateaddressis);
      if(user[0].id!=updateaddressis.uploadedby) {
         const err=new customError(`you are not validate to edit this address`,417);
      next(err);
      return
    } 

      const updateadd=await addressmodel.findByIdAndUpdate(req.body.id,{$set:req.body})
      res.json({success:true,msg:'your address has been updated successfully'});
  })

module.exports = { editaddress,getmyaddress, deleteaddress, addaddress, transactionuser, getalluser, signup, sendotp, verifyotp, login, dashboard, changempin, changepass ,logedout}