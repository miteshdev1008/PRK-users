const jwt=require('jsonwebtoken');
// const nodemailer=require('nodemailer');

require('dotenv').config({ path: '/home/siddharth/prk/.env' });
const seckey=process.env.JWTSECKEY;
const usermodel=require('../models/usermodel');

const auth=async(req,res,next)=>{
    // console.log(req.cookies);
    // console.log('hello');
    if(!req.headers.authorization) return res.json({success:false,msg:'please provide token',data:{}});
    const token=req.headers.authorization.split(" ")[1];
    if(token){
        const decode=jwt.verify(token,seckey);
        console.log(decode);
        const id=decode.id;
        const user=await usermodel.find({_id:id});
        if(user.length>0) 
        {req.user=user;
        next();}
        else  res.status(417).json({success:false,msg:'please provide valid token',data:{}});
}
else{
    res.status(417).json({success:false,msg:'this route is protected please enter token',data:{}})
}
}

const islogedin=async(req,res,next)=>{
    if(!req.headers.authorization) return res.json({success:false,msg:'please provide token'});
    const token=req.headers.authorization.split(" ")[1];
    if(token){
        
     if(token!=req.user[0].token) return res.status(417).json({success:false,message:'you are logeed out'});
    
    next();
    }
        else  res.status(417).json({success:false,msg:'please provide valid token',data:{}});

}
module.exports={auth,islogedin}